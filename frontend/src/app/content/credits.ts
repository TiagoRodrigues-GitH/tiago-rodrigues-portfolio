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
  {
    title: 'Rio de Janeiro',
    author: 'Agustin Diaz Gargiulo (Unsplash)',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Rio_de_Janeiro._Unsplash_7F65HDP0-E0.jpg',
  },
  {
    title: 'Cristo Redentor e Pedra da Gávea',
    author: 'Luciola Vilella · MTur Destinos',
    license: null,
    url: 'https://commons.wikimedia.org/wiki/File:LuciolaVilella_Cristo_Redentor_Pedra_da_Gavea_Rio_de_Janeiro_RJ_(40070292465).jpg',
  },
  {
    title: 'Pelourinho, Salvador',
    author: 'Paul R. Burley',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Pelourinho_Salvador_Bahia_2018-0601.jpg',
  },
  {
    title: 'Lago Negro, Gramado',
    author: 'Amanda Likes',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Lago_Negro,_Gramado-RS.jpg',
  },
  {
    title: 'Teatro Amazonas, Manaus',
    author: 'Ridiculopathy',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Amazon_Theatre,_Teatro_Amazonas._Manaus,_Brazil._01.jpg',
  },
  {
    title: 'Praça Tiradentes, Ouro Preto',
    author: 'João André Simiquelli de Souza',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Pra%C3%A7a_Tiradentes_-_Ouro_Preto_-_MG.jpg',
  },
  {
    title: 'Lençóis Maranhenses',
    author: 'Julius Dadalti',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Len%C3%A7%C3%B3is_Maranhenses_2018_(cropped).jpg',
  },
  {
    title: 'Neuschwanstein Castle',
    author: 'Wilfredor',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Neuschwanstein_Castle_2024.jpg',
  },
  {
    title: 'Kölner Dom und Hohenzollernbrücke',
    author: 'dronepicr',
    license: 'CC BY 2.0',
    url: 'https://commons.wikimedia.org/wiki/File:K%C3%B6lner_Dom_Hohenzollernbr%C3%BCcke_(30337111332).jpg',
  },
  {
    title: 'Heidelberg, Alte Brücke und Schloss',
    author: 'Tilman2007',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Heidelberg,_Alte_Br%C3%BCcke,_Schloss_20170601_002.jpg',
  },
  {
    title: 'Golden Gate Bridge from Battery East',
    author: 'Frank Schulenburg',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Golden_Gate_Bridge_as_seen_from_Battery_East.jpg',
  },
  {
    title: 'Grand Canyon, Mather Point',
    author: 'Tuxyso',
    license: 'CC BY-SA 3.0',
    url: 'https://commons.wikimedia.org/wiki/File:Grand_Canyon_Mather_Point_2013.jpg',
  },
  {
    title: 'Brooklyn Bridge',
    author: 'Arild Vågen',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Brooklyn_Bridge_August_2017.jpg',
  },
  {
    title: 'Statue of Liberty and Manhattan',
    author: 'VillageHero',
    license: 'CC BY-SA 2.0',
    url: 'https://commons.wikimedia.org/wiki/File:Statue_of_Liberty_and_Manhattan_(New_York)_(43429351020).jpg',
  },
  {
    title: 'Lago Igapó e edifícios, Londrina',
    author: 'Vinícius E. M.',
    license: 'CC BY 2.0',
    url: 'https://commons.wikimedia.org/wiki/File:Lago_Igap%C3%B3_Londrina.jpg',
  },
  {
    title: 'Antiga estação rodoviária, Londrina',
    author: 'Isack Ryuji Minowa',
    license: 'CC BY-SA 3.0',
    url: 'https://commons.wikimedia.org/wiki/File:Antiga_esta%C3%A7%C3%A3o_rodovi%C3%A1ria_2010-01-11_Isack_-_panoramio.jpg',
  },
  {
    title: 'Museu Histórico de Londrina',
    author: 'Marcos Guerra',
    license: null,
    url: 'https://commons.wikimedia.org/wiki/File:Panoramica1-museu.jpg',
  },
  {
    title: 'Coffee cup on coffee beans',
    author: 'Toni Cuenca',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Coffee_cup_on_coffee_beans.jpg',
  },
  {
    title: 'Coffee Berries',
    author: 'Jonathan Wilkins',
    license: 'CC BY-SA 3.0',
    url: 'https://commons.wikimedia.org/wiki/File:Coffee_Berries.jpg',
  },
  {
    title: 'Colheita mecanizada de café, cerrado',
    author: 'Tiago Firmino Boaven… (Panoramio)',
    license: 'CC BY 3.0',
    url: 'https://commons.wikimedia.org/wiki/File:Caf%C3%A9_cai,_cerrado,_colheita_mecanizada_de_caf%C3%A9._-_panoramio.jpg',
  },
  {
    title: 'Coffee, notebooks and pen',
    author: 'Freddy Castro (Unsplash)',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Coffee,_notebooks_and_pen_(Unsplash).jpg',
  },
  {
    title: 'Moraine Lake, Banff National Park',
    author: 'Dylannother',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Moraine_Lake_Summer_Banff_National_Park.jpg',
  },
  {
    title: 'Toronto skyline from Trillium Park',
    author: 'Maksim Sokolov',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Toronto_skyline_viewed_from_Trillium_Park.jpg',
  },
  {
    title: 'Vancouver skyline and mountains',
    author: 'Kyle Pearce',
    license: 'CC BY-SA 2.0',
    url: 'https://commons.wikimedia.org/wiki/File:Vancouver_Skyline_and_Mountains.jpg',
  },
  {
    title: 'Château Frontenac at dusk, Québec',
    author: 'Wilfredor',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Chateau_Frontenac_at_dusk_in_Quebec_City.jpg',
  },
  {
    title: 'Rainbow over Horseshoe Falls, Niagara',
    author: 'Rhododendrites',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Rainbow_over_horseshoe_falls_(52877p).jpg',
  },
  {
    title: 'Peyto Lake, Banff National Park',
    author: 'Dylannother',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Peyto_Lake_Banff_National_Park.jpg',
  },
  {
    title: 'Parliament Hill from the river path, Ottawa',
    author: 'Suwannee.payne',
    license: 'CC BY-SA 3.0',
    url: 'https://commons.wikimedia.org/wiki/File:Parliament_Hill_from_the_river_path.jpg',
  },
];
