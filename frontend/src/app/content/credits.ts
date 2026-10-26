export interface ImageCredit {
  title: string;
  author: string;
  /** `null` means public domain; the label is localized in the footer. */
  license: string | null;
  url: string;
}

/** Sources of the illustrations (assets/images/blueprints) and photographs (assets/images/photos), all from Wikimedia Commons. */
export const IMAGE_CREDITS: ImageCredit[] = [
  {
    title: 'Streamlined Car Carries Engine at Rear (1931)',
    author: 'Everyday Science and Mechanics',
    license: null,
    url: 'https://commons.wikimedia.org/wiki/File:Streamlined_Car.png',
  },
  {
    title: 'Chassis',
    author: 'Pearson Scott Foresman',
    license: null,
    url: 'https://commons.wikimedia.org/wiki/File:Chassis_(PSF).jpg',
  },
  {
    title: 'US Patent 652,851 — Automobile Vehicle (1900)',
    author: 'H. W. Libbey · U.S. National Archives',
    license: null,
    url: "https://commons.wikimedia.org/wiki/File:Patent_Drawing_for_H._W._Libbey's_Automobile_Vehicle_-_NARA_-_7369158.jpg",
  },
  {
    title: 'US Patent 2,269,452 — Fig. 1',
    author: 'U.S. Patent Office',
    license: null,
    url: 'https://commons.wikimedia.org/wiki/File:Fig_1_patent_2,269,452.jpg',
  },
  {
    title: 'Green circuit board II',
    author: 'Peter Shanks',
    license: 'CC BY 2.0',
    url: 'https://commons.wikimedia.org/wiki/File:Green_circuit_board_II_(2389301870).jpg',
  },
  // photographs behind the page heroes and in the area doors (assets/images/photos, cropped and resized to WebP)
  {
    title: 'Macro laptop coding',
    author: 'Marc Mueller (Unsplash)',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Macro_laptop_coding_(Unsplash).jpg',
  },
  {
    title: 'Stelvio Pass',
    author: 'Raul Taciu (Unsplash)',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Stelvio_Pass_(Unsplash).jpg',
  },
  {
    title: 'Highway light trails at night',
    author: 'Jamie Street (Unsplash)',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Highway_light_trains_at_night_(Unsplash).jpg',
  },
  {
    title: 'Turing Chips TU104 TU106 TU116',
    author: 'Fritzchens Fritz',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Turing_Chips_TU104_TU106_TU116_DSC09169-DSC09169_(50914923407).jpg',
  },
  {
    title: 'Racks, Amravati Data Center',
    author: 'PiDatacenters',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Racks_Amravati_Data_Center.jpg',
  },
  {
    title: 'Serra de São José, Tiradentes (MG)',
    author: 'Pedro Vilela · MTur Destinos',
    license: null,
    url: 'https://commons.wikimedia.org/wiki/File:PedroVilela_Serra_de_S%C3%A3o_Jos%C3%A9_Tiradentes_MG_(39971915645).jpg',
  },
  {
    title: 'Seattle Skyline, Kerry Park',
    author: 'Sajad Mohamad',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Seattle_Skyline_Kerry_Park.jpg',
  },
  {
    title: 'Neues Schloss, Schlossplatz Stuttgart',
    author: 'Julian Herzog',
    license: 'CC BY 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Neues_Schloss_Schlossplatz_Stuttgart_2015_01.jpg',
  },
  {
    title: 'Vista aérea de la Avenida Paulista de São Paulo',
    author: 'ProtoplasmaKid',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_de_la_Avenida_Paulista_de_S%C3%A3o_Paulo_01.jpg',
  },
  {
    title: 'Cataratas do Iguaçu (2022)',
    author: 'Pribruder',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Cataratas_do_Igua%C3%A7u_(2022).jpg',
  },
  {
    title: 'Imagens de Brasília — Congresso Nacional',
    author: 'Agência Senado',
    license: 'CC BY 2.0',
    url: 'https://commons.wikimedia.org/wiki/File:Imagens_de_Bras%C3%ADlia_-_Congresso_Nacional_(50060213016).jpg',
  },
  {
    title: 'Noronha — Morro Dois Irmãos',
    author: 'Cassinha Magalhães',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:NORONHA_-_MORRO_DOIS_IRM%C3%83OS.jpg',
  },
  {
    title: 'Cânion do Itaimbezinho entre nuvens',
    author: 'Guilherme Nunes Serafina',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:C%C3%A2nion_do_Itaimbezinho_entre_nuvens.jpg',
  },
  {
    title: 'Austin skyline and Lady Bird Lake',
    author: 'Michael Barera',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Austin_August_2019_19_(skyline_and_Lady_Bird_Lake).jpg',
  },
  {
    title: 'Miami — Skyline from Harbor',
    author: 'P. Hughes',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Miami_-_Skyline_from_Harbor.jpg',
  },
  {
    title: 'Vista panorámica desde Olympiapark, Múnich',
    author: 'Diego Delso',
    license: 'CC BY-SA 3.0',
    url: 'https://commons.wikimedia.org/wiki/File:Vista_panor%C3%A1mica_desde_Olympiapark,_M%C3%BAnich,_Alemania_2012-04-28,_DD_03.JPG',
  },
  {
    title: 'Berliner Dom an der Spree',
    author: 'Moahim',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:2019_-_Berliner_Dom_an_der_Spree.jpg',
  },
  {
    title: 'Coffee berries on the plant',
    author: 'Hannes Wilms',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Coffee_berries_on_the_plant.jpg',
  },
  {
    title: 'Lago Igapó, Londrina',
    author: 'Erika',
    license: 'CC BY 2.0',
    url: 'https://commons.wikimedia.org/wiki/File:Lago_Igap%C3%B3_-_Londrina.jpg',
  },
];
