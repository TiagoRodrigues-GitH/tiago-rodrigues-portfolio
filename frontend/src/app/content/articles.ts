import { Locale } from '../services/i18n.service';
import { BlueprintKind } from '../shared/blueprint-figure/blueprint-parts';

export interface ArticleReference {
  text: string;
  url?: string;
}

export interface ArticleFigure {
  /** Image path, `lane-diagram` (row-anchor illustration) or `patent-chart` (animated pendency chart). */
  src: string;
  width?: number;
  height?: number;
  alt: string;
  caption: string;
  /** Numbered parts drawn over a raster drawing (interactive callouts). */
  blueprint?: BlueprintKind;
}

export interface Article {
  id: string;
  tag: string;
  title: string;
  lede: string;
  paragraphs: string[];
  figure: ArticleFigure;
  references: ArticleReference[];
}

/* ---------- References shared across languages (IEEE style) ---------- */

const REF_YURTSEVER: ArticleReference = {
  text: 'E. Yurtsever, J. Lambert, A. Carballo and K. Takeda, “A Survey of Autonomous Driving: Common Practices and Emerging Technologies,” IEEE Access, vol. 8, pp. 58443–58469, 2020.',
  url: 'https://doi.org/10.1109/ACCESS.2020.2983149',
};
const REF_USECHE: ArticleReference = {
  text: 'S. A. Useche, M. Faus and F. Alonso, “Cyclist at 12 o’clock!: A systematic review of in-vehicle advanced driver assistance systems (ADAS) for preventing car-rider crashes,” Frontiers in Public Health, vol. 12, 2024.',
  url: 'https://doi.org/10.3389/fpubh.2024.1335209',
};
const REF_SAE: ArticleReference = {
  text: 'SAE International, “Taxonomy and Definitions for Terms Related to Driving Automation Systems for On-Road Motor Vehicles,” SAE J3016_202104, 2021.',
  url: 'https://www.sae.org/standards/content/j3016_202104/',
};
const REF_1931: ArticleReference = {
  text: '“Streamlined Car Carries Engine at Rear,” Everyday Science and Mechanics, p. 663, Nov. 1931.',
  url: 'https://commons.wikimedia.org/wiki/File:Streamlined_Car.png',
};
const REF_ZAKARIA: ArticleReference = {
  text: 'N. J. Zakaria et al., “Lane Detection in Autonomous Vehicles: A Systematic Review,” IEEE Access, vol. 11, pp. 3729–3765, 2023.',
  url: 'https://doi.org/10.1109/ACCESS.2023.3234442',
};
const REF_TANG: ArticleReference = {
  text: 'J. Tang, S. Li and P. Liu, “A Review of Lane Detection Methods Based on Deep Learning,” Pattern Recognition, vol. 111, p. 107623, 2021.',
  url: 'https://doi.org/10.1016/j.patcog.2020.107623',
};
const REF_UFLD: ArticleReference = {
  text: 'Z. Qin, H. Wang and X. Li, “Ultra Fast Structure-aware Deep Lane Detection,” in Proc. European Conference on Computer Vision (ECCV), 2020, pp. 276–291.',
  url: 'https://doi.org/10.1007/978-3-030-58586-0_17',
};
const REF_LANEATT: ArticleReference = {
  text: 'L. Tabelini et al., “Keep Your Eyes on the Lane: Real-Time Attention-Guided Lane Detection,” in Proc. IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR), 2021, pp. 294–302.',
  url: 'https://doi.org/10.1109/CVPR46437.2021.00036',
};
const REF_DONG: ArticleReference = {
  text: 'Y. Dong et al., “A Hybrid Spatial–Temporal Deep Learning Architecture for Lane Detection,” Computer-Aided Civil and Infrastructure Engineering, vol. 38, no. 1, pp. 67–86, 2023.',
  url: 'https://doi.org/10.1111/mice.12829',
};
const REF_TSAI: ArticleReference = {
  text: 'S.-E. Tsai, S.-M. Yang and C.-H. Hsieh, “Real-Time Deterministic Lane Detection on CPU-Only Embedded Systems via Binary Line Segment Filtering,” Electronics, vol. 15, no. 2, p. 351, 2026.',
  url: 'https://doi.org/10.3390/electronics15020351',
};

const LAW_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/L14902.htm';
const DECREE_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/D12435.htm';

const CHAPTER_3_REFS = [REF_ZAKARIA, REF_TANG, REF_UFLD, REF_LANEATT, REF_DONG, REF_TSAI];

/* ---------- Chapter 4: patents (figures checked against the WIPO reports, Oct 2026) ---------- */

const REF_LPI: ArticleReference = {
  text: 'BRASIL. Lei nº 9.279, de 14 de maio de 1996. Regula direitos e obrigações relativos à propriedade industrial. Brasília, DF, 1996.',
  url: 'https://www.planalto.gov.br/ccivil_03/leis/l9279.htm',
};
const REF_EPC: ArticleReference = {
  text: 'European Patent Office, “European Patent Convention,” 17th ed., Munich: EPO, 2020.',
  url: 'https://www.epo.org/en/legal/epc',
};
const REF_WIPI_2025: ArticleReference = {
  text: 'World Intellectual Property Organization, “World Intellectual Property Indicators 2025,” Geneva: WIPO, 2025 (figs. A29, A30, A48, A49).',
  url: 'https://www.wipo.int/edocs/pubdocs/en/wipo-pub-941-17-2025-en-world-intellectual-property-indicators-2025.pdf',
};
const REF_WIPI_2017: ArticleReference = {
  text: 'World Intellectual Property Organization, “World Intellectual Property Indicators 2017 — Special section: patent office operations,” Geneva: WIPO, 2017 (fig. S5, annex S2).',
  url: 'https://www.wipo.int/edocs/pubdocs/en/wipo_pub_941_2017-chapter1.pdf',
};
const REF_UP: ArticleReference = {
  text: 'European Patent Office, “Unitary Patent,” Munich: EPO (in force since 1 June 2023).',
  url: 'https://www.epo.org/en/applying/european/unitary/unitary-patent',
};
const PATENT_REFS = [REF_LPI, REF_EPC, REF_WIPI_2025, REF_WIPI_2017, REF_UP];
const PENDENCY = { width: 960, height: 540 };

const CUTAWAY = { src: 'assets/images/blueprints/cutaway-1931.webp', width: 1475, height: 622, blueprint: 'cutaway1931' as const };
const BODY_FRAME = { src: 'assets/images/blueprints/body-frame.webp', width: 583, height: 382, blueprint: 'bodyFrame' as const };

