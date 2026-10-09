import type * as Ml from 'maplibre-gl';
import type { Feature, FeatureCollection } from 'geojson';
import type { NodeState } from './engine/search-player';

/** Bounding box [west, south, east, north] in degrees. */
export type BBox = [number, number, number, number];

export interface MapClick {
  lon: number;
  lat: number;
  /** Code of the state or municipality polygon under the click, if any (topmost first). */
  place?: { layer: 'state' | 'municipality' | 'bairro' | 'area'; code: string };
}

const EMPTY: FeatureCollection = { type: 'FeatureCollection', features: [] };
const ARROW_IMAGE = 'sr-oneway-arrow';

/** Adds a stylesheet once; resolves when it is applied (or failed: the map still works, unstyled controls). */
function loadStylesheet(doc: Document, href: string): Promise<void> {
  if (doc.querySelector(`link[rel="stylesheet"][href="${href}"]`)) return Promise.resolve();
  return new Promise((resolve) => {
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = link.onerror = () => resolve();
    doc.head.appendChild(link);
  });
}

/** Colours of the map layers (CSS custom properties of .street-page, so the legend uses the same ones). */
const COLOURS = {
  land: ['--map-land', '#f3f8ff'],
  border: ['--map-border', '#6a82ab'],
  outline: ['--map-outline', '#3b4d6b'],
  street: ['--map-street', '#8d99ab'],
  evaluated: ['--map-evaluated', '#b86e00'],
  visited: ['--map-visited', '#e69f00'],
  visitedStroke: ['--map-visited-stroke', '#7a4b00'],
  backward: ['--map-backward', '#cc79a7'],
  backwardStroke: ['--map-backward-stroke', '#7d3c64'],
  frontier: ['--map-frontier', '#0a1a36'],
  candidate: ['--map-candidate', '#3b4d6b'],
  best: ['--map-best', '#b86e00'],
  route: ['--map-route', '#0072b2'],
  origin: ['--map-origin', '#009e73'],
  destination: ['--map-destination', '#d55e00'],
} as const;
type Palette = Record<keyof typeof COLOURS, string>;

function palette(el: HTMLElement): Palette {
  const css = getComputedStyle(el);
  return Object.fromEntries(
    Object.entries(COLOURS).map(([key, [name, fallback]]) => [key, css.getPropertyValue(name).trim() || fallback]),
  ) as Palette;
}

/** A chevron drawn on a canvas (no sprite server): marks the driving direction of one-way streets. */
function arrowImage(doc: Document, colour: string): ImageData | null {
  const size = 24;
  const canvas = doc.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.strokeStyle = colour;
  ctx.lineWidth = 3;
  ctx.lineCap = ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(7, 5);
  ctx.lineTo(17, 12);
  ctx.lineTo(7, 19);
  ctx.stroke();
  return ctx.getImageData(0, 0, size, size);
}

const state: Ml.ExpressionSpecification = ['coalesce', ['feature-state', 's'], 0];
const evaluated: Ml.ExpressionSpecification = ['boolean', ['feature-state', 'e'], false];

/**
 * The map of the street-routing page: IBGE boundaries, the street graph, the replay of a search and the route,
 * on MapLibre GL with no external tiles (every layer is a GeoJSON file of this site, so the page needs no third-
 * party server and keeps the site's Content-Security-Policy). The replay uses feature-state (one flag per street
 * and per node), so each animation frame updates only what changed.
 */
export class MapView {
  private constructor(private readonly map: Ml.Map) {}

  /** `assets`: folder URL holding MapLibre's CSP worker and stylesheet (copied there by angular.json). */
  static async create(container: HTMLElement, assets: string, bounds: BBox): Promise<MapView> {
    const [ml] = await Promise.all([
      import('maplibre-gl/dist/maplibre-gl-csp.js') as unknown as Promise<typeof Ml & { default?: typeof Ml }>,
      loadStylesheet(container.ownerDocument, new URL('maplibre-gl.css', assets).href),
    ]);
    const lib = ml.default ?? ml;
    lib.setWorkerUrl(new URL('maplibre-gl-csp-worker.js', assets).href);
    const c = palette(container);
    const map = new lib.Map({
      container,
      bounds,
      fitBoundsOptions: { padding: 24 },
      attributionControl: { compact: true, customAttribution: 'IBGE (Censo 2022, malhas territoriais)' },
      style: {
        version: 8,
        sources: {},
        layers: [{ id: 'background', type: 'background', paint: { 'background-color': c.land } }],
      },
      dragRotate: false,
      pitchWithRotate: false,
    });
    map.touchZoomRotate.disableRotation();
    map.addControl(new lib.NavigationControl({ showCompass: false }), 'top-right');
    await new Promise<void>((resolve) => map.once('load', () => resolve()));
    const view = new MapView(map);
    view.addLayers(c, container.ownerDocument);
    return view;
  }

