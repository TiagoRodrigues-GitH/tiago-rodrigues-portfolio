import {
  Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation, afterNextRender, computed, inject, signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import type { FeatureCollection } from 'geojson';
import { injectLangQuery, injectLocale } from '../../services/locale';
import { AlgorithmPanelComponent } from './algorithm-panel/algorithm-panel.component';
import { AlgorithmKey, DEFAULT_PARAMS, ORDER, Params } from './engine/algorithm-catalog';
import { SearchPlayer } from './engine/search-player';
import { RouteResult } from './engine/search-trace';
import { GraphPayload, StreetGraph, buildGraph, components, edgeBetween, nearestNode, pathEdges } from './engine/street-graph';
import { BBox, MapView } from './map-view';
import { OnewayDemoComponent } from './oneway-demo/oneway-demo.component';
import { MapLegendComponent } from './playback/map-legend.component';
import { MapTraceRenderer } from './playback/map-trace-renderer';
import { PlaybackBarComponent } from './playback/playback-bar.component';
import { PlaybackController } from './playback/playback-controller';
import { RoutingClient, StaleRunError } from './routing-client';
import { STREET_I18N, STREET_REFERENCES } from './street-i18n';

interface Place { code: number | string; name: string; bbox: BBox; uf?: string; state?: number; municipality?: number; area?: string }
/** A city (or group of municipalities) with a street graph: graph/<id>.json. */
interface RoutedArea { id: string; name: string; municipalities: number[]; bbox: BBox; bytes?: number }
interface Places { states: Place[]; municipalities: Place[]; bairros: Place[]; routed: RoutedArea[] }
type PlaceKind = 'state' | 'municipality' | 'bairro';
interface Match { kind: PlaceKind; place: Place; label: string }
interface Row { key: AlgorithmKey; cost: number; gap: number | null; work: number; ms: number }
type Outcome = { kind: 'found' | 'none' | 'same' | 'error'; result?: RouteResult };

const ASSETS = 'assets/street-routing';
const BRAZIL: BBox = [-74, -34, -34.7, 5.3];
const WIDE = '(min-width: 1024px)';

function normalise(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((text, [k, v]) => text.replace(`{${k}}`, v), template);
}

/**
 * Project page: IBGE boundaries from Brazil down to a neighbourhood, street graphs of six areas built from IBGE
 * block faces, and path-finding algorithms computed in a Web Worker and replayed step by step on the map.
 */
@Component({
  selector: 'app-street-routing',
  imports: [RouterLink, AlgorithmPanelComponent, PlaybackBarComponent, MapLegendComponent, OnewayDemoComponent],
  templateUrl: './street-routing.html',
  styleUrls: ['./street-routing.css'],
  // MapLibre creates its controls outside Angular's templates, so its stylesheet cannot be encapsulated;
  // every rule of this page is scoped under .street-page instead.
  encapsulation: ViewEncapsulation.None,
})
export class StreetRoutingComponent implements OnDestroy {
  @ViewChild('mapEl') private mapEl?: ElementRef<HTMLElement>;
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);

  readonly locale = injectLocale();
  readonly langQuery = injectLangQuery(this.locale);
  readonly t = computed(() => STREET_I18N[this.locale()]);
  readonly references = STREET_REFERENCES;
  readonly order = ORDER;

  readonly places = signal<Places | null>(null);
  readonly failed = signal(false);
  readonly query = signal('');
  readonly active = signal(0);
  readonly selection = signal<Match | null>(null);
  readonly status = signal('');
  readonly statusError = signal(false);
  readonly showBairros = signal(true);
  readonly aboutOpen = signal(true);

  readonly area = signal<RoutedArea | null>(null);
  readonly hasBairros = signal(false);
  readonly origin = signal<number | null>(null);
  readonly destination = signal<number | null>(null);
  readonly nextPick = signal<'origin' | 'destination'>('origin');
  readonly algorithm = signal<AlgorithmKey>('astar');
  readonly params = signal<Params>({ ...DEFAULT_PARAMS });
  readonly computing = signal(false);
  readonly outcome = signal<Outcome | null>(null);
  readonly rows = signal<Row[]>([]);
  readonly via = signal<string[]>([]);

  readonly playback = new PlaybackController();

  readonly sections = computed(() => [
    { id: 'map', label: this.t().mapTitle },
    { id: 'oneway', label: this.t().onewayTitle },
    { id: 'method', label: this.t().methodTitle },
    { id: 'algorithms', label: this.t().algorithmsTitle },
    { id: 'references', label: this.t().referencesTitle },
  ]);

  readonly matches = computed<Match[]>(() => {
    const p = this.places();
    const q = normalise(this.query().trim());
    if (!p || q.length < 2) return [];
    const t = this.t();
    const areaName = new Map(p.routed.map((a) => [a.id, a.name]));
    const out: Match[] = [];
    const add = (kind: PlaceKind, list: Place[], suffix: (x: Place) => string) => {
      for (const place of list) {
        if (out.length >= 8) return;
        if (normalise(place.name).includes(q)) out.push({ kind, place, label: `${place.name}${suffix(place)} · ${t.kinds[kind]}` });
      }
    };
    add('state', p.states, () => '');
    add('municipality', p.municipalities, (x) => (x.uf ? ` (${x.uf})` : ''));
    add('bairro', p.bairros, (x) => ` (${areaName.get(x.area ?? '') ?? ''})`);
    return out;
  });

  readonly routeHint = computed(() => {
    if (!this.area()) return '';
    if (this.origin() === null) return this.t().pickOrigin;
    if (this.destination() === null) return this.t().pickDestination;
    return this.t().ready;
  });

  /** Warnings that hold before running: same point, or points in parts of the network with no link. */
  readonly pairNote = computed(() => {
    const o = this.origin();
    const d = this.destination();
    if (o === null || d === null || !this.parts) return '';
    if (o === d) return this.t().samePoint;
    return this.parts[o] !== this.parts[d] ? this.t().differentParts : '';
  });

  readonly outcomeText = computed(() => {
    const out = this.outcome();
    const t = this.t();
    if (!out) return '';
    if (out.kind === 'error') return t.runError;
    if (this.playback.status() !== 'done' || !out.result) return '';
    if (out.kind === 'same') return t.samePoint;
    if (out.kind === 'none') return t.noRoute;
    const r = out.result;
    return fill(t.routeFound, { km: this.formatKm(r.cost), steps: r.expanded.toLocaleString(this.locale()), ms: this.formatMs(r.ms) });
  });

  private map: MapView | null = null;
  private client: RoutingClient | null = null;
  private graph: StreetGraph | null = null;
  private parts: Int32Array | null = null;
  private renderer: MapTraceRenderer | null = null;
  private stateCache = new Map<number, FeatureCollection>();
  private bairros: FeatureCollection | null = null;
  private loadToken = 0;

  constructor() {
    afterNextRender(() => {
      this.aboutOpen.set(window.matchMedia?.(WIDE).matches ?? true);
      void this.init();
    });
  }

  ngOnDestroy(): void {
    this.playback.clear();
    this.client?.dispose();
    this.map?.destroy();
  }

  private get<T>(file: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(`${ASSETS}/${file}`));
  }

  async init(): Promise<void> {
    this.failed.set(false);
    try {
      const [places, states] = await Promise.all([this.get<Places>('places.json'), this.get<FeatureCollection>('states.geojson')]);
      this.places.set(places);
      if (!this.map) {
        const assets = new URL('assets/maplibre/', this.document.baseURI).href;
        this.map = await MapView.create(this.mapEl!.nativeElement, assets, BRAZIL);
        this.map.onClick((click) => void this.onMapClick(click.lon, click.lat, click.place));
      }
      this.map.setStates(states);
      this.map.setAreas(places.routed.map((a) => ({ id: a.id, bbox: a.bbox })));
      this.client ??= new RoutingClient();
    } catch {
      this.failed.set(true);
    }
  }

  // ------------------------------------------------------------------ places

  onQuery(value: string): void {
    this.query.set(value);
    this.active.set(0);
  }

  onSearchKey(event: KeyboardEvent): void {
    const n = this.matches().length;
    if (event.key === 'ArrowDown' && n) {
      this.active.set((this.active() + 1) % n);
      event.preventDefault();
    } else if (event.key === 'ArrowUp' && n) {
      this.active.set((this.active() - 1 + n) % n);
      event.preventDefault();
    } else if (event.key === 'Enter' && n) {
      void this.choose(this.matches()[this.active()]);
      event.preventDefault();
    } else if (event.key === 'Escape') {
      this.query.set('');
    }
  }

  chooseArea(id: string): void {
    const p = this.places();
    const a = p?.routed.find((x) => x.id === id);
    const first = a && p!.municipalities.find((m) => Number(m.code) === a.municipalities[0]);
    if (first) void this.choose({ kind: 'municipality', place: first, label: a.name });
  }

  async choose(match: Match): Promise<void> {
    this.query.set('');
    this.selection.set(match);
    const p = this.places()!;
    if (match.kind === 'state') {
      await this.showState(Number(match.place.code));
      this.map?.setSelected(null);
      this.map?.fit(match.place.bbox, 14);
      return;
    }
    const municipality = match.kind === 'municipality' ? match.place : p.municipalities.find((m) => m.code === match.place.municipality);
    if (!municipality) return;
    const fc = await this.showState(Number(municipality.state));
    const routed = p.routed.find((a) => a.municipalities.includes(Number(municipality.code)));
    if (match.kind === 'municipality') {
      this.map?.setSelected(fc.features.find((f) => Number(f.properties?.['code']) === Number(municipality.code)) ?? null);
    }
    if (routed) {
      const loaded = this.loadArea(routed);
      // a routed municipality opens on its street network (where clicks mark points), not on its rural area
      this.map?.fit(match.kind === 'bairro' ? match.place.bbox : routed.municipalities.length > 1 ? routed.bbox : this.streetsBox(routed, municipality), match.kind === 'bairro' ? 16 : 14);
      await loaded;
      if (match.kind === 'bairro') {
        this.map?.setSelected(this.bairros?.features.find((f) => String(f.properties?.['code']) === String(match.place.code)) ?? null);
      }
    } else {
      this.map?.fit(match.place.bbox, 14);
      this.setStatus(fill(this.t().notRouted, { list: p.routed.map((a) => a.name).join(', ') }));
    }
  }

  /** The street network's box, clipped to the municipality (Brasília's graph is the whole Federal District). */
  private streetsBox(a: RoutedArea, m: Place): BBox {
    const [w, s, e, n] = a.bbox;
    const [mw, ms, me, mn] = m.bbox;
    return [Math.max(w, mw), Math.max(s, ms), Math.min(e, me), Math.min(n, mn)];
  }

  private async showState(code: number): Promise<FeatureCollection> {
    let fc = this.stateCache.get(code);
    if (!fc) {
      fc = await this.get<FeatureCollection>(`municipalities/${code}.geojson`);
      this.stateCache.set(code, fc);
    }
    this.map?.setMunicipalities(fc);
    return fc;
  }

  private setStatus(text: string, error = false): void {
    this.status.set(text);
    this.statusError.set(error);
  }

  async loadArea(a: RoutedArea): Promise<void> {
    if (this.area()?.id === a.id || !this.map || !this.client) return;
    const token = ++this.loadToken;
    this.clearRoute();
    this.rows.set([]);
    const mb = ((a.bytes ?? 0) / 1e6).toLocaleString(this.locale(), { maximumFractionDigits: 1 });
    this.setStatus(fill(this.t().loadingStreets, { city: a.name, mb }));
    const hasBairros = !!this.places()?.bairros.some((b) => b.area === a.id);
    try {
      const url = new URL(`${ASSETS}/graph/${a.id}.json`, this.document.baseURI).href;
      const [payload, bairros] = await Promise.all([
        this.get<GraphPayload>(`graph/${a.id}.json`),
        hasBairros ? this.get<FeatureCollection>(`bairros/${a.id}.geojson`) : Promise.resolve(null),
        this.client.load(a.id, url),
      ]);
      if (token !== this.loadToken) return; // the visitor chose another city meanwhile
      this.showNetwork(a, payload, bairros);
    } catch {
      if (token === this.loadToken) this.setStatus(fill(this.t().streetsError, { city: a.name }), true);
    }
  }

  private showNetwork(a: RoutedArea, payload: GraphPayload, bairros: FeatureCollection | null): void {
    const g = buildGraph(payload);
    this.graph = g;
    this.parts = components(g);
    this.renderer = new MapTraceRenderer(this.map!, g);
    this.area.set(a);
    this.map!.setActiveArea(a.id);
    this.bairros = bairros;
    this.hasBairros.set(!!bairros);
    this.map!.setBairros(this.showBairros() ? bairros : null);
    const bridged = new Set(payload.bridged ?? []);
    const oneway = new Set(payload.oneway ?? []);
    this.map!.setNetwork(
      {
        type: 'FeatureCollection',
        features: payload.lines.map((line, i) => ({
          type: 'Feature', id: i, properties: { b: bridged.has(i), o: oneway.has(i) },
          geometry: { type: 'LineString', coordinates: Array.from({ length: line.length / 2 }, (_, j) => [line[2 * j], line[2 * j + 1]]) },
        })),
      },
      {
        type: 'FeatureCollection',
        features: Array.from({ length: g.n }, (_, v) => ({ type: 'Feature', id: v, properties: {}, geometry: { type: 'Point', coordinates: [g.lon[v], g.lat[v]] } })),
      },
    );
    const km = Array.from(g.edgeLen).reduce((x, y) => x + y, 0) / 1000;
    const parts = new Set(this.parts).size;
    this.setStatus(fill(this.t().streetsLoaded, {
      city: a.name, nodes: g.n.toLocaleString(this.locale()), km: Math.round(km).toLocaleString(this.locale()), parts: parts.toLocaleString(this.locale()),
    }));
  }

  toggleBairros(): void {
    this.showBairros.set(!this.showBairros());
    this.map?.setBairros(this.showBairros() ? this.bairros : null);
  }

  private insideArea(lon: number, lat: number): boolean {
    const b = this.area()?.bbox;
    return !!b && lon >= b[0] && lon <= b[2] && lat >= b[1] && lat <= b[3];
  }

  private async onMapClick(lon: number, lat: number, place?: { layer: PlaceKind | 'area'; code: string }): Promise<void> {
    // inside the loaded city's network a click always marks a point, whatever the zoom (small screens fit the city far out)
    if (this.graph && this.insideArea(lon, lat)) {
      this.pick(nearestNode(this.graph, lon, lat));
      return;
    }
    const p = this.places();
    if (!p || !place) return;
    if (place.layer === 'area') {
      this.chooseArea(place.code);
      return;
    }
    const list = place.layer === 'state' ? p.states : place.layer === 'municipality' ? p.municipalities : p.bairros;
    const hit = list.find((x) => String(x.code) === place.code);
    if (hit) await this.choose({ kind: place.layer, place: hit, label: hit.name });
  }

  // ------------------------------------------------------------------ origin and destination

  pickAtCentre(): void {
    const c = this.map?.centre();
    if (c && this.graph && this.insideArea(c.lon, c.lat)) this.pick(nearestNode(this.graph, c.lon, c.lat));
  }

  private pick(node: number): void {
    this.resetRun();
    if (this.nextPick() === 'origin') {
      this.origin.set(node);
      this.nextPick.set('destination');
    } else {
      this.destination.set(node);
      this.nextPick.set('origin');
    }
    this.drawMarkers();
  }

  swap(): void {
    const o = this.origin();
    this.origin.set(this.destination());
    this.destination.set(o);
    this.resetRun();
    this.drawMarkers();
  }

  clearRoute(): void {
    this.resetRun();
    this.origin.set(null);
    this.destination.set(null);
    this.nextPick.set('origin');
    this.map?.setMarkers(null, null);
  }

  private resetRun(): void {
    this.playback.clear();
    this.outcome.set(null);
    this.via.set([]);
  }

  private drawMarkers(): void {
    const g = this.graph;
    if (!g) return;
    const at = (v: number | null): [number, number] | null => (v === null ? null : [g.lon[v], g.lat[v]]);
    this.map?.setMarkers(at(this.origin()), at(this.destination()));
  }

  // ------------------------------------------------------------------ algorithms

  setAlgorithm(key: AlgorithmKey): void {
    this.algorithm.set(key);
  }

  setParam(change: { key: string; value: number }): void {
    this.params.set({ ...this.params(), [change.key]: change.value });
  }

  readonly canRun = computed(() => !!this.area() && this.origin() !== null && this.destination() !== null);

  async run(): Promise<void> {
    const ready = this.ready();
    if (!ready || this.computing()) return;
    const key = this.algorithm();
    this.resetRun();
    this.computing.set(true);
    try {
      const { result, optimum } = await this.client!.run(ready.area, key, ready.s, ready.t, this.params(), true);
      this.record(key, result, optimum);
      this.show(result, true);
    } catch (err) {
      if (!(err instanceof StaleRunError)) this.outcome.set({ kind: 'error' });
    } finally {
      this.computing.set(false);
    }
  }

  async runAll(): Promise<void> {
    const ready = this.ready();
    if (!ready || this.computing()) return;
    this.resetRun();
    this.computing.set(true);
    try {
      let shown: RouteResult | null = null;
      for (const key of ORDER) {
        const { result, optimum } = await this.client!.run(ready.area, key, ready.s, ready.t, this.params(), true);
        this.record(key, result, optimum);
        if (key === this.algorithm()) shown = result;
      }
      if (shown) {
        this.show(shown, false);
        this.playback.skipToEnd();
      }
    } catch (err) {
      if (!(err instanceof StaleRunError)) this.outcome.set({ kind: 'error' });
    } finally {
      this.computing.set(false);
    }
  }

  private ready(): { area: string; s: number; t: number } | null {
    const a = this.area();
    const s = this.origin();
    const t = this.destination();
    return a && s !== null && t !== null && this.graph ? { area: a.id, s, t } : null;
  }

  private show(result: RouteResult, autoplay: boolean): void {
    const g = this.graph!;
    const kind = !result.path.length ? 'none' : result.path.length === 1 ? 'same' : 'found';
    this.outcome.set({ kind, result });
    this.via.set(this.mainStreets(result.path));
    this.playback.load(result, new SearchPlayer(result.trace, g.n, g.edgeLen.length, (path) => pathEdges(g, path)), this.renderer!, autoplay);
  }

  private record(key: AlgorithmKey, r: RouteResult, optimum: number | null): void {
    const gap = Number.isFinite(r.cost) && optimum && optimum > 0 ? (r.cost / optimum - 1) * 100 : null;
    const rows = this.rows().filter((x) => x.key !== key);
    rows.push({ key, cost: r.cost, gap, work: r.expanded, ms: r.ms });
    rows.sort((x, y) => ORDER.indexOf(x.key) - ORDER.indexOf(y.key));
    this.rows.set(rows);
  }

  /** The three street names covering most of the route's length. */
  private mainStreets(path: number[]): string[] {
    const g = this.graph!;
    const byName = new Map<string, number>();
    for (let i = 1; i < path.length; i++) {
      const k = edgeBetween(g, path[i - 1], path[i]);
      const name = g.names[g.edgeName[g.adjEdge[k]]];
      if (name) byName.set(name, (byName.get(name) ?? 0) + g.adjLen[k]);
    }
    return [...byName.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name);
  }

  formatKm(m: number): string {
    return Number.isFinite(m) ? `${(m / 1000).toLocaleString(this.locale(), { maximumFractionDigits: 2 })} km` : this.t().noRouteShort;
  }
  formatGap(g: number | null): string {
    return g === null ? '—' : g < 0.05 ? '0 %' : `+${g.toLocaleString(this.locale(), { maximumFractionDigits: 1 })} %`;
  }
  formatMs(ms: number): string {
    return `${ms.toLocaleString(this.locale(), { maximumFractionDigits: ms < 10 ? 1 : 0 })} ms`;
  }
}
