import type * as Ml from 'maplibre-gl';
import type { Feature, FeatureCollection } from 'geojson';

/** Bounding box [west, south, east, north] in degrees. */
export type BBox = [number, number, number, number];

export interface MapClick {
  lon: number;
  lat: number;
  /** Code of the state or municipality polygon under the click, if any (topmost first). */
  place?: { layer: 'state' | 'municipality' | 'bairro'; code: string };
}

const EMPTY: FeatureCollection = { type: 'FeatureCollection', features: [] };
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

/** Colours of the map layers. */
type Palette = Record<'land' | 'border' | 'select' | 'street' | 'visit' | 'route' | 'origin' | 'destination', string>;

/** CSS custom properties of the site, read once so the map follows the page's light or dark theme. */
function palette(el: HTMLElement): Palette {
  const css = getComputedStyle(el);
  const read = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  return {
    land: read('--map-land', '#eef2f7'),
    border: read('--map-border', '#7f8ea3'),
    select: read('--map-select', '#1b5fb4'),
    street: read('--map-street', '#5b6779'),
    visit: read('--map-visit', '#f2a93b'),
    route: read('--map-route', '#d6336c'),
    origin: read('--map-origin', '#2b8a3e'),
    destination: read('--map-destination', '#c92a2a'),
  };
}

/**
 * The map of the street-routing page: IBGE boundaries, the street graph, the search animation and the route,
 * on MapLibre GL with no external tiles (every layer is a GeoJSON file of this site, so the page needs no third-
 * party server and keeps the site's Content-Security-Policy). Text labels are left to the page (no glyph server).
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
    view.addLayers(c);
    return view;
  }

  private addLayers(c: Palette): void {
    const m = this.map;
    for (const id of ['states', 'municipalities', 'bairros', 'streets', 'visits', 'route', 'markers', 'selected']) {
      m.addSource(id, { type: 'geojson', data: EMPTY });
    }
    m.addLayer({ id: 'states-fill', type: 'fill', source: 'states', paint: { 'fill-color': c.select, 'fill-opacity': 0.04 } });
    m.addLayer({ id: 'states-line', type: 'line', source: 'states', paint: { 'line-color': c.border, 'line-width': 1.2 } });
    m.addLayer({ id: 'municipalities-fill', type: 'fill', source: 'municipalities', paint: { 'fill-color': c.select, 'fill-opacity': 0.02 } });
    m.addLayer({ id: 'municipalities-line', type: 'line', source: 'municipalities', paint: { 'line-color': c.border, 'line-width': 0.5, 'line-opacity': 0.7 } });
    m.addLayer({ id: 'bairros-fill', type: 'fill', source: 'bairros', paint: { 'fill-color': c.select, 'fill-opacity': 0.03 } });
    m.addLayer({ id: 'bairros-line', type: 'line', source: 'bairros', paint: { 'line-color': c.select, 'line-width': 0.8, 'line-dasharray': [2, 2], 'line-opacity': 0.6 } });
    m.addLayer({ id: 'selected-line', type: 'line', source: 'selected', paint: { 'line-color': c.select, 'line-width': 2.5 } });
    m.addLayer({
      id: 'streets-line', type: 'line', source: 'streets', filter: ['!', ['get', 'b']],
      paint: { 'line-color': c.street, 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.4, 16, 2.5], 'line-opacity': 0.8 },
    });
    m.addLayer({
      id: 'links-line', type: 'line', source: 'streets', filter: ['get', 'b'],
      paint: { 'line-color': c.street, 'line-width': 1.5, 'line-dasharray': [2, 2], 'line-opacity': 0.8 },
    });
    m.addLayer({
      id: 'visits-circle', type: 'circle', source: 'visits',
      paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 1, 16, 3], 'circle-color': ['case', ['get', 'back'], c.select, c.visit], 'circle-opacity': 0.7 },
    });
    m.addLayer({ id: 'route-casing', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ffffff', 'line-width': 7 } });
    m.addLayer({ id: 'route-line', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': c.route, 'line-width': 4 } });
    m.addLayer({
      id: 'markers-circle', type: 'circle', source: 'markers',
      paint: { 'circle-radius': 7, 'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff', 'circle-color': ['case', ['get', 'origin'], c.origin, c.destination] },
    });
  }

  private set(source: string, data: FeatureCollection | Feature): void {
    (this.map.getSource(source) as Ml.GeoJSONSource).setData(data);
  }

  setStates(fc: FeatureCollection): void {
    this.set('states', fc);
  }
  setMunicipalities(fc: FeatureCollection | null): void {
    this.set('municipalities', fc ?? EMPTY);
  }
  setBairros(fc: FeatureCollection | null): void {
    this.set('bairros', fc ?? EMPTY);
  }
  setSelected(feature: Feature | null): void {
    this.set('selected', feature ?? EMPTY);
  }
  setStreets(fc: FeatureCollection | null): void {
    this.set('streets', fc ?? EMPTY);
  }
  setVisits(points: Feature[]): void {
    this.set('visits', { type: 'FeatureCollection', features: points });
  }
  setRoute(coords: number[][] | null): void {
    this.set('route', coords && coords.length > 1 ? { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } } : EMPTY);
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

  onClick(handler: (click: MapClick) => void): void {
    this.map.on('click', (e) => {
      const hits = this.map.queryRenderedFeatures(e.point, { layers: ['bairros-fill', 'municipalities-fill', 'states-fill'] });
      const top = hits[0];
      const layer = top ? (top.layer.id.split('-')[0] as 'states' | 'municipalities' | 'bairros') : null;
      const kind = layer === 'states' ? 'state' : layer === 'municipalities' ? 'municipality' : layer === 'bairros' ? 'bairro' : null;
      handler({ lon: e.lngLat.lng, lat: e.lngLat.lat, place: kind ? { layer: kind, code: String(top!.properties['code']) } : undefined });
    });
    this.map.on('mousemove', (e) => {
      const over = this.map.queryRenderedFeatures(e.point, { layers: ['states-fill', 'municipalities-fill', 'streets-line'] }).length > 0;
      this.map.getCanvas().style.cursor = over ? 'pointer' : '';
    });
  }

  destroy(): void {
    this.map.remove();
  }
}
