import {
  Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation, afterNextRender, computed, inject, signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import type { Feature, FeatureCollection } from 'geojson';
import { injectLangQuery, injectLocale } from '../../services/locale';
import { BBox, MapView } from './map-view';
import {
  GraphPayload, RouteResult, StreetGraph, antColony, astar, bidirectionalDijkstra, buildGraph, dijkstra, edgeBetween,
  geneticAlgorithm, graphBounds, greedyBestFirst, nearestNode, simulatedAnnealing,
} from './routing-engine';
import { AlgorithmKey, STREET_I18N, STREET_REFERENCES } from './street-i18n';

interface Place { code: number | string; name: string; bbox: BBox; uf?: string; state?: number; municipality?: number }
interface Places { states: Place[]; municipalities: Place[]; bairros: Place[]; routed: number[] }
type PlaceKind = 'state' | 'municipality' | 'bairro';
interface Match { kind: PlaceKind; place: Place; label: string }
interface ParamSpec { key: string; min: number; max: number; step: number }
interface Row { key: AlgorithmKey; name: string; family: string; cost: number; gap: number | null; work: number; ms: number }

const ASSETS = 'assets/street-routing';
const BRAZIL: BBox = [-74, -34, -34.7, 5.3];
const ORDER: AlgorithmKey[] = ['dijkstra', 'astar', 'bidirectional', 'greedy', 'ants', 'genetic', 'annealing'];
const PARAMS: Partial<Record<AlgorithmKey, ParamSpec[]>> = {
  astar: [{ key: 'weight', min: 1, max: 5, step: 0.5 }],
  ants: [
    { key: 'ants', min: 5, max: 60, step: 5 }, { key: 'iterations', min: 5, max: 100, step: 5 },
    { key: 'alpha', min: 0, max: 3, step: 0.25 }, { key: 'beta', min: 0, max: 5, step: 0.25 },
    { key: 'evaporation', min: 0.01, max: 0.5, step: 0.01 }, { key: 'seed', min: 1, max: 99, step: 1 },
  ],
  genetic: [
    { key: 'population', min: 10, max: 100, step: 10 }, { key: 'generations', min: 10, max: 150, step: 10 },
    { key: 'mutationRate', min: 0, max: 1, step: 0.05 }, { key: 'seed', min: 1, max: 99, step: 1 },
  ],
  annealing: [
    { key: 'temperature', min: 50, max: 3000, step: 50 }, { key: 'cooling', min: 0.9, max: 0.999, step: 0.001 },
    { key: 'iterations', min: 200, max: 5000, step: 100 }, { key: 'seed', min: 1, max: 99, step: 1 },
  ],
};
const DEFAULTS: Record<string, number> = {
  weight: 1, ants: 20, iterations: 40, alpha: 1, beta: 2, evaporation: 0.1, seed: 1,
  population: 40, generations: 60, mutationRate: 0.2, temperature: 500, cooling: 0.995,
};

function normalise(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/**
 * Project page: IBGE boundaries from Brazil down to a neighbourhood, the Londrina street graph built from IBGE
 * block faces, and path-finding algorithms run and animated in the browser.
 */
@Component({
  selector: 'app-street-routing',
  imports: [RouterLink],
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
  readonly showBairros = signal(true);

  readonly graphStats = signal<{ nodes: number; km: number } | null>(null);
  readonly origin = signal<number | null>(null);
  readonly destination = signal<number | null>(null);
  readonly algorithm = signal<AlgorithmKey>('astar');
  readonly params = signal<Record<string, number>>({ ...DEFAULTS });
  readonly speed = signal(3);
  readonly running = signal(false);
  readonly rows = signal<Row[]>([]);
  readonly via = signal<string[]>([]);

  readonly sections = computed(() => [
    { id: 'map', label: this.t().mapTitle },
    { id: 'method', label: this.t().methodTitle },
    { id: 'algorithms', label: this.t().algorithmsTitle },
    { id: 'references', label: this.t().referencesTitle },
  ]);

  readonly matches = computed<Match[]>(() => {
    const p = this.places();
    const q = normalise(this.query().trim());
    if (!p || q.length < 2) return [];
    const t = this.t();
    const out: Match[] = [];
    const add = (kind: PlaceKind, list: Place[], suffix: (x: Place) => string) => {
      for (const place of list) {
        if (out.length >= 8) return;
        if (normalise(place.name).includes(q)) out.push({ kind, place, label: `${place.name}${suffix(place)} · ${t.kinds[kind]}` });
      }
    };
    add('state', p.states, () => '');
    add('municipality', p.municipalities, (x) => (x.uf ? ` (${x.uf})` : ''));
    add('bairro', p.bairros, () => ' (Londrina)');
    return out;
  });

  readonly routeHint = computed(() => {
    if (!this.graphStats()) return '';
    if (this.origin() === null) return this.t().pickOrigin;
    if (this.destination() === null) return this.t().pickDestination;
    return this.t().ready;
  });

  readonly paramSpecs = computed(() => PARAMS[this.algorithm()] ?? []);

  private map: MapView | null = null;
  private graph: StreetGraph | null = null;
  /** The municipality whose streets are loaded and the box of its street network (the urban area). */
  private routedCode: number | null = null;
  private routedBBox: BBox | null = null;
  private stateCache = new Map<number, FeatureCollection>();
  private bairros: FeatureCollection | null = null;
  private optimum: number | null = null;
  private frame = 0;

  constructor() {
    afterNextRender(() => void this.init());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.map?.destroy();
  }

  private get<T>(file: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(`${ASSETS}/${file}`));
  }

  private async init(): Promise<void> {
    try {
      const [places, states] = await Promise.all([this.get<Places>('places.json'), this.get<FeatureCollection>('states.geojson')]);
      this.places.set(places);
      const assets = new URL('assets/maplibre/', this.document.baseURI).href;
      this.map = await MapView.create(this.mapEl!.nativeElement, assets, BRAZIL);
      this.map.setStates(states);
      this.map.onClick((click) => void this.onMapClick(click.lon, click.lat, click.place));
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
    }
  }

  async choose(match: Match): Promise<void> {
    this.query.set('');
    this.selection.set(match);
    const p = this.places()!;
    if (match.kind === 'state') {
      await this.showState(Number(match.place.code));
      this.map?.setSelected(null);
    } else if (match.kind === 'municipality') {
      await this.showMunicipality(match.place);
    } else {
      const city = p.municipalities.find((m) => m.code === match.place.municipality);
      if (city) await this.showMunicipality(city, false);
      this.map?.setSelected(this.bairros?.features.find((f) => String(f.properties?.['code']) === String(match.place.code)) ?? null);
    }
    // a routed municipality opens on its street network (clickable zoom), not on its whole, mostly rural, area
    const streets = match.kind === 'municipality' && this.routedCode === Number(match.place.code) ? this.routedBBox : null;
    this.map?.fit(streets ?? match.place.bbox, match.kind === 'bairro' ? 16 : 14);
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

  private async showMunicipality(place: Place, select = true): Promise<void> {
    const fc = await this.showState(Number(place.state));
    if (select) this.map?.setSelected(fc.features.find((f) => Number(f.properties?.['code']) === Number(place.code)) ?? null);
    if (this.places()!.routed.includes(Number(place.code))) {
      await this.loadStreets(place);
    } else {
      this.status.set(this.t().notRouted);
    }
  }

  private async loadStreets(city: Place): Promise<void> {
    if (this.graph) return;
    this.status.set(this.t().loadingStreets);
    const [payload, bairros] = await Promise.all([
      this.get<GraphPayload>(`graph/${city.code}.json`),
      this.get<FeatureCollection>(`bairros/${city.code}.geojson`),
    ]);
    this.graph = buildGraph(payload);
    const bridged = new Set(payload.bridged ?? []);
    this.routedCode = Number(city.code);
    this.routedBBox = graphBounds(this.graph);
    this.bairros = bairros;
    this.map?.setBairros(this.showBairros() ? bairros : null);
    this.map?.setStreets({
      type: 'FeatureCollection',
      features: payload.lines.map((line, i) => ({
        type: 'Feature', properties: { b: bridged.has(i) },
        geometry: { type: 'LineString', coordinates: Array.from({ length: line.length / 2 }, (_, i) => [line[2 * i], line[2 * i + 1]]) },
      })),
    });
    const km = Array.from(this.graph.edgeLen).reduce((a, b) => a + b, 0) / 1000;
    this.graphStats.set({ nodes: this.graph.n, km: Math.round(km) });
    this.status.set(this.t().streetsLoaded.replace('{nodes}', this.graph.n.toLocaleString(this.locale())).replace('{km}', Math.round(km).toLocaleString(this.locale())));
  }

  toggleBairros(): void {
    this.showBairros.set(!this.showBairros());
    this.map?.setBairros(this.showBairros() ? this.bairros : null);
  }

  private async onMapClick(lon: number, lat: number, place?: { layer: PlaceKind; code: string }): Promise<void> {
    const b = this.routedBBox;
    const insideCity = !!b && lon >= b[0] && lon <= b[2] && lat >= b[1] && lat <= b[3];
    if (this.graph && insideCity && (this.map?.zoom() ?? 0) >= 11.5) {
      this.pick(nearestNode(this.graph, lon, lat));
      return;
    }
    const p = this.places();
    if (!p || !place) return;
    const list = place.layer === 'state' ? p.states : place.layer === 'municipality' ? p.municipalities : p.bairros;
    const hit = list.find((x) => String(x.code) === place.code);
    if (hit) await this.choose({ kind: place.layer, place: hit, label: hit.name });
  }

  // ------------------------------------------------------------------ routing

  private pick(node: number): void {
    const g = this.graph!;
    if (this.origin() === null || this.destination() !== null) {
      this.clearRoute();
      this.origin.set(node);
    } else {
      this.destination.set(node);
    }
    const at = (v: number | null): [number, number] | null => (v === null ? null : [g.lon[v], g.lat[v]]);
    this.map?.setMarkers(at(this.origin()), at(this.destination()));
  }

  clearRoute(): void {
    cancelAnimationFrame(this.frame);
    this.origin.set(null);
    this.destination.set(null);
    this.optimum = null;
    this.rows.set([]);
    this.via.set([]);
    this.map?.setMarkers(null, null);
    this.map?.setRoute(null);
    this.map?.setVisits([]);
  }

  setAlgorithm(key: string): void {
    this.algorithm.set(key as AlgorithmKey);
  }

  setParam(key: string, value: string): void {
    this.params.set({ ...this.params(), [key]: Number(value) });
  }

  private compute(key: AlgorithmKey): RouteResult {
    const g = this.graph!;
    const s = this.origin()!;
    const d = this.destination()!;
    const p = this.params();
    switch (key) {
      case 'dijkstra': return dijkstra(g, s, d);
      case 'astar': return astar(g, s, d, p['weight']);
      case 'bidirectional': return bidirectionalDijkstra(g, s, d);
      case 'greedy': return greedyBestFirst(g, s, d);
      case 'ants': return antColony(g, s, d, { ants: p['ants'], iterations: p['iterations'], alpha: p['alpha'], beta: p['beta'], evaporation: p['evaporation'], seed: p['seed'] });
      case 'genetic': return geneticAlgorithm(g, s, d, { population: p['population'], generations: p['generations'], crossoverRate: 0.8, mutationRate: p['mutationRate'], tournament: 3, seed: p['seed'] });
      case 'annealing': return simulatedAnnealing(g, s, d, { temperature: p['temperature'], cooling: p['cooling'], iterations: p['iterations'], seed: p['seed'] });
    }
  }

  private record(key: AlgorithmKey, r: RouteResult): void {
    if (this.optimum === null) this.optimum = key === 'dijkstra' ? r.cost : dijkstra(this.graph!, this.origin()!, this.destination()!).cost;
    const a = this.t().algorithms[key];
    const gap = Number.isFinite(r.cost) && this.optimum > 0 ? (r.cost / this.optimum - 1) * 100 : null;
    const row: Row = { key, name: a.name, family: a.family, cost: r.cost, gap, work: r.expanded, ms: r.ms };
    const rows = this.rows().filter((x) => x.key !== key);
    rows.push(row);
    rows.sort((x, y) => ORDER.indexOf(x.key) - ORDER.indexOf(y.key));
    this.rows.set(rows);
  }

  run(): void {
    if (this.origin() === null || this.destination() === null || this.running()) return;
    this.running.set(true);
    setTimeout(() => {  // let "Computing…" render before the main thread is busy
      const key = this.algorithm();
      const result = this.compute(key);
      this.record(key, result);
      this.running.set(false);
      this.animate(result);
    }, 30);
  }

  runAll(): void {
    if (this.origin() === null || this.destination() === null || this.running()) return;
    this.running.set(true);
    setTimeout(() => {
      let shown: RouteResult | null = null;
      for (const key of ORDER) {
        const r = this.compute(key);
        this.record(key, r);
        if (key === this.algorithm()) shown = r;
      }
      this.running.set(false);
      this.map?.setVisits([]);
      this.showRoute(shown!);
    }, 30);
  }

  private routeCoords(path: number[]): number[][] {
    const g = this.graph!;
    const coords: number[][] = [];
    for (let i = 1; i < path.length; i++) {
      const k = edgeBetween(g, path[i - 1], path[i]);
      const line = g.lines[g.adjEdge[k]];
      const pts = Array.from({ length: line.length / 2 }, (_, j) => [line[2 * j], line[2 * j + 1]]);
      const a = path[i - 1];
      const startsAtA = Math.hypot(pts[0][0] - g.lon[a], pts[0][1] - g.lat[a]) <= Math.hypot(pts[pts.length - 1][0] - g.lon[a], pts[pts.length - 1][1] - g.lat[a]);
      coords.push(...(startsAtA ? pts : pts.reverse()).slice(coords.length ? 1 : 0));
    }
    return coords;
  }

  private showRoute(r: RouteResult): void {
    this.map?.setRoute(r.path.length ? this.routeCoords(r.path) : null);
    const g = this.graph!;
    const byName = new Map<string, number>();
    for (let i = 1; i < r.path.length; i++) {
      const k = edgeBetween(g, r.path[i - 1], r.path[i]);
      const name = g.names[g.edgeName[g.adjEdge[k]]];
      if (name) byName.set(name, (byName.get(name) ?? 0) + g.adjLen[k]);
    }
    this.via.set([...byName.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name));
  }

  private animate(r: RouteResult): void {
    cancelAnimationFrame(this.frame);
    const g = this.graph!;
    this.map?.setRoute(null);
    const frames = Math.round(360 / this.speed()); // ~6 s at speed 1, ~1 s at speed 6
    if (r.visits && r.visits.length) {
      const visits = r.visits;
      const features: Feature[] = [];
      const per = Math.max(1, Math.ceil(visits.length / frames));
      let i = 0;
      const step = () => {
        for (const end = Math.min(visits.length, i + per); i < end; i++) {
          const v = visits[i] >= 0 ? visits[i] : -visits[i] - 1;
          features.push({ type: 'Feature', properties: { back: visits[i] < 0 }, geometry: { type: 'Point', coordinates: [g.lon[v], g.lat[v]] } });
        }
        this.map?.setVisits(features);
        if (i < visits.length) this.frame = requestAnimationFrame(step);
        else this.showRoute(r);
      };
      this.frame = requestAnimationFrame(step);
    } else if (r.iterations && r.iterations.length) {
      this.map?.setVisits([]);
      const iterations = r.iterations;
      const wait = Math.max(1, Math.floor(frames / iterations.length));
      let k = 0;
      let tick = 0;
      const step = () => {
        if (tick++ % wait === 0) {
          const path = iterations[k++];
          this.map?.setRoute(path.length ? this.routeCoords(path) : null);
        }
        if (k < iterations.length) this.frame = requestAnimationFrame(step);
        else this.showRoute(r);
      };
      this.frame = requestAnimationFrame(step);
    } else {
      this.showRoute(r);
    }
  }

  formatKm(m: number): string {
    return Number.isFinite(m) ? `${(m / 1000).toLocaleString(this.locale(), { maximumFractionDigits: 2 })} km` : this.t().noRoute;
  }
  formatGap(g: number | null): string {
    return g === null ? '—' : g < 0.05 ? '0 %' : `+${g.toLocaleString(this.locale(), { maximumFractionDigits: 1 })} %`;
  }
  formatMs(ms: number): string {
    return `${ms.toLocaleString(this.locale(), { maximumFractionDigits: ms < 10 ? 1 : 0 })} ms`;
  }
}
