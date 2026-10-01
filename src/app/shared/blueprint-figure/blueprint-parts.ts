import { Locale } from '../../services/i18n.service';

/** A numbered part on a drawing: position as a fraction of the image width/height. */
export interface BlueprintPart {
  x: number;
  y: number;
  label: string;
}

interface PartSource {
  x: number;
  y: number;
  label: Record<Locale, string>;
}

const CHASSIS: PartSource[] = [
  { x: 0.24, y: 0.3, label: { pt: 'Motor', en: 'Engine', de: 'Motor' } },
  { x: 0.49, y: 0.2, label: { pt: 'Volante e coluna de direção', en: 'Steering wheel and column', de: 'Lenkrad und Lenksäule' } },
  { x: 0.31, y: 0.79, label: { pt: 'Roda dianteira', en: 'Front wheel', de: 'Vorderrad' } },
  { x: 0.6, y: 0.45, label: { pt: 'Longarinas do chassi', en: 'Frame rails', de: 'Rahmenlängsträger' } },
  { x: 0.82, y: 0.44, label: { pt: 'Roda traseira', en: 'Rear wheel', de: 'Hinterrad' } },
];

/** US patent drawing of 1900 (public domain): tiller steering, engine under the seat, leaf spring. */
const PATENT_1900: PartSource[] = [
  { x: 0.385, y: 0.3, label: { pt: 'Coluna de direção', en: 'Steering column', de: 'Lenksäule' } },
  { x: 0.5, y: 0.47, label: { pt: 'Motor e volante do motor', en: 'Engine and flywheel', de: 'Motor und Schwungrad' } },
  { x: 0.6, y: 0.3, label: { pt: 'Assento', en: 'Seat', de: 'Sitz' } },
  { x: 0.21, y: 0.71, label: { pt: 'Roda dianteira', en: 'Front wheel', de: 'Vorderrad' } },
  { x: 0.78, y: 0.71, label: { pt: 'Eixo traseiro', en: 'Rear axle', de: 'Hinterachse' } },
  { x: 0.5, y: 0.63, label: { pt: 'Chassi e mola', en: 'Frame and spring', de: 'Rahmen und Feder' } },
];

const SOURCES = { chassis: CHASSIS, patent1900: PATENT_1900 };
export type BlueprintKind = keyof typeof SOURCES;

export function blueprintParts(kind: BlueprintKind, locale: Locale): BlueprintPart[] {
  return SOURCES[kind].map((p) => ({ x: p.x, y: p.y, label: p.label[locale] }));
}