  private addLayers(c: Palette, doc: Document): void {
    const m = this.map;
    for (const id of ['states', 'municipalities', 'areas', 'bairros', 'selected', 'candidate', 'best', 'route', 'markers']) {
      m.addSource(id, { type: 'geojson', data: EMPTY });
    }
    m.addSource('streets', { type: 'geojson', data: EMPTY });
    m.addSource('nodes', { type: 'geojson', data: EMPTY });
    const arrow = arrowImage(doc, c.outline);
    if (arrow) m.addImage(ARROW_IMAGE, arrow);
    m.addLayer({ id: 'states-fill', type: 'fill', source: 'states', paint: { 'fill-color': c.outline, 'fill-opacity': 0.03 } });
    m.addLayer({ id: 'states-line', type: 'line', source: 'states', paint: { 'line-color': c.border, 'line-width': 1.2 } });
    m.addLayer({ id: 'municipalities-fill', type: 'fill', source: 'municipalities', paint: { 'fill-color': c.outline, 'fill-opacity': 0.02 } });
    m.addLayer({ id: 'municipalities-line', type: 'line', source: 'municipalities', paint: { 'line-color': c.border, 'line-width': 0.5, 'line-opacity': 0.7 } });
    // cities with a street graph: outlined boxes, visible while zoomed out, a click opens the city
    m.addLayer({ id: 'areas-fill', type: 'fill', source: 'areas', maxzoom: 10, paint: { 'fill-color': c.origin, 'fill-opacity': 0.12 } });
    m.addLayer({ id: 'areas-line', type: 'line', source: 'areas', maxzoom: 10, paint: { 'line-color': c.origin, 'line-width': 2, 'line-dasharray': [3, 2] } });
    m.addLayer({ id: 'bairros-fill', type: 'fill', source: 'bairros', paint: { 'fill-color': c.outline, 'fill-opacity': 0.02 } });
    m.addLayer({ id: 'bairros-line', type: 'line', source: 'bairros', paint: { 'line-color': c.outline, 'line-width': 0.8, 'line-dasharray': [2, 2], 'line-opacity': 0.5 } });
    m.addLayer({ id: 'selected-line', type: 'line', source: 'selected', paint: { 'line-color': c.outline, 'line-width': 2.5 } });
    m.addLayer({
      id: 'streets-line', type: 'line', source: 'streets', filter: ['!', ['get', 'b']],
      paint: {
        'line-color': ['case', evaluated, c.evaluated, c.street],
        'line-width': ['interpolate', ['linear'], ['zoom'], 11, ['case', evaluated, 1.4, 0.5], 16, ['case', evaluated, 4, 2.5]],
        'line-opacity': 0.9,
      },
    });
    m.addLayer({
      id: 'links-line', type: 'line', source: 'streets', filter: ['get', 'b'],
      paint: { 'line-color': ['case', evaluated, c.evaluated, c.street], 'line-width': 1.5, 'line-dasharray': [2, 2], 'line-opacity': 0.9 },
    });
    m.addLayer({
      id: 'oneway-arrows', type: 'symbol', source: 'streets', filter: ['get', 'o'], minzoom: 14,
      layout: { 'symbol-placement': 'line', 'symbol-spacing': 60, 'icon-image': ARROW_IMAGE, 'icon-size': 0.6, 'icon-allow-overlap': true, 'icon-rotation-alignment': 'map' },
    });
    m.addLayer({
      id: 'nodes-circle', type: 'circle', source: 'nodes',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, ['match', state, 1, 2.2, 1.4], 16, ['match', state, 1, 5, 3.5]],
        'circle-color': ['match', state, 1, '#ffffff', 2, c.visited, 3, c.backward, c.visited],
        'circle-stroke-color': ['match', state, 1, c.frontier, 3, c.backwardStroke, c.visitedStroke],
        'circle-stroke-width': ['match', state, 1, 1.5, 0.6],
        'circle-opacity': ['match', state, 0, 0, 0.95],
        'circle-stroke-opacity': ['match', state, 0, 0, 1],
      },
    });
    m.addLayer({ id: 'candidate-line', type: 'line', source: 'candidate', paint: { 'line-color': c.candidate, 'line-width': 2, 'line-dasharray': [1, 1.5], 'line-opacity': 0.9 } });
    m.addLayer({ id: 'best-line', type: 'line', source: 'best', layout: { 'line-cap': 'round' }, paint: { 'line-color': c.best, 'line-width': 4, 'line-dasharray': [2, 1.5] } });
    m.addLayer({ id: 'route-casing', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ffffff', 'line-width': 9 } });
    m.addLayer({ id: 'route-line', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': c.route, 'line-width': 5 } });
    m.addLayer({
      id: 'markers-circle', type: 'circle', source: 'markers',
      paint: { 'circle-radius': 8, 'circle-stroke-width': 2.5, 'circle-stroke-color': '#ffffff', 'circle-color': ['case', ['get', 'origin'], c.origin, c.destination] },
    });
  }

  private set(source: string, data: FeatureCollection | Feature): void {
    (this.map.getSource(source) as Ml.GeoJSONSource).setData(data);
  }

  private line(source: string, coords: number[][] | null): void {
    this.set(source, coords && coords.length > 1 ? { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } } : EMPTY);
  }

  setStates(fc: FeatureCollection): void {
    this.set('states', fc);
  }
  setMunicipalities(fc: FeatureCollection | null): void {
    this.set('municipalities', fc ?? EMPTY);
  }
  /** Boxes of the cities that have streets (property code = area id). */
  setAreas(areas: Array<{ id: string; bbox: BBox }>): void {
    this.set('areas', {
      type: 'FeatureCollection',
      features: areas.map(({ id, bbox: [w, s, e, n] }) => ({
        type: 'Feature', properties: { code: id },
        geometry: { type: 'Polygon', coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]]] },
      })),
    });
  }
  /** Hides the box of the city whose streets are shown (the others stay as choices). */
  setActiveArea(id: string | null): void {
    const filter: Ml.FilterSpecification = ['!=', ['get', 'code'], id ?? ''];
    this.map.setFilter('areas-fill', filter);
    this.map.setFilter('areas-line', filter);
  }
  setBairros(fc: FeatureCollection | null): void {
    this.set('bairros', fc ?? EMPTY);
  }
  setSelected(feature: Feature | null): void {
    this.set('selected', feature ?? EMPTY);
  }

  /** Streets (feature id = edge index; properties b = estimated link, o = one-way) and nodes (id = node index). */
  setNetwork(streets: FeatureCollection | null, nodes: FeatureCollection | null): void {
    this.clearTrace();
    this.set('streets', streets ?? EMPTY);
    this.set('nodes', nodes ?? EMPTY);
  }

  setNodeStates(changes: Array<[number, NodeState]>): void {
    for (const [id, s] of changes) this.map.setFeatureState({ source: 'nodes', id }, { s });
  }

  markEvaluated(edges: number[]): void {
    for (const id of edges) this.map.setFeatureState({ source: 'streets', id }, { e: true });
  }

  clearTrace(): void {
    this.map.removeFeatureState({ source: 'nodes' });
    this.map.removeFeatureState({ source: 'streets' });
    this.line('candidate', null);
    this.line('best', null);
  }

  /** Metaheuristics: the route under evaluation (thin dashes) and the best one so far (thick dashes). */
  setCandidate(coords: number[][] | null): void {
    this.line('candidate', coords);
  }
  setBest(coords: number[][] | null): void {
    this.line('best', coords);
  }
  /** The route found, in blue: drawn only when the replay ends. */
  setRoute(coords: number[][] | null): void {
    this.line('route', coords);
  }

  setMarkers(origin: [number, number] | null, destination: [number, number] | null): void {
    const features: Feature[] = [];
    if (origin) features.push({ type: 'Feature', properties: { origin: true }, geometry: { type: 'Point', coordinates: origin } });
    if (destination) features.push({ type: 'Feature', properties: { origin: false }, geometry: { type: 'Point', coordinates: destination } });
    this.set('markers', { type: 'FeatureCollection', features });
  }

  fit(bbox: BBox, maxZoom = 16): void {
    this.map.fitBounds(bbox, { padding: 32, maxZoom, duration: 900 });
  }

  zoom(): number {
    return this.map.getZoom();
  }

  /** Centre of the visible map (keyboard users pan with the arrow keys and pick the point under the crosshair). */
  centre(): { lon: number; lat: number } {
    const c = this.map.getCenter();
    return { lon: c.lng, lat: c.lat };
  }

  onClick(handler: (click: MapClick) => void): void {
    this.map.on('click', (e) => {
      const hits = this.map.queryRenderedFeatures(e.point, { layers: ['areas-fill', 'bairros-fill', 'municipalities-fill', 'states-fill'] });
      const top = hits.find((h) => h.layer.id === 'areas-fill') ?? hits[0];
      const layer = top ? top.layer.id.split('-')[0] : null;
      const kind = layer === 'areas' ? 'area' : layer === 'states' ? 'state' : layer === 'municipalities' ? 'municipality' : layer === 'bairros' ? 'bairro' : null;
      handler({ lon: e.lngLat.lng, lat: e.lngLat.lat, place: kind ? { layer: kind, code: String(top!.properties['code']) } : undefined });
    });
    this.map.on('mousemove', (e) => {
      const over = this.map.queryRenderedFeatures(e.point, { layers: ['areas-fill', 'states-fill', 'municipalities-fill', 'streets-line'] }).length > 0;
      this.map.getCanvas().style.cursor = over ? 'pointer' : '';
    });
  }

  destroy(): void {
    this.map.remove();
  }
}