export const ARTICLES: Record<Locale, Article[]> = {
  pt: [
    {
      id: 'perceber',
      tag: 'O que são sistemas ADAS',
      title: 'Quando o carro aprendeu a perceber',
      lede: 'Durante quase um século, entender um carro significava entender molas, eixos e engrenagens. Hoje, também significa entender sensores, algoritmos e decisões tomadas em milissegundos.',
      paragraphs: [
        'Em 1931, uma revista de divulgação científica publicou o corte de um carro aerodinâmico com motor traseiro: cada mola, cada eixo e cada engrenagem aparecia identificado no desenho [4]. Era assim que se explicava um automóvel — pela sua mecânica. Quase cem anos depois, o mesmo exercício exigiria desenhar outra camada: câmeras, radares, unidades de processamento e o software que liga tudo isso.',
        'Essa camada tem nome: Sistemas Avançados de Assistência ao Condutor (Advanced Driver Assistance Systems — ADAS). São tecnologias embarcadas que ajudam o motorista a perceber o ambiente e a tomar decisões e que, em determinadas funções, intervêm diretamente no veículo. Segundo Yurtsever et al. [1], esses sistemas representam uma etapa importante na evolução da automação veicular, pois combinam sensores, processamento computacional e algoritmos para interpretar o ambiente de condução.',
        'Imagine uma rodovia à noite, sob chuva. O controle adaptativo de velocidade (ACC) mantém a distância para o veículo à frente; se ele freia de repente, a frenagem automática de emergência (AEB) reage antes que o motorista perceba o risco; quando o carro começa a sair da faixa sem a seta acionada, o alerta de saída de faixa (LDWS) avisa, e o assistente de permanência em faixa (LKAS) corrige suavemente a direção. Na taxonomia SAE J3016, recursos como esses são classificados como de suporte ao condutor (níveis 0 a 2): o sistema auxilia, mas quem conduz continua sendo a pessoa ao volante [3]. Estudos de revisão também investigam essas tecnologias como ferramentas para aumentar a segurança e reduzir situações de risco no trânsito [2].',
        'Esses recursos deixaram de ser exclusividade de modelos de luxo e já aparecem em veículos vendidos no Brasil — tanto que, como mostra o próximo capítulo, passaram a integrar a política industrial do setor. O ponto central, porém, é outro: ADAS não é uma tecnologia única, mas um conjunto de funções que atuam de forma integrada, com diferentes sensores e níveis de automação.',
        'Por isso, um sistema ADAS deve ser entendido como uma arquitetura de assistência ao condutor, e não como um recurso isolado. Câmera, radar, processamento e algoritmos de percepção formam uma cadeia que transforma informações do ambiente em alertas ou ações. No LKAS, por exemplo, tudo começa com uma pergunta simples — onde estão as faixas? —, cuja resposta permite estimar a posição do veículo na pista e assistir a direção. É nessa pergunta que a visão computacional e a inteligência artificial entram na história.',
      ],
      figure: {
        ...CUTAWAY,
        alt: 'Desenho em corte de um carro aerodinâmico de 1931 com motor traseiro, mostrando chassi, molas, eixos, câmbio e motor identificados por legendas.',
        caption: 'Fig. 01 — Corte de um carro aerodinâmico com motor traseiro, publicado em Everyday Science and Mechanics, novembro de 1931 (domínio público).',
      },
      references: [REF_YURTSEVER, REF_USECHE, REF_SAE, REF_1931],
    },
    {
      id: 'regras',
      tag: 'ADAS e regulamentação',
      title: 'As regras da estrada',
      lede: 'Um algoritmo que funciona no laboratório ainda não é um produto. Entre o protótipo e a rua existem leis, normas e uma escala para medir a maturidade de cada tecnologia.',
      paragraphs: [
        'Todo sistema que interfere na condução precisa responder a uma pergunta antes de chegar às ruas: como provar que ele é seguro? No Brasil, parte dessa resposta veio da política industrial. A Lei nº 14.902/2024, que instituiu o Programa Mobilidade Verde e Inovação (MOVER), incluiu entre suas diretrizes o aumento da disponibilidade de tecnologias assistivas à direção nos veículos comercializados no país [1].',
        'O Decreto nº 12.435/2025, que regulamenta o programa, definiu o índice de desempenho estrutural e tecnologias assistivas à direção (InTec) e incluiu entre seus requisitos a frenagem automática de emergência (AEB), o alerta de afastamento de faixa (LDWS) e, no grupo de tecnologias inovadoras, o assistente de permanência em faixa (LKAS) [2]. Desde 1º de junho de 2025, a comercialização e a importação de determinados veículos novos estão condicionadas ao atendimento desses requisitos [3]. Para comprovar o desempenho, o decreto recorre às regulamentações do CONTRAN e, quando não há regra nacional específica, a referências internacionais, como os regulamentos da UNECE e as normas ISO [2].',
        'A homologação, porém, é apenas o fim de um caminho mais longo. Durante o desenvolvimento, a ISO 26262 estabelece a estrutura de segurança funcional para sistemas elétricos e eletrônicos automotivos [4] — ou seja, trata do que acontece quando algo falha. A ISO 21448 (SOTIF) vai além e trata dos riscos que existem mesmo quando nada falha: um sistema de percepção que funciona como projetado, mas interpreta mal uma faixa desgastada, por exemplo [5]. Para funções ligadas à manutenção da trajetória, o Regulamento ONU nº 79 é a referência internacional para sistemas de direção e funções de assistência [6].',
        'Resta medir o quanto uma tecnologia está pronta. Para isso existe o Technology Readiness Level (TRL). Na metodologia adotada pela Finep no MOVER, a escala vai do TRL 1, a observação dos princípios básicos, ao TRL 9, quando o sistema está em operação e comprovado em sua missão [7]. Na detecção de faixas, validar um modelo em datasets é uma etapa experimental; integrá-lo a hardware embarcado, testá-lo em ambiente relevante, demonstrá-lo em um veículo e qualificar o sistema são degraus progressivamente mais altos.',
        'O TRL não é uma certificação obrigatória para ADAS; é uma forma de descrever a maturidade de uma tecnologia específica. No contexto brasileiro, essa perspectiva aproxima a pesquisa acadêmica das etapas de desenvolvimento, validação e eventual industrialização. E revela o desafio do próximo capítulo: um modelo pode ser excelente no papel e, ainda assim, não caber no carro.',
      ],
      figure: {
        ...BODY_FRAME,
        alt: 'Desenho de patente com a estrutura tubular da carroceria de um automóvel sobre o chassi, com volante e roda dianteira.',
        caption: 'Fig. 02 — Estrutura de carroceria em desenho da patente norte-americana US 2.269.452 (domínio público).',
      },
      references: [
        { text: 'BRASIL. Lei nº 14.902, de 27 de junho de 2024. Institui o Programa Mobilidade Verde e Inovação — Programa MOVER. Brasília, DF, 2024.', url: LAW_URL },
        { text: 'BRASIL. Decreto nº 12.435, de 15 de abril de 2025. Regulamenta o Programa Mobilidade Verde e Inovação — Programa MOVER. Brasília, DF, 2025.', url: DECREE_URL },
        { text: 'BRASIL. Ministério do Desenvolvimento, Indústria, Comércio e Serviços. Programa MOVER. Brasília, 2026.' },
        { text: 'INTERNATIONAL ORGANIZATION FOR STANDARDIZATION. ISO 26262:2018 — Road vehicles — Functional safety. Genebra: ISO, 2018.' },
        { text: 'INTERNATIONAL ORGANIZATION FOR STANDARDIZATION. ISO 21448:2022 — Road vehicles — Safety of the intended functionality. Genebra: ISO, 2022.' },
        { text: 'UNITED NATIONS ECONOMIC COMMISSION FOR EUROPE. UN Regulation No. 79 — Uniform provisions concerning the approval of vehicles with regard to steering equipment. UNECE, 2022.' },
        { text: 'FINEP; MCTI; MDIC. Finep MOVER Empresarial — Anexo 5: Definição de Nível de Maturidade Tecnológica (TRL). Brasília, 2025.' },
      ],
    },
    {
      id: 'enxergar',
      tag: 'ADAS e IA',
      title: 'Enxergar rápido o suficiente',
      lede: 'Detectar a faixa não basta. Em um carro, a resposta precisa chegar a tempo, com estabilidade e dentro dos limites de um processador embarcado.',
      paragraphs: [
        'Voltemos à pergunta do primeiro capítulo: onde estão as faixas? A detecção de faixas (Lane Detection) é a etapa que estima a posição e a geometria das marcações da pista, e dela dependem funções como LDWS e LKAS. Revisões da área mostram uma transição de métodos tradicionais de processamento de imagens para arquiteturas de aprendizado profundo, capazes de aprender representações diretamente dos dados [1], [2].',
        'Essa evolução trouxe um novo dilema. Modelos maiores enxergam melhor, mas um carro não espera: a percepção precisa acontecer em tempo real, com robustez e eficiência computacional. Qin, Wang e Li responderam a esse dilema com o Ultra Fast Structure-aware Deep Lane Detection (UFLD), que trata a detecção de faixas como seleção por linhas (row-based selection) em vez de depender exclusivamente de segmentação pixel a pixel [3]. Em vez de classificar cada pixel da imagem, o modelo escolhe, em cada linha predefinida, a posição mais provável da faixa — o que reduz significativamente o custo computacional e eleva a velocidade de inferência.',
        'Outras abordagens seguiram caminhos diferentes. O LaneATT, de Tabelini et al., usa mecanismos de atenção para aproveitar informações globais da imagem e lidar com oclusões e marcações incompletas, sem abrir mão da eficiência em tempo real [4]. Pesquisas mais recentes exploram modelos temporais, que usam quadros consecutivos para melhorar a detecção quando uma única imagem não traz informação suficiente [5].',
        'A escolha de um algoritmo para ADAS, portanto, não depende só da precisão. Latência, quadros por segundo (FPS), memória, consumo computacional e estabilidade das previsões pesam tanto quanto o resultado em um benchmark. Um modelo pode liderar um ranking e, ainda assim, exigir recursos incompatíveis com a plataforma embarcada disponível. Trabalhos recentes sobre detecção de faixas em sistemas de baixo consumo reforçam a importância de arquiteturas capazes de operar em hardware limitado, inclusive em plataformas baseadas apenas em CPU [6].',
        'É nesse ponto que se concentra a minha pesquisa. No AI Residency Program, participo de um grupo de estudos que investiga algoritmos de detecção de faixas para sistemas embarcados — arquiteturas leves como UFLD e LaneATT, estratégias temporais, otimização de modelos e avaliação em hardware real. A pergunta deixa de ser apenas “a faixa pode ser detectada?” e passa a ser “ela pode ser detectada com precisão, estabilidade e velocidade suficientes para um carro?”.',
      ],
      figure: {
        src: 'lane-diagram',
        alt: 'Diagrama de uma estrada em perspectiva com linhas horizontais de referência; em cada linha, um ponto marca a posição escolhida para cada faixa.',
        caption: 'Fig. 03 — Seleção por linhas: em cada linha de referência (row anchor), o modelo escolhe a célula com maior probabilidade de conter a faixa.',
      },
      references: CHAPTER_3_REFS,
    },
    {
      id: 'patentes',
      tag: 'ADAS e patentes',
      title: 'O relógio das patentes',
      lede: 'Uma invenção automotiva pode levar anos para ser protegida. Quanto tempo, depende de onde o pedido é depositado — e essa diferença entra na estratégia de quem desenvolve tecnologia no Brasil.',
      paragraphs: [
        'Uma patente é um acordo: o inventor descreve publicamente a solução e, em troca, recebe o direito de impedir que outros a explorem por até 20 anos contados do depósito — no Brasil, pela Lei nº 9.279/1996 [1]; na Europa, pela Convenção sobre a Patente Europeia (EPC) [2]. Para quem trabalha com ADAS há um detalhe importante: nas duas legislações, o programa de computador “em si” não é invenção [1], [2]. O que se protege é a solução técnica — um método de percepção que reduz a latência em um processador embarcado, por exemplo —, e não o código.',
        'O caminho é parecido nos dois lados do Atlântico. No INPI, o pedido fica em sigilo por 18 meses, é publicado e precisa ter o exame requerido em até 36 meses do depósito; segue-se o exame técnico, com exigências e respostas, até a decisão [1]. No Escritório Europeu de Patentes (EPO), o pedido recebe um relatório de busca com parecer, é publicado aos 18 meses e o exame deve ser requerido em até seis meses após a publicação desse relatório; concedida a patente, terceiros têm nove meses para apresentar oposição [2]. Desde 1º de junho de 2023, a patente europeia pode ainda ganhar efeito unitário em boa parte dos países da União Europeia [5].',
        'A diferença está no relógio. Segundo a Organização Mundial da Propriedade Intelectual (OMPI), um pedido levava em média 95,4 meses até a decisão final no Brasil em 2016 — quase oito anos —, contra 23,3 meses no EPO [4]. Em 2024, o tempo brasileiro caiu para 38,4 meses, ainda acima dos 24,9 meses do EPO, dos 29,5 do escritório dos Estados Unidos, dos 15,5 da China e dos 12,9 do Japão [3]. Parte da explicação está na escala: em 2024, o INPI tinha 300 examinadores de patentes; o EPO, 4.005 [3]. A própria OMPI adverte que os procedimentos não são totalmente harmonizados e que a comparação entre escritórios exige cautela [3].',
        'Enquanto isso, o setor acelerou. Os pedidos de patente publicados no mundo na área de transporte passaram de 90.961 em 2013 para 140.730 em 2023, crescimento médio de 4,5% ao ano [3]. Alemanha, França, Suécia e Itália são as origens mais especializadas no tema entre as 15 maiores do período 2021–2023; o Brasil não aparece nesse grupo [3]. Para quem desenvolve tecnologia automotiva aqui, a lição é dupla: depositar cedo no Brasil garante a prioridade, mas proteger os mercados onde o carro será fabricado e vendido costuma passar também pelo EPO e por outros escritórios.',
        'É também por isso que a pesquisa precisa pensar em propriedade intelectual desde o início. Um algoritmo de detecção de faixas que roda em tempo real em hardware embarcado pode ser publicado, patenteado ou ambos — mas a ordem importa, porque a divulgação antes do depósito pode comprometer a novidade. No meu caso, essa é uma das etapas previstas: transformar resultados de pesquisa em um protótipo e, quando houver uma solução técnica nova, em um pedido de patente.',
      ],
      figure: {
        src: 'patent-chart',
        ...PENDENCY,
        alt: 'Gráfico de barras com o tempo médio até a decisão final de pedidos de patente em 2016 e 2024: Brasil 95,4 e 38,4 meses; Estados Unidos 22,6 e 29,5; Europa (EPO) 23,3 e 24,9; China 22,0 e 15,5; Japão 15,0 e 12,9.',
        caption: 'Fig. 04 — Tempo médio até a decisão final, em meses, contado do pedido de exame (ou do depósito). Fonte: OMPI, WIPI 2017 e 2025 [3], [4].',
      },
      references: PATENT_REFS,
    },
  ],
  en: [
    {
      id: 'perceive',
      tag: 'What ADAS is',
      title: 'When the car learned to perceive',
      lede: 'For almost a century, understanding a car meant understanding springs, axles and gears. Today, it also means understanding sensors, algorithms and decisions made in milliseconds.',
      paragraphs: [
        'In 1931, a popular science magazine published a cutaway of a streamlined car with a rear-mounted engine: every spring, axle and gear was labeled in the drawing [4]. That was how an automobile was explained — through its mechanics. Almost a hundred years later, the same exercise would require drawing another layer: cameras, radar, processing units and the software that connects them.',
        'That layer has a name: Advanced Driver Assistance Systems (ADAS). They are embedded technologies that help drivers perceive their surroundings and make decisions and, in certain functions, intervene directly in the vehicle. According to Yurtsever et al. [1], these systems are an important step in the evolution of vehicle automation, combining sensors, computing and algorithms to interpret the driving environment.',
        'Picture a highway at night, in the rain. Adaptive cruise control (ACC) keeps a safe distance from the vehicle ahead; if that vehicle brakes suddenly, automatic emergency braking (AEB) reacts before the driver perceives the risk; when the car starts to drift out of its lane without the turn signal on, lane departure warning (LDWS) alerts the driver and lane keeping assist (LKAS) gently corrects the steering. In the SAE J3016 taxonomy, features like these are classified as driver support features (levels 0 to 2): the system assists, but the person behind the wheel is still driving [3]. Review studies also investigate these technologies as tools to improve safety and reduce risk in traffic [2].',
        'These features are no longer exclusive to luxury models. They are already found in vehicles sold in Brazil — so much so that, as the next chapter shows, they have become part of the country’s industrial policy. The key point, however, is a different one: ADAS is not a single technology, but a set of functions that work together, using different sensors and levels of automation.',
        'An ADAS should therefore be understood as a driver-assistance architecture rather than an isolated feature. Cameras, radar, computing and perception algorithms form a chain that turns information about the environment into warnings or actions. In LKAS, for example, everything starts with a simple question — where are the lanes? — whose answer lets the system estimate the vehicle’s position on the road and assist the steering. That question is where computer vision and artificial intelligence enter the story.',
      ],
      figure: {
        ...CUTAWAY,
        alt: 'Cutaway drawing of a 1931 streamlined car with a rear engine, showing the chassis, springs, axles, gearbox and engine with labels.',
        caption: 'Fig. 01 — Cutaway of a streamlined car with a rear-mounted engine, published in Everyday Science and Mechanics, November 1931 (public domain).',
      },
      references: [REF_YURTSEVER, REF_USECHE, REF_SAE, REF_1931],
    },
    {
      id: 'rules',
      tag: 'ADAS and regulation',
      title: 'The rules of the road',
      lede: 'An algorithm that works in the lab is not yet a product. Between prototype and road there are laws, standards and a scale for measuring how mature each technology is.',
      paragraphs: [
        'Every system that intervenes in driving has to answer one question before it reaches the road: how do you prove it is safe? In Brazil, part of the answer came from industrial policy. Law No. 14,902/2024, which established the Green Mobility and Innovation Program (MOVER), included among its guidelines increasing the availability of driver-assistance technologies in vehicles sold in the country [1].',
        'Decree No. 12,435/2025, which regulates the program, defined the structural performance and driver-assistance technologies index (InTec) and included among its requirements automatic emergency braking (AEB), lane departure warning (LDWS) and, in the group of innovative technologies, lane keeping assist (LKAS) [2]. Since June 1, 2025, the sale and import of certain new vehicles have been conditional on meeting these requirements [3]. To demonstrate performance, the decree relies on CONTRAN regulations and, where no specific national rule exists, on international references such as UNECE regulations and ISO standards [2].',
        'Type approval, however, is only the end of a longer road. During development, ISO 26262 provides the functional safety framework for automotive electrical and electronic systems [4] — in other words, it deals with what happens when something fails. ISO 21448 (SOTIF) goes further and addresses the risks that exist even when nothing fails: a perception system that works as designed but misreads a worn lane marking, for example [5]. For functions related to keeping the vehicle on its path, UN Regulation No. 79 is the international reference for steering equipment and assistance functions [6].',
        'What remains is to measure how ready a technology is. That is what the Technology Readiness Level (TRL) scale is for. In the methodology Finep uses for MOVER, the scale runs from TRL 1, the observation of basic principles, to TRL 9, when the system is operating and proven in its mission [7]. In lane detection, validating a model on datasets is an experimental stage; integrating it into embedded hardware, testing it in a relevant environment, demonstrating it in a vehicle and qualifying the system are progressively higher steps.',
        'TRL is not a mandatory certification for ADAS; it is a way of describing the maturity of a specific technology. In the Brazilian context, this perspective brings academic research closer to development, validation and, eventually, industrialization. It also reveals the challenge of the next chapter: a model can be excellent on paper and still not fit in the car.',
      ],
      figure: {
        ...BODY_FRAME,
        alt: 'Patent drawing of an automobile’s tubular body frame mounted on the chassis, with the steering wheel and front wheel.',
        caption: 'Fig. 02 — Body frame structure from US patent 2,269,452 (public domain).',
      },
      references: [
        { text: 'Brazil, Law No. 14,902 of June 27, 2024. Establishes the Green Mobility and Innovation Program — MOVER. Brasília, 2024.', url: LAW_URL },
        { text: 'Brazil, Decree No. 12,435 of April 15, 2025. Regulates the Green Mobility and Innovation Program — MOVER. Brasília, 2025.', url: DECREE_URL },
        { text: 'Brazil, Ministry of Development, Industry, Trade and Services. MOVER Program. Brasília, 2026.' },
        { text: 'International Organization for Standardization, ISO 26262:2018 — Road vehicles — Functional safety. Geneva: ISO, 2018.' },
        { text: 'International Organization for Standardization, ISO 21448:2022 — Road vehicles — Safety of the intended functionality. Geneva: ISO, 2022.' },
        { text: 'United Nations Economic Commission for Europe, UN Regulation No. 79 — Uniform provisions concerning the approval of vehicles with regard to steering equipment. UNECE, 2022.' },
        { text: 'Finep; MCTI; MDIC, Finep MOVER Empresarial — Annex 5: Definition of Technology Readiness Level (TRL). Brasília, 2025.' },
      ],
    },
    {
      id: 'seeing',
      tag: 'ADAS and AI',
      title: 'Seeing fast enough',
      lede: 'Detecting the lane is not enough. In a car, the answer has to arrive on time, remain stable and fit within the limits of an embedded processor.',
      paragraphs: [
        'Back to the question from the first chapter: where are the lanes? Lane detection is the step that estimates the position and geometry of the road markings, and functions such as LDWS and LKAS depend on it. Reviews of the field describe a shift from traditional image-processing methods to deep-learning architectures that learn representations directly from data [1], [2].',
        'That progress created a new dilemma. Larger models see better, but a car does not wait: perception has to happen in real time, robustly and efficiently. Qin, Wang and Li addressed this dilemma with Ultra Fast Structure-aware Deep Lane Detection (UFLD), which treats lane detection as row-based selection rather than relying exclusively on pixel-by-pixel segmentation [3]. Instead of classifying every pixel in the image, the model chooses, for each predefined row, the most likely position of the lane — significantly reducing computational cost and increasing inference speed.',
        'Other approaches took different paths. LaneATT, by Tabelini et al., uses attention mechanisms to exploit global image information and handle occlusions and incomplete markings without giving up real-time efficiency [4]. More recent research explores temporal models, which use consecutive frames to improve detection when a single image does not contain enough information [5].',
        'Choosing an algorithm for ADAS therefore depends on more than accuracy. Latency, frames per second (FPS), memory, computational load and prediction stability matter as much as a benchmark score. A model can top a leaderboard and still demand resources the available embedded platform cannot provide. Recent work on lane detection for low-power systems reinforces the importance of architectures that can run on limited hardware, including CPU-only platforms [6].',
        'This is where my research is focused. In the AI Residency Program, I take part in a study group investigating lane-detection algorithms for embedded systems — lightweight architectures such as UFLD and LaneATT, temporal strategies, model optimization and evaluation on real hardware. The question is no longer just “can the lane be detected?” but “can it be detected accurately, stably and fast enough for a car?”',
      ],
      figure: {
        src: 'lane-diagram',
        alt: 'Diagram of a road in perspective with horizontal reference rows; on each row, a dot marks the position chosen for each lane.',
        caption: 'Fig. 03 — Row-based selection: on each reference row (row anchor), the model picks the cell most likely to contain the lane.',
      },
      references: CHAPTER_3_REFS,
    },
    {
      id: 'patents',
      tag: 'ADAS and patents',
      title: 'The patent clock',
      lede: 'Protecting an automotive invention can take years. How many depends on where the application is filed — and that difference shapes the strategy of anyone developing technology in Brazil.',
      paragraphs: [
        'A patent is a bargain: the inventor discloses the solution and, in return, may stop others from exploiting it for up to 20 years from filing — in Brazil under Law No. 9,279/1996 [1], in Europe under the European Patent Convention (EPC) [2]. For ADAS work one detail matters: under both laws a computer program “as such” is not an invention [1], [2]. What can be protected is the technical solution — a perception method that cuts latency on an embedded processor, for instance — not the code.',
        'The route is similar on both sides of the Atlantic. At INPI, Brazil’s patent office, the application stays secret for 18 months, is published, and examination must be requested within 36 months of filing; technical examination, office actions and replies follow until a decision [1]. At the European Patent Office (EPO), the application receives a search report with an opinion, is published at 18 months, and examination must be requested within six months of that report’s publication; once a patent is granted, third parties have nine months to oppose it [2]. Since 1 June 2023 a European patent can also have unitary effect across most European Union countries [5].',
        'The difference is the clock. According to the World Intellectual Property Organization (WIPO), an application took on average 95.4 months to reach a final decision in Brazil in 2016 — almost eight years — against 23.3 months at the EPO [4]. By 2024 Brazil was down to 38.4 months, still above the EPO’s 24.9, the US office’s 29.5, China’s 15.5 and Japan’s 12.9 [3]. Scale is part of the story: in 2024 INPI had 300 patent examiners, the EPO 4,005 [3]. WIPO itself warns that procedures are not fully harmonised, so comparisons between offices call for caution [3].',
        'Meanwhile the field sped up. Published patent applications in transport worldwide rose from 90,961 in 2013 to 140,730 in 2023, 4.5% a year on average [3]. Germany, France, Sweden and Italy are the most specialised origins in this field among the top 15 of 2021–2023; Brazil is not in that group [3]. For anyone building automotive technology in Brazil the lesson is twofold: filing early at home secures priority, but protecting the markets where the car will be built and sold usually means the EPO and other offices as well.',
        'That is also why research has to think about intellectual property from the start. A lane-detection algorithm that runs in real time on embedded hardware can be published, patented or both — but the order matters, because disclosure before filing can destroy novelty. In my own plans this is an explicit step: turning research results into a prototype and, where there is a new technical solution, into a patent application.',
      ],
      figure: {
        src: 'patent-chart',
        ...PENDENCY,
        alt: 'Bar chart of the average time to a final decision on patent applications in 2016 and 2024: Brazil 95.4 and 38.4 months; United States 22.6 and 29.5; Europe (EPO) 23.3 and 24.9; China 22.0 and 15.5; Japan 15.0 and 12.9.',
        caption: 'Fig. 04 — Average time to a final decision, in months, counted from the examination request (or filing). Source: WIPO, WIPI 2017 and 2025 [3], [4].',
      },
      references: PATENT_REFS,
    },
  ],
  de: [
    {
      id: 'wahrnehmen',
      tag: 'Was ADAS sind',
      title: 'Als das Auto wahrnehmen lernte',
      lede: 'Fast ein Jahrhundert lang hieß ein Auto verstehen: Federn, Achsen und Zahnräder verstehen. Heute gehören auch Sensoren, Algorithmen und Entscheidungen im Millisekundenbereich dazu.',
      paragraphs: [
        '1931 veröffentlichte eine populärwissenschaftliche Zeitschrift den Schnitt durch ein stromlinienförmiges Auto mit Heckmotor: Jede Feder, jede Achse und jedes Zahnrad war in der Zeichnung beschriftet [4]. So erklärte man damals ein Automobil – über seine Mechanik. Fast hundert Jahre später müsste man eine weitere Ebene einzeichnen: Kameras, Radar, Steuergeräte und die Software, die alles miteinander verbindet.',
        'Diese Ebene hat einen Namen: Fahrerassistenzsysteme (Advanced Driver Assistance Systems, ADAS). Es sind eingebettete Technologien, die die Person am Steuer dabei unterstützen, die Umgebung wahrzunehmen und Entscheidungen zu treffen, und die bei bestimmten Funktionen direkt in die Fahrzeugführung eingreifen. Laut Yurtsever et al. [1] sind diese Systeme ein wichtiger Schritt in der Entwicklung der Fahrzeugautomatisierung, weil sie Sensoren, Rechenleistung und Algorithmen verbinden, um das Fahrumfeld zu interpretieren.',
        'Man stelle sich eine Schnellstraße bei Nacht und Regen vor. Die adaptive Geschwindigkeitsregelung (ACC) hält den Abstand zum vorausfahrenden Fahrzeug; bremst dieses plötzlich, reagiert der Notbremsassistent (AEB), noch bevor die Person am Steuer die Gefahr erkennt; verlässt das Auto ohne Blinker die Spur, warnt der Spurverlassenswarner (LDWS), und der Spurhalteassistent (LKAS) korrigiert sanft die Lenkung. In der Taxonomie der SAE J3016 gelten solche Funktionen als Fahrerassistenz (Stufen 0 bis 2): Das System unterstützt, gefahren wird aber weiterhin vom Menschen am Steuer [3]. Übersichtsarbeiten untersuchen diese Technologien zudem als Mittel, um die Verkehrssicherheit zu erhöhen und Risikosituationen zu verringern [2].',
        'Diese Funktionen sind längst nicht mehr Oberklassemodellen vorbehalten. Sie finden sich bereits in Fahrzeugen, die in Brasilien verkauft werden – so sehr, dass sie, wie das nächste Kapitel zeigt, Teil der Industriepolitik des Landes geworden sind. Entscheidend ist jedoch etwas anderes: ADAS ist keine einzelne Technologie, sondern ein Zusammenspiel von Funktionen mit unterschiedlichen Sensoren und Automatisierungsstufen.',
        'Ein ADAS ist deshalb als Assistenzarchitektur zu verstehen, nicht als isoliertes Ausstattungsmerkmal. Kamera, Radar, Rechenleistung und Wahrnehmungsalgorithmen bilden eine Kette, die Umgebungsinformationen in Warnungen oder Eingriffe übersetzt. Beim LKAS beginnt alles mit einer einfachen Frage – wo verlaufen die Fahrspuren? –, deren Antwort es erlaubt, die Position des Fahrzeugs auf der Fahrbahn zu schätzen und die Lenkung zu unterstützen. Genau an dieser Stelle treten Computer Vision und künstliche Intelligenz in die Geschichte ein.',
      ],
      figure: {
        ...CUTAWAY,
        alt: 'Schnittzeichnung eines stromlinienförmigen Autos mit Heckmotor aus dem Jahr 1931; Fahrgestell, Federn, Achsen, Getriebe und Motor sind beschriftet.',
        caption: 'Abb. 01 – Schnitt durch ein stromlinienförmiges Auto mit Heckmotor, veröffentlicht in Everyday Science and Mechanics, November 1931 (gemeinfrei).',
      },
      references: [REF_YURTSEVER, REF_USECHE, REF_SAE, REF_1931],
    },
    {
      id: 'regeln',
      tag: 'ADAS und Regulierung',
      title: 'Die Regeln der Straße',
      lede: 'Ein Algorithmus, der im Labor funktioniert, ist noch kein Produkt. Zwischen Prototyp und Straße liegen Gesetze, Normen und eine Skala, die den Reifegrad jeder Technologie misst.',
      paragraphs: [
        'Jedes System, das in die Fahrzeugführung eingreift, muss vor dem Einsatz auf der Straße eine Frage beantworten: Wie lässt sich nachweisen, dass es sicher ist? In Brasilien kam ein Teil der Antwort aus der Industriepolitik. Das Gesetz Nr. 14.902/2024, mit dem das Programm für grüne Mobilität und Innovation (MOVER) geschaffen wurde, nennt unter seinen Leitlinien die stärkere Verbreitung von Fahrerassistenztechnologien in den im Land verkauften Fahrzeugen [1].',
        'Das Dekret Nr. 12.435/2025, das das Programm regelt, definiert den Index für strukturelle Leistungsfähigkeit und Fahrerassistenztechnologien (InTec) und nennt unter seinen Anforderungen den Notbremsassistenten (AEB), den Spurverlassenswarner (LDWS) und – in der Gruppe der innovativen Technologien – den Spurhalteassistenten (LKAS) [2]. Seit dem 1. Juni 2025 sind Verkauf und Import bestimmter Neufahrzeuge an die Erfüllung dieser Anforderungen gebunden [3]. Für den Leistungsnachweis verweist das Dekret auf Regelungen des CONTRAN und, wo keine spezifische nationale Vorschrift besteht, auf internationale Grundlagen wie UNECE-Regelungen und ISO-Normen [2].',
        'Die Typgenehmigung ist allerdings nur das Ende eines längeren Weges. Während der Entwicklung bildet die ISO 26262 den Rahmen für die funktionale Sicherheit elektrischer und elektronischer Systeme im Fahrzeug [4] – sie behandelt also, was geschieht, wenn etwas ausfällt. Die ISO 21448 (SOTIF) geht weiter und betrachtet Risiken, die auch dann bestehen, wenn nichts ausfällt: etwa ein Wahrnehmungssystem, das wie vorgesehen arbeitet, aber eine abgenutzte Fahrbahnmarkierung falsch deutet [5]. Für Funktionen zur Spur- und Kursführung ist die UN-Regelung Nr. 79 die internationale Referenz für Lenkanlagen und Assistenzfunktionen [6].',
        'Bleibt die Frage, wie weit eine Technologie tatsächlich ist. Dafür gibt es die Skala der Technology Readiness Level (TRL). In der Methodik, die die Finep im Rahmen von MOVER anwendet, reicht sie von TRL 1, der Beobachtung grundlegender Prinzipien, bis TRL 9, bei dem das System im Einsatz ist und sich bewährt hat [7]. Bei der Fahrspurerkennung ist die Validierung eines Modells auf Datensätzen ein experimenteller Schritt; die Integration in eingebettete Hardware, Tests in relevanter Umgebung, die Demonstration im Fahrzeug und die Qualifizierung des Systems sind zunehmend höhere Stufen.',
        'Das TRL ist keine verpflichtende Zertifizierung für ADAS, sondern beschreibt den Reifegrad einer bestimmten Technologie. Im brasilianischen Kontext rückt diese Sichtweise die akademische Forschung näher an Entwicklung, Validierung und eine mögliche Industrialisierung heran. Und sie zeigt die Herausforderung des nächsten Kapitels: Ein Modell kann auf dem Papier hervorragend sein – und trotzdem nicht ins Auto passen.',
      ],
      figure: {
        ...BODY_FRAME,
        alt: 'Patentzeichnung des rohrförmigen Karosserierahmens eines Automobils auf dem Fahrgestell, mit Lenkrad und Vorderrad.',
        caption: 'Abb. 02 – Karosseriestruktur aus dem US-Patent 2.269.452 (gemeinfrei).',
      },
      references: [
        { text: 'Brasilien, Gesetz Nr. 14.902 vom 27. Juni 2024. Einführung des Programms für grüne Mobilität und Innovation – MOVER. Brasília, 2024.', url: LAW_URL },
        { text: 'Brasilien, Dekret Nr. 12.435 vom 15. April 2025. Durchführungsbestimmungen zum Programm MOVER. Brasília, 2025.', url: DECREE_URL },
        { text: 'Brasilien, Ministerium für Entwicklung, Industrie, Handel und Dienstleistungen. MOVER-Programm. Brasília, 2026.' },
        { text: 'International Organization for Standardization, ISO 26262:2018 – Road vehicles – Functional safety. Genf: ISO, 2018.' },
        { text: 'International Organization for Standardization, ISO 21448:2022 – Road vehicles – Safety of the intended functionality. Genf: ISO, 2022.' },
        { text: 'Wirtschaftskommission der Vereinten Nationen für Europa, UN-Regelung Nr. 79 – Einheitliche Bedingungen für die Genehmigung der Fahrzeuge hinsichtlich der Lenkanlage. UNECE, 2022.' },
        { text: 'Finep; MCTI; MDIC, Finep MOVER Empresarial – Anhang 5: Definition des technologischen Reifegrads (TRL). Brasília, 2025.' },
      ],
    },
    {
      id: 'sehen',
      tag: 'ADAS und KI',
      title: 'Schnell genug sehen',
      lede: 'Die Fahrspur zu erkennen, reicht nicht. Im Auto muss die Antwort rechtzeitig kommen, stabil sein und in die Grenzen eines eingebetteten Prozessors passen.',
      paragraphs: [
        'Zurück zur Frage aus dem ersten Kapitel: Wo verlaufen die Fahrspuren? Die Fahrspurerkennung (Lane Detection) schätzt Lage und Geometrie der Fahrbahnmarkierungen, und Funktionen wie LDWS und LKAS hängen von ihr ab. Übersichtsarbeiten beschreiben den Übergang von klassischen Bildverarbeitungsverfahren zu Deep-Learning-Architekturen, die Repräsentationen direkt aus Daten lernen [1], [2].',
        'Dieser Fortschritt schuf ein neues Dilemma. Größere Modelle sehen besser, aber ein Auto wartet nicht: Die Wahrnehmung muss in Echtzeit, robust und effizient erfolgen. Qin, Wang und Li antworteten darauf mit Ultra Fast Structure-aware Deep Lane Detection (UFLD), das die Fahrspurerkennung als zeilenbasierte Auswahl (row-based selection) formuliert, statt ausschließlich auf eine pixelweise Segmentierung zu setzen [3]. Statt jedes Pixel des Bildes zu klassifizieren, wählt das Modell in jeder vordefinierten Zeile die wahrscheinlichste Position der Fahrspur – das senkt den Rechenaufwand deutlich und erhöht die Inferenzgeschwindigkeit.',
        'Andere Ansätze gingen andere Wege. LaneATT von Tabelini et al. nutzt Aufmerksamkeitsmechanismen, um globale Bildinformationen auszuwerten und mit Verdeckungen oder unvollständigen Markierungen umzugehen, ohne die Echtzeitfähigkeit aufzugeben [4]. Neuere Arbeiten untersuchen zeitliche Modelle, die aufeinanderfolgende Bilder nutzen, wenn ein einzelnes Bild nicht genügend Informationen enthält [5].',
        'Bei der Wahl eines Algorithmus für ADAS zählt daher nicht nur die Genauigkeit. Latenz, Bilder pro Sekunde (FPS), Speicherbedarf, Rechenlast und die Stabilität der Vorhersagen wiegen ebenso schwer wie ein Benchmark-Ergebnis. Ein Modell kann eine Rangliste anführen und dennoch Ressourcen verlangen, die die verfügbare eingebettete Plattform nicht bietet. Aktuelle Arbeiten zur Fahrspurerkennung auf stromsparenden Systemen unterstreichen, wie wichtig Architekturen sind, die auf begrenzter Hardware laufen – bis hin zu reinen CPU-Plattformen [6].',
        'Genau hier setzt meine Forschung an. Im AI Residency Program arbeite ich in einer Studiengruppe, die Algorithmen zur Fahrspurerkennung für eingebettete Systeme untersucht – leichtgewichtige Architekturen wie UFLD und LaneATT, zeitliche Strategien, Modelloptimierung und Tests auf realer Hardware. Die Frage lautet dann nicht mehr nur „Lässt sich die Fahrspur erkennen?“, sondern „Lässt sie sich genau, stabil und schnell genug für ein Auto erkennen?“',
      ],
      figure: {
        src: 'lane-diagram',
        alt: 'Diagramm einer Straße in Perspektive mit horizontalen Referenzzeilen; auf jeder Zeile markiert ein Punkt die gewählte Position jeder Fahrspur.',
        caption: 'Abb. 03 – Zeilenbasierte Auswahl: In jeder Referenzzeile (Row Anchor) wählt das Modell die Zelle, die am wahrscheinlichsten die Fahrspur enthält.',
      },
      references: CHAPTER_3_REFS,
    },
    {
      id: 'patente',
      tag: 'ADAS und Patente',
      title: 'Die Uhr der Patente',
      lede: 'Eine Erfindung im Automobilbereich zu schützen kann Jahre dauern. Wie viele, hängt davon ab, wo die Anmeldung eingereicht wird — und dieser Unterschied prägt die Strategie aller, die in Brasilien Technologie entwickeln.',
      paragraphs: [
        'Ein Patent ist ein Tausch: Der Erfinder legt die Lösung offen und darf dafür anderen bis zu 20 Jahre ab der Anmeldung die Nutzung untersagen — in Brasilien nach dem Gesetz Nr. 9.279/1996 [1], in Europa nach dem Europäischen Patentübereinkommen (EPÜ) [2]. Für ADAS ist ein Detail wichtig: In beiden Rechtsordnungen ist ein Computerprogramm „als solches“ keine Erfindung [1], [2]. Geschützt werden kann die technische Lösung — etwa ein Wahrnehmungsverfahren, das die Latenz auf einem eingebetteten Prozessor senkt —, nicht der Code.',
        'Der Weg ist auf beiden Seiten des Atlantiks ähnlich. Beim brasilianischen Patentamt INPI bleibt die Anmeldung 18 Monate geheim, wird veröffentlicht, und die Prüfung muss innerhalb von 36 Monaten ab Anmeldung beantragt werden; es folgen technische Prüfung, Bescheide und Erwiderungen bis zur Entscheidung [1]. Beim Europäischen Patentamt (EPA) erhält die Anmeldung einen Recherchenbericht mit Stellungnahme, wird nach 18 Monaten veröffentlicht, und die Prüfung ist binnen sechs Monaten nach Veröffentlichung dieses Berichts zu beantragen; nach der Erteilung können Dritte neun Monate lang Einspruch einlegen [2]. Seit dem 1. Juni 2023 kann ein europäisches Patent zudem einheitliche Wirkung in den meisten EU-Staaten erhalten [5].',
        'Der Unterschied liegt in der Uhr. Laut der Weltorganisation für geistiges Eigentum (WIPO) dauerte es 2016 in Brasilien im Mittel 95,4 Monate bis zur endgültigen Entscheidung — fast acht Jahre —, beim EPA 23,3 Monate [4]. 2024 lag Brasilien bei 38,4 Monaten, weiterhin über dem EPA (24,9), dem US-Amt (29,5), China (15,5) und Japan (12,9) [3]. Ein Teil der Erklärung ist die Größe: 2024 hatte das INPI 300 Patentprüfer, das EPA 4.005 [3]. Die WIPO weist selbst darauf hin, dass die Verfahren nicht vollständig harmonisiert sind und Vergleiche zwischen Ämtern Vorsicht erfordern [3].',
        'Unterdessen hat das Feld beschleunigt. Die weltweit veröffentlichten Patentanmeldungen im Bereich Transport stiegen von 90.961 im Jahr 2013 auf 140.730 im Jahr 2023, im Mittel 4,5 % pro Jahr [3]. Deutschland, Frankreich, Schweden und Italien sind unter den 15 größten Herkunftsländern 2021–2023 am stärksten auf dieses Feld spezialisiert; Brasilien gehört nicht zu dieser Gruppe [3]. Wer in Brasilien Automobiltechnik entwickelt, lernt daraus zweierlei: Eine frühe Anmeldung im Inland sichert die Priorität, aber der Schutz in den Märkten, in denen das Auto gebaut und verkauft wird, führt meist auch über das EPA und weitere Ämter.',
        'Deshalb muss die Forschung von Anfang an an geistiges Eigentum denken. Ein Algorithmus zur Fahrspurerkennung, der in Echtzeit auf eingebetteter Hardware läuft, kann veröffentlicht, patentiert oder beides werden — aber die Reihenfolge zählt, denn eine Offenlegung vor der Anmeldung kann die Neuheit zerstören. In meiner Planung ist das ein ausdrücklicher Schritt: Forschungsergebnisse in einen Prototyp zu überführen und, wo eine neue technische Lösung entsteht, in eine Patentanmeldung.',
      ],
      figure: {
        src: 'patent-chart',
        ...PENDENCY,
        alt: 'Balkendiagramm der mittleren Dauer bis zur endgültigen Entscheidung über Patentanmeldungen 2016 und 2024: Brasilien 95,4 und 38,4 Monate; USA 22,6 und 29,5; Europa (EPA) 23,3 und 24,9; China 22,0 und 15,5; Japan 15,0 und 12,9.',
        caption: 'Abb. 04 — Mittlere Dauer bis zur endgültigen Entscheidung in Monaten, gezählt ab Prüfungsantrag (oder Anmeldung). Quelle: WIPO, WIPI 2017 und 2025 [3], [4].',
      },
      references: PATENT_REFS,
    },
  ],
};
