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

/** Everyday Science and Mechanics, Nov. 1931 (public domain): cutaway of a rear-engined streamliner. */
const CUTAWAY_1931: PartSource[] = [
  { x: 0.16, y: 0.34, label: { pt: 'Mola transversal dianteira', en: 'Front transverse spring', de: 'Vordere Querblattfeder' } },
  { x: 0.36, y: 0.45, label: { pt: 'Bancos dobráveis', en: 'Folding seats', de: 'Klappsitze' } },
  { x: 0.4, y: 0.67, label: { pt: 'Chassi de perfis de aço', en: 'Steel channel frame', de: 'Rahmen aus Stahl-U-Profilen' } },
  { x: 0.67, y: 0.6, label: { pt: 'Caixa de câmbio', en: 'Gearbox', de: 'Getriebe' } },
  { x: 0.8, y: 0.36, label: { pt: 'Radiadores duplos', en: 'Twin radiators', de: 'Doppelkühler' } },
  { x: 0.88, y: 0.48, label: { pt: 'Motor traseiro de 8 cilindros', en: 'Rear 8-cylinder engine', de: '8-Zylinder-Heckmotor' } },
];

/** US patent 2,269,452 (public domain): tubular body frame on the chassis. */
const BODY_FRAME: PartSource[] = [
  { x: 0.5, y: 0.33, label: { pt: 'Estrutura tubular da carroceria', en: 'Tubular body frame', de: 'Rohrrahmen der Karosserie' } },
  { x: 0.66, y: 0.38, label: { pt: 'Volante', en: 'Steering wheel', de: 'Lenkrad' } },
  { x: 0.62, y: 0.79, label: { pt: 'Longarina do chassi', en: 'Chassis side rail', de: 'Rahmenlängsträger' } },
  { x: 0.31, y: 0.74, label: { pt: 'Suspensão dianteira (mola e eixo)', en: 'Front suspension (spring and axle)', de: 'Vorderradaufhängung (Feder und Achse)' } },
  { x: 0.4, y: 0.84, label: { pt: 'Roda dianteira', en: 'Front wheel', de: 'Vorderrad' } },
  { x: 0.11, y: 0.66, label: { pt: 'Suporte dianteiro da estrutura', en: 'Front frame bracket', de: 'Vordere Rahmenhalterung' } },
];

/** Class diagram of the vehicle management system (project 1). */
const FLEET_UML: PartSource[] = [
  { x: 0.42, y: 0.07, label: { pt: 'Classe abstrata Veiculo: placa, marca, modelo, velocidade', en: 'Abstract Veiculo class: plate, make, model, top speed', de: 'Abstrakte Klasse Veiculo: Kennzeichen, Marke, Modell, Höchstgeschwindigkeit' } },
  { x: 0.12, y: 0.08, label: { pt: 'Motor (composição): pistões e potência', en: 'Motor (composition): pistons and power', de: 'Motor (Komposition): Kolben und Leistung' } },
  { x: 0.22, y: 0.49, label: { pt: 'Passeio: carro de passeio (herança)', en: 'Passeio: passenger car (inheritance)', de: 'Passeio: Pkw (Vererbung)' } },
  { x: 0.57, y: 0.49, label: { pt: 'Carga: veículo de carga (herança)', en: 'Carga: cargo vehicle (inheritance)', de: 'Carga: Lastfahrzeug (Vererbung)' } },
  { x: 0.66, y: 0.36, label: { pt: 'Interface Calcular', en: 'Calcular interface', de: 'Schnittstelle Calcular' } },
  { x: 0.65, y: 0.26, label: { pt: 'Exceções: velocidade inválida, veículo já cadastrado', en: 'Exceptions: invalid speed, vehicle already registered', de: 'Ausnahmen: ungültige Geschwindigkeit, Fahrzeug schon erfasst' } },
  { x: 0.68, y: 0.77, label: { pt: 'BDVeiculos: listas de veículos em memória', en: 'BDVeiculos: in-memory vehicle lists', de: 'BDVeiculos: Fahrzeuglisten im Speicher' } },
  { x: 0.81, y: 0.58, label: { pt: 'Teste: menu principal (main)', en: 'Teste: main menu (main)', de: 'Teste: Hauptmenü (main)' } },
];

const SOURCES = { chassis: CHASSIS, patent1900: PATENT_1900, cutaway1931: CUTAWAY_1931, bodyFrame: BODY_FRAME, fleetUml: FLEET_UML };
export type BlueprintKind = keyof typeof SOURCES;

export function blueprintParts(kind: BlueprintKind, locale: Locale): BlueprintPart[] {
  return SOURCES[kind].map((p) => ({ x: p.x, y: p.y, label: p.label[locale] }));
}
