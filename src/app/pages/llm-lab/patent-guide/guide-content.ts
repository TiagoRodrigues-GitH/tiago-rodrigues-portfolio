import { Locale } from '../../../services/i18n.service';
import { LinkKey } from './guide-links';

/**
 * Text of the patent guide in the three page languages. Legal statements cite the article they come from
 * (Lei 9.279/1996 = LPI); fees are those of INPI's table in force when checked (see guide-links.ts).
 */

export type GuideTab = 'assistant' | 'intro' | 'eligibility' | 'search' | 'steps' | 'costs' | 'stats' | 'sources';

export interface SourceLink {
  label: string;
  link: LinkKey;
}

export interface GuideStep {
  title: string;
  goal: string;
  prepare: string;
  actions: string;
  mistakes: string;
  fee?: string;
  links: SourceLink[];
}

export interface StatsText {
  title: string;
  lede: string;
  viewLabel: string;
  views: Record<'br-nonresidents' | 'br-residents' | 'epo' | 'us' | 'cn', { label: string; indicator: string }>;
  unavailable: Record<'us' | 'cn', { text: string; links: SourceLink[] }>;
  companiesLabel: string;
  companiesHint: string;
  chartLabel: string;
  yAxis: string;
  tableCaption: string;
  colCompany: string;
  notListed: string;
  notPublished: string;
  partialYear: string;
  dataUntil: string;
  rank: string;
  method: string[];
  sourcesLabel: string;
  sourceYear: string;
  loading: string;
  loadError: string;
}

export interface GuideText {
  tabsLabel: string;
  tabs: Record<GuideTab, string>;
  checked: string;
  disclaimer: string;
  intro: {
    what: string;
    whatText: string[];
    kindsTitle: string;
    kinds: Array<{ name: string; text: string }>;
    compareTitle: string;
    compareHead: [string, string, string, string];
    compare: Array<[string, string, string, string]>;
    filedVsGrantedTitle: string;
    filedVsGranted: string;
  };
  eligibility: {
    requirementsTitle: string;
    requirements: Array<{ name: string; text: string }>;
    priorArtTitle: string;
    priorArt: string;
    graceTitle: string;
    grace: string;
    notInventionsTitle: string;
    notInventions: string[];
    notPatentableTitle: string;
    notPatentable: string[];
    softwareTitle: string;
    software: string[];
  };
  search: {
    why: string;
    whereTitle: string;
    where: Array<{ label: string; link: LinkKey; text: string }>;
    howTitle: string;
    how: string[];
  };
  steps: {
    lede: string;
    labels: { goal: string; prepare: string; actions: string; mistakes: string; fee: string; sources: string };
    items: GuideStep[];
  };
  costs: {
    lede: string;
    feesTitle: string;
    feesHead: [string, string, string, string];
    fees: Array<[string, string, string, string]>;
    feesNote: string;
    feesLink: string;
    deadlinesTitle: string;
    deadlines: string[];
    professional: string;
  };
  stats: StatsText;
  sources: {
    title: string;
    items: SourceLink[];
    faqTitle: string;
    faq: Array<{ q: string; a: string }>;
  };
}

const PT: GuideText = {
  tabsLabel: 'Seções do guia de patentes',
  tabs: {
    assistant: 'Assistente', intro: 'Introdução', eligibility: 'O que pode ser patenteado', search: 'Busca de anterioridade',
    steps: 'Passo a passo', costs: 'Custos e prazos', stats: 'Estatísticas', sources: 'Fontes e perguntas',
  },
  checked: 'Informações conferidas nas fontes oficiais em 9 de outubro de 2026.',
  disclaimer: 'Conteúdo educativo, baseado na legislação e em documentos públicos do INPI. Não é aconselhamento jurídico nem garante a concessão de uma patente: cada caso depende de análise individual, de preferência com um profissional habilitado.',
  intro: {
    what: 'O que é uma patente',
    whatText: [
      'Uma patente é um título concedido pelo Estado, no Brasil pelo INPI, que dá ao titular, por tempo limitado, o direito de impedir terceiros de produzir, usar, colocar à venda, vender ou importar a invenção sem o seu consentimento (LPI, art. 42).',
      'Em troca, o conteúdo do pedido torna-se público: o pedido fica em sigilo por 18 meses e depois é publicado (art. 30). A proteção vale só no país que concedeu a patente.',
    ],
    kindsTitle: 'Patente de invenção e modelo de utilidade',
    kinds: [
      { name: 'Patente de invenção (PI)', text: 'Para uma solução técnica nova, com atividade inventiva e aplicação industrial (art. 8). Vigora por 20 anos contados do depósito (art. 40).' },
      { name: 'Modelo de utilidade (MU)', text: 'Para um objeto de uso prático com nova forma ou disposição que traga melhoria funcional no uso ou na fabricação, com ato inventivo (art. 9). Vigora por 15 anos contados do depósito (art. 40).' },
    ],
    compareTitle: 'Patente, marca, direito autoral e registro de software',
    compareHead: ['Proteção', 'O que protege', 'Lei', 'Prazo'],
    compare: [
      ['Patente', 'Solução técnica: produto ou processo', 'Lei 9.279/1996', '20 anos (invenção) ou 15 anos (modelo de utilidade) desde o depósito'],
      ['Marca', 'Sinal que distingue produtos ou serviços', 'Lei 9.279/1996', '10 anos desde a concessão, prorrogáveis (art. 133)'],
      ['Direito autoral', 'Obras literárias, artísticas e científicas', 'Lei 9.610/1998', '70 anos após a morte do autor (art. 41); independe de registro'],
      ['Programa de computador', 'O código e sua expressão, como obra', 'Lei 9.609/1998', '50 anos; o registro no INPI é opcional (art. 2º, §§ 2º e 3º)'],
    ],
    filedVsGrantedTitle: 'Depositar não é o mesmo que ter a patente',
    filedVsGranted: 'O depósito cria um pedido, que ainda será examinado e pode ser deferido ou indeferido (art. 37). A patente só é concedida depois do deferimento e do pagamento da retribuição, com a expedição da carta-patente (art. 38). Concedida a patente, o titular pode pedir indenização também pela exploração ocorrida entre a publicação do pedido e a concessão (art. 44).',
  },
  eligibility: {
    requirementsTitle: 'Requisitos de patenteabilidade',
    requirements: [
      { name: 'Novidade', text: 'A invenção não pode estar no estado da técnica (art. 11).' },
      { name: 'Atividade inventiva', text: 'Para um técnico no assunto, a invenção não pode decorrer de maneira evidente ou óbvia do estado da técnica (art. 13). No modelo de utilidade, exige-se ato inventivo: não decorrer de maneira comum ou vulgar (art. 14).' },
      { name: 'Aplicação industrial', text: 'Poder ser utilizada ou produzida em qualquer tipo de indústria (art. 15).' },
    ],
    priorArtTitle: 'Estado da técnica',
    priorArt: 'É tudo o que se tornou acessível ao público antes da data de depósito, por descrição escrita ou oral, por uso ou por qualquer outro meio, no Brasil ou no exterior (art. 11, § 1º). Inclui artigos, apresentações, vídeos, produtos à venda e pedidos de patente de qualquer país.',
    graceTitle: 'Divulgar antes de depositar: o período de graça',
    grace: 'No Brasil, a divulgação feita pelo próprio inventor (ou a partir de informações dele) nos 12 meses anteriores ao depósito não conta como estado da técnica (art. 12). Muitos países não têm regra igual, e uma divulgação pode impedir a proteção no exterior: avalie a estratégia antes de publicar, apresentar em evento ou vender.',
    notInventionsTitle: 'O que não é considerado invenção (art. 10)',
    notInventions: [
      'descobertas, teorias científicas e métodos matemáticos;',
      'concepções puramente abstratas;',
      'esquemas, planos, princípios ou métodos comerciais, contábeis, financeiros, educativos, publicitários, de sorteio e de fiscalização;',
      'obras literárias, arquitetônicas, artísticas e científicas ou qualquer criação estética;',
      'programas de computador em si;',
      'apresentação de informações;',
      'regras de jogo;',
      'técnicas e métodos operatórios ou cirúrgicos e métodos terapêuticos ou de diagnóstico para aplicação no corpo humano ou animal;',
      'o todo ou parte de seres vivos naturais e materiais biológicos encontrados na natureza, ainda que dela isolados, e os processos biológicos naturais.',
    ],
    notPatentableTitle: 'O que não é patenteável (art. 18)',
    notPatentable: [
      'o que for contrário à moral, aos bons costumes e à segurança, à ordem e à saúde públicas;',
      'produtos e processos resultantes de transformação do núcleo atômico;',
      'o todo ou parte de seres vivos, exceto microrganismos transgênicos que atendam aos requisitos.',
    ],
    softwareTitle: 'Software e invenções implementadas por computador',
    software: [
      'Nem todo programa de computador é patenteável: a lei exclui os "programas de computador em si" (art. 10, V).',
      'Uma invenção implementada por computador pode ser patenteável quando resolve um problema técnico e produz um efeito técnico que não se resume ao modo como o código foi escrito, segundo as diretrizes de exame do INPI (Portaria INPI/PR nº 411/2020). Exemplo ilustrativo: um método de controle de um sistema embarcado que reduz o consumo de energia de um sensor pode ser analisado como invenção; um algoritmo puramente matemático ou um método de negócio, não.',
      'O código em si é protegido como direito autoral, pela Lei 9.609/1998, sem depender de registro; o registro do programa no INPI é opcional e serve como prova de autoria e data.',
    ],
  },
  search: {
    why: 'A busca de anterioridade mostra se algo igual ou muito próximo já existe. Ela evita gastar com um pedido sem chance, ajuda a definir o que é de fato novo e orienta a redação das reivindicações.',
    whereTitle: 'Onde buscar',
    where: [
      { label: 'BuscaWeb (INPI)', link: 'buscaWeb', text: 'pedidos e patentes depositados no Brasil.' },
      { label: 'Espacenet (EPO)', link: 'espacenet', text: 'mais de 150 milhões de documentos de patente de muitos países.' },
      { label: 'PATENTSCOPE (OMPI)', link: 'patentscope', text: 'pedidos internacionais (PCT) e coleções nacionais.' },
      { label: 'Patent Public Search (USPTO)', link: 'usptoSearch', text: 'patentes e pedidos publicados nos Estados Unidos.' },
    ],
    howTitle: 'Como fazer',
    how: [
      'Descreva a invenção em poucas frases e liste palavras-chave e sinônimos, também em inglês.',
      'Use a Classificação Internacional de Patentes (IPC) ou a CPC: procure os códigos dos documentos mais próximos e repita a busca por eles.',
      'Leia as reivindicações dos documentos encontrados: são elas que definem o que cada patente protege.',
      'Inclua literatura não patentária (artigos, normas técnicas, catálogos) e anote onde, quando e com quais termos buscou.',
      'A busca não substitui o exame do INPI, que fará a sua própria.',
    ],
  },
  steps: {
    lede: 'Sequência geral de um pedido de patente de invenção no INPI. Os prazos citados são os da lei; os valores, os da tabela de retribuições em vigor quando conferida.',
    labels: { goal: 'Objetivo', prepare: 'O que preparar', actions: 'Ações', mistakes: 'Erros comuns', fee: 'Retribuição ao INPI', sources: 'Fontes oficiais' },
    items: [
      { title: 'Identificar e descrever a invenção', goal: 'Saber exatamente qual problema técnico a invenção resolve e como.', prepare: 'Problema, solução, vantagens, variações possíveis, desenhos ou fotos, resultados de testes.', actions: 'Escreva uma descrição técnica e guarde registros datados do desenvolvimento.', mistakes: 'Descrever só a ideia ou o resultado desejado, sem explicar como se chega a ele.', links: [{ label: 'Guia básico de patentes (INPI)', link: 'basicGuide' }] },
      { title: 'Avaliar os requisitos de patenteabilidade', goal: 'Verificar se há novidade, atividade inventiva e aplicação industrial, e se o objeto não está entre as exclusões.', prepare: 'A descrição da etapa anterior e os artigos 8 a 18 da LPI.', actions: 'Compare a invenção com o que você já conhece da área e identifique o que é diferente.', mistakes: 'Confundir novidade comercial (ninguém vende) com novidade técnica (ninguém divulgou).', links: [{ label: 'Lei 9.279/1996, arts. 8 a 18', link: 'lpi' }] },
      { title: 'Fazer a busca de anterioridade', goal: 'Encontrar documentos próximos antes de investir no pedido.', prepare: 'Palavras-chave, sinônimos e códigos de classificação.', actions: 'Busque no BuscaWeb, no Espacenet e no PATENTSCOPE; registre as buscas.', mistakes: 'Buscar só em português ou só em uma base.', links: [{ label: 'BuscaWeb (INPI)', link: 'buscaWeb' }, { label: 'Espacenet', link: 'espacenet' }, { label: 'PATENTSCOPE', link: 'patentscope' }] },
      { title: 'Definir a estratégia de proteção', goal: 'Escolher entre patente de invenção, modelo de utilidade, segredo industrial ou registro de software, e em quais países proteger.', prepare: 'Mercados de interesse, orçamento, prazo de vida do produto.', actions: 'Considere o direito de prioridade (12 meses para patentes pela Convenção da União de Paris) e a via internacional do PCT para outros países.', mistakes: 'Divulgar ou vender antes de decidir, perdendo a novidade em países sem período de graça.', links: [{ label: 'Convenção da União de Paris (OMPI)', link: 'paris' }, { label: 'Tratado de Cooperação em Patentes (PCT)', link: 'pct' }] },
      { title: 'Preparar a documentação técnica', goal: 'Reunir o material que sustenta a descrição.', prepare: 'Desenhos técnicos, dados de ensaios, exemplos de realização, listagem de sequências quando houver material biológico.', actions: 'Organize o material na ordem em que a invenção será explicada.', mistakes: 'Deixar de fora variações importantes: depois do depósito, não se pode acrescentar matéria nova (art. 32).', links: [{ label: 'Manual básico para o depositante (INPI)', link: 'basicManual' }] },
      { title: 'Redigir relatório descritivo, reivindicações, resumo e desenhos', goal: 'Montar o pedido com as partes exigidas pela lei (art. 19).', prepare: 'Relatório descritivo suficiente para um técnico reproduzir a invenção; reivindicações que definem a proteção; resumo; desenhos, se for o caso.', actions: 'Escreva reivindicações claras, apoiadas no relatório, da mais ampla às mais específicas.', mistakes: 'Reivindicações amplas demais (sem novidade) ou estreitas demais (fáceis de contornar).', links: [{ label: 'Lei 9.279/1996, art. 19', link: 'lpi' }, { label: 'Manual básico para o depositante (INPI)', link: 'basicManual' }] },
      { title: 'Acessar os sistemas do INPI', goal: 'Ter acesso ao peticionamento eletrônico.', prepare: 'Conta gov.br ou login do INPI e cadastro no e-INPI.', actions: 'Acesse o Módulo de Serviços de Patentes.', mistakes: 'Cadastrar dados do depositante diferentes dos que constarão no pedido.', links: [{ label: 'Módulo de Serviços de Patentes', link: 'servicesModule' }, { label: 'Guia básico de patentes (INPI)', link: 'basicGuide' }] },
      { title: 'Depositar o pedido e pagar a retribuição', goal: 'Obter a data de depósito, que fixa o estado da técnica considerado.', prepare: 'A Guia de Recolhimento da União (GRU) do código 200 e os arquivos do pedido.', actions: 'Emita e pague a GRU, preencha o formulário de depósito e anexe os documentos.', mistakes: 'Pagar um código de serviço errado ou deixar de informar o número da GRU.', fee: 'Código 200: R$ 260,00 (R$ 130,00 com desconto).', links: [{ label: 'Emissão de GRU (INPI)', link: 'gru' }, { label: 'Tabela de retribuições de patentes', link: 'patentFees' }] },
      { title: 'Acompanhar publicações e prazos', goal: 'Não perder exigências nem prazos: os atos do INPI são comunicados pela Revista da Propriedade Industrial (RPI).', prepare: 'O número do pedido.', actions: 'Consulte a RPI semanalmente e o andamento no BuscaWeb. O pedido é publicado após 18 meses de sigilo (art. 30); as anuidades começam no 3º ano contado do depósito (art. 84).', mistakes: 'Esperar notificação individual: a publicação na RPI já conta como intimação.', fee: 'Anuidade do pedido, código 220: R$ 400,00 (R$ 200,00 com desconto).', links: [{ label: 'Revista da Propriedade Industrial', link: 'rpi' }, { label: 'BuscaWeb (INPI)', link: 'buscaWeb' }] },
      { title: 'Requerer o exame', goal: 'Iniciar o exame técnico do pedido.', prepare: 'O pagamento da retribuição de exame.', actions: 'Requeira o exame em até 36 meses do depósito, sob pena de arquivamento (art. 33).', mistakes: 'Perder o prazo de 36 meses.', fee: 'Código 203, até 10 reivindicações: R$ 870,00 (R$ 435,00 com desconto); há valor adicional por reivindicação acima de 10.', links: [{ label: 'Lei 9.279/1996, art. 33', link: 'lpi' }, { label: 'Tabela de retribuições de patentes', link: 'patentFees' }] },
      { title: 'Responder às exigências', goal: 'Atender ou contestar as exigências e os pareceres do exame.', prepare: 'Argumentos técnicos e, se for o caso, reivindicações ajustadas dentro do que foi revelado.', actions: 'Responda em até 90 dias da publicação (art. 36); sem resposta, o pedido é arquivado definitivamente.', mistakes: 'Acrescentar matéria nova ou deixar o prazo passar.', fee: 'Cumprimento de exigência, código 207: R$ 130,00 (R$ 65,00 com desconto).', links: [{ label: 'Lei 9.279/1996, art. 36', link: 'lpi' }] },
      { title: 'Decisão e concessão', goal: 'Receber a decisão: deferimento ou indeferimento (art. 37).', prepare: 'Acompanhamento da RPI.', actions: 'Deferido o pedido, pague a retribuição da carta-patente em 60 dias (art. 38). Indeferido, cabe recurso em 60 dias (art. 212).', mistakes: 'Perder o prazo de pagamento após o deferimento.', fee: 'Carta-patente no prazo ordinário, código 212: R$ 0,00. Recurso, código 214: R$ 1.580,00 (R$ 790,00 com desconto).', links: [{ label: 'Fluxo processual de patentes (INPI)', link: 'processFlow' }] },
      { title: 'Manter os direitos', goal: 'Manter a patente em vigor até o fim do prazo.', prepare: 'Calendário de anuidades.', actions: 'Pague as anuidades nos 3 primeiros meses de cada ano, ou nos 6 meses seguintes com acréscimo (art. 84). Sem pagamento, a patente é extinta (art. 86); a restauração pode ser pedida em 3 meses (art. 87).', mistakes: 'Esquecer uma anuidade.', fee: 'Anuidades de patente concedida: R$ 1.000,00 (3º ao 6º ano) a R$ 2.800,00 (16º ano em diante), metade com desconto.', links: [{ label: 'Lei 9.279/1996, arts. 84 a 87', link: 'lpi' }, { label: 'Tabela de retribuições de patentes', link: 'patentFees' }] },
    ],
  },
  costs: {
    lede: 'Retribuições do INPI para patente de invenção (Portaria GM/MDIC nº 110/2025 e Portaria INPI/PR nº 10/2025, tabela de 20 de dezembro de 2025). Confira a tabela vigente antes de pagar.',
    feesTitle: 'Principais retribuições',
    feesHead: ['Código', 'Serviço', 'Valor', 'Com desconto'],
    fees: [
      ['200', 'Depósito de pedido (meio eletrônico)', 'R$ 260,00', 'R$ 130,00'],
      ['203', 'Pedido de exame de invenção (até 10 reivindicações)', 'R$ 870,00', 'R$ 435,00'],
      ['207', 'Cumprimento de exigência', 'R$ 130,00', 'R$ 65,00'],
      ['220', 'Anuidade de pedido de invenção (prazo ordinário)', 'R$ 400,00', 'R$ 200,00'],
      ['222', 'Anuidade de patente, 3º ao 6º ano', 'R$ 1.000,00', 'R$ 500,00'],
      ['224', 'Anuidade de patente, 7º ao 10º ano', 'R$ 1.600,00', 'R$ 800,00'],
      ['226', 'Anuidade de patente, 11º ao 15º ano', 'R$ 2.200,00', 'R$ 1.100,00'],
      ['228', 'Anuidade de patente, 16º ano em diante', 'R$ 2.800,00', 'R$ 1.400,00'],
      ['212', 'Expedição de carta-patente (prazo ordinário)', 'R$ 0,00', 'R$ 0,00'],
      ['214', 'Recurso', 'R$ 1.580,00', 'R$ 790,00'],
    ],
    feesNote: 'O desconto de 50% vale, entre outros, para pessoas naturais, microempresas, microempreendedores individuais e empresas de pequeno porte, nas condições da tabela; pessoas físicas hipossuficientes e pessoas com deficiência têm desconto de 100% em alguns serviços.',
    feesLink: 'Tabela de retribuições de patentes (INPI)',
    deadlinesTitle: 'Prazos da lei',
    deadlines: [
      'Período de graça: divulgações do inventor nos 12 meses antes do depósito (art. 12).',
      'Sigilo: 18 meses desde o depósito ou a prioridade; depois, publicação (art. 30).',
      'Pedido de exame: até 36 meses do depósito (art. 33).',
      'Resposta a exigência: 90 dias (art. 36). Recurso: 60 dias (art. 212).',
      'Anuidades: a partir do 3º ano do depósito (art. 84).',
      'Vigência: 20 anos (invenção) ou 15 anos (modelo de utilidade) desde o depósito (art. 40). O prazo mínimo contado da concessão foi revogado pela Lei 14.195/2021, após a ADI 5529 no STF.',
    ],
    professional: 'Além das retribuições, pode haver custos profissionais (agente da propriedade industrial ou advogado) para busca, redação e acompanhamento. Eles não são tabelados. A lei permite que a própria parte pratique os atos ou nomeie procurador (art. 216).',
  },
  stats: {
    title: 'Empresas com mais pedidos de patente',
    lede: 'Dez empresas com mais pedidos em cada escritório, 2020 a 2026, segundo as listas oficiais. Os indicadores diferem entre escritórios e não devem ser somados nem comparados diretamente.',
    viewLabel: 'Escritório e indicador',
    views: {
      'br-nonresidents': { label: 'Brasil · empresas estrangeiras', indicator: 'Depósitos de pedidos de patente de invenção no INPI por depositantes não residentes, por ano de depósito.' },
      'br-residents': { label: 'Brasil · empresas residentes', indicator: 'Depósitos de pedidos de patente de invenção no INPI por depositantes residentes, por ano de depósito. Só empresas: universidades, institutos, fundações e pessoas físicas ficam de fora.' },
      epo: { label: 'Europa · EPO', indicator: 'Pedidos de patente europeia no Instituto Europeu de Patentes (EPO): depósitos diretos e pedidos PCT que entraram na fase europeia, contados pelo primeiro requerente, com grupos consolidados pelo EPO. O EPO atende 39 países, não só a União Europeia.' },
      us: { label: 'Estados Unidos · USPTO', indicator: 'Patentes de utilidade concedidas pelo USPTO, por ano de concessão, contadas pelo primeiro titular (assignee) que é empresa, com nomes desambiguados pelo PatentsView. São concessões, não pedidos: não compare com INPI ou EPO.' },
      cn: { label: 'China · CNIPA', indicator: '' },
    },
    unavailable: {
      us: { text: 'O USPTO não publica ranking oficial de empresas para 2020 a 2026 (o relatório “Patenting by Organizations” mais recente que localizamos cobre até 2005). O indicador é calculado a partir dos dados abertos do USPTO (PatentsView, concessões até 31/12/2025), cujo download exige uma chave de API gratuita do USPTO; esta versão do site ainda não inclui esses dados.', links: [{ label: 'USPTO: conjuntos de dados para pesquisa', link: 'usptoDatasets' }, { label: 'PatentsView (dados do USPTO)', link: 'patentsView' }] },
      cn: { text: 'Não encontramos ranking de requerentes publicado pela CNIPA em fonte oficial verificável para 2020 a 2026; por isso não há gráfico.', links: [{ label: 'CNIPA', link: 'cnipa' }] },
    },
    companiesLabel: 'Empresas no gráfico',
    companiesHint: 'Escolha até 8. As cores acompanham a empresa.',
    chartLabel: 'Pedidos de patente por ano',
    yAxis: 'Pedidos',
    tableCaption: 'Valores por empresa e ano',
    colCompany: 'Empresa',
    notListed: 'fora da lista publicada (no máximo {n})',
    notPublished: 'sem dados publicados',
    partialYear: '2026: ano em curso; os escritórios publicam o ranking no ano seguinte.',
    dataUntil: 'Dados até {date}.',
    rank: 'posição',
    method: [
      'Fontes: rankings anuais do INPI (os 50 maiores depositantes de cada ano; os empates no fim da lista são todos listados) e Patent Index/Technology Dashboard do EPO (50 maiores requerentes).',
      'As dez empresas são as de maior soma de pedidos nas listas publicadas de 2020 a 2025.',
      'Quando a empresa não aparece na lista de um ano, o valor não é zero: ela teve no máximo o número do último colocado daquele ano.',
      'Nomes como publicados; unificamos só grafias do mesmo nome e mudanças de razão social documentadas (Raytheon Technologies → RTX; FCA Fiat Chrysler Automóveis Brasil → Stellantis Automóveis Brasil, mesmo CNPJ; Ericsson). Subsidiárias distintas continuam separadas, como Dow Chemical e Dow Global Technologies: o INPI listou grupos em 2020 e 2021 e entidades jurídicas a partir de 2022.',
      'O INPI agrupou residentes pela raiz do CNPJ até 2023 e pelo CNPJ ou nome a partir de 2024.',
    ],
    sourcesLabel: 'Fonte de cada ano',
    sourceYear: 'arquivo de {year}',
    loading: 'Carregando os dados…',
    loadError: 'Não foi possível carregar os dados do gráfico.',
  },
  sources: {
    title: 'Fontes oficiais',
    items: [
      { label: 'Lei 9.279/1996 (Lei da Propriedade Industrial)', link: 'lpi' },
      { label: 'Lei 9.609/1998 (programas de computador)', link: 'softwareLaw' },
      { label: 'Lei 9.610/1998 (direitos autorais)', link: 'copyrightLaw' },
      { label: 'INPI: diretrizes de exame de invenções implementadas por programa de computador (Portaria INPI/PR nº 411/2020)', link: 'ciiGuidelines' },
      { label: 'INPI: guia básico de patentes', link: 'basicGuide' },
      { label: 'INPI: manual básico para o depositante', link: 'basicManual' },
      { label: 'INPI: fluxo processual de patentes', link: 'processFlow' },
      { label: 'INPI: tabelas de retribuição', link: 'feeTables' },
      { label: 'INPI: rankings de depositantes', link: 'inpiRankings' },
      { label: 'EPO: estatísticas', link: 'epoStatistics' },
      { label: 'OMPI: Convenção da União de Paris', link: 'paris' },
      { label: 'OMPI: PCT', link: 'pct' },
    ],
    faqTitle: 'Perguntas frequentes',
    faq: [
      { q: 'Posso patentear um aplicativo?', a: 'O programa em si, não (art. 10, V); o código é protegido por direito autoral. Uma invenção implementada por computador que resolve um problema técnico com efeito técnico pode ser examinada como invenção (Portaria INPI/PR nº 411/2020).' },
      { q: 'Já mostrei a invenção em um evento. Ainda posso pedir?', a: 'No Brasil, divulgações do próprio inventor nos 12 meses anteriores ao depósito não contam como estado da técnica (art. 12). Em outros países a regra pode ser diferente.' },
      { q: 'A patente brasileira vale no exterior?', a: 'Não. A proteção é territorial; para outros países, use a prioridade de 12 meses da Convenção de Paris ou a via PCT.' },
      { q: 'Preciso de advogado ou agente?', a: 'A lei permite que a própria parte pratique os atos (art. 216). Um profissional habilitado ajuda na busca e na redação das reivindicações, que definem o alcance da proteção.' },
      { q: 'Por quanto tempo vale a patente?', a: '20 anos (invenção) ou 15 anos (modelo de utilidade) desde o depósito, desde que as anuidades sejam pagas (arts. 40, 84 e 86).' },
    ],
  },
};

const EN: GuideText = {
  tabsLabel: 'Sections of the patent guide',
  tabs: {
    assistant: 'Assistant', intro: 'Introduction', eligibility: 'What can be patented', search: 'Prior-art search',
    steps: 'Step by step', costs: 'Costs and deadlines', stats: 'Statistics', sources: 'Sources and FAQ',
  },
  checked: 'Information checked against the official sources on 9 October 2026.',
  disclaimer: 'Educational content based on Brazilian law and INPI’s public documents. It is neither legal advice nor a guarantee that a patent will be granted: every case needs an individual assessment, preferably by a qualified professional.',
  intro: {
    what: 'What a patent is',
    whatText: [
      'A patent is a title granted by the State, in Brazil by INPI, that gives its owner, for a limited time, the right to prevent others from making, using, offering for sale, selling or importing the invention without consent (Industrial Property Law, LPI, art. 42).',
      'In return, the application is made public: it is kept secret for 18 months and then published (art. 30). Protection applies only in the country that granted the patent.',
    ],
    kindsTitle: 'Invention patent and utility model',
    kinds: [
      { name: 'Invention patent (PI)', text: 'For a new technical solution with an inventive step and industrial applicability (art. 8). It lasts 20 years from filing (art. 40).' },
      { name: 'Utility model (MU)', text: 'For a practical object with a new shape or arrangement that improves its use or manufacture, involving an inventive act (art. 9). It lasts 15 years from filing (art. 40).' },
    ],
    compareTitle: 'Patent, trademark, copyright and software registration',
    compareHead: ['Right', 'What it protects', 'Law', 'Term'],
    compare: [
      ['Patent', 'A technical solution: a product or a process', 'Law 9,279/1996', '20 years (invention) or 15 years (utility model) from filing'],
      ['Trademark', 'A sign that distinguishes goods or services', 'Law 9,279/1996', '10 years from registration, renewable (art. 133)'],
      ['Copyright', 'Literary, artistic and scientific works', 'Law 9,610/1998', '70 years after the author’s death (art. 41); no registration needed'],
      ['Computer program', 'The code and its expression, as a work', 'Law 9,609/1998', '50 years; registration with INPI is optional (art. 2, §§ 2 and 3)'],
    ],
    filedVsGrantedTitle: 'Filing is not the same as holding a patent',
    filedVsGranted: 'Filing creates an application, which is then examined and may be allowed or refused (art. 37). The patent is granted only after allowance and payment of the fee, when the letters patent are issued (art. 38). Once granted, the owner may also claim compensation for exploitation between publication of the application and grant (art. 44).',
  },
  eligibility: {
    requirementsTitle: 'Patentability requirements',
    requirements: [
      { name: 'Novelty', text: 'The invention must not be part of the prior art (art. 11).' },
      { name: 'Inventive step', text: 'To a person skilled in the art, it must not follow obviously from the prior art (art. 13). A utility model needs an inventive act: it must not follow in a common or ordinary way (art. 14).' },
      { name: 'Industrial applicability', text: 'It must be capable of being used or produced in any kind of industry (art. 15).' },
    ],
    priorArtTitle: 'Prior art',
    priorArt: 'Everything made available to the public before the filing date, by written or oral description, by use or by any other means, in Brazil or abroad (art. 11, § 1). This includes papers, talks, videos, products on sale and patent applications from any country.',
    graceTitle: 'Disclosing before filing: the grace period',
    grace: 'In Brazil, a disclosure by the inventor (or based on the inventor’s information) in the 12 months before filing does not count as prior art (art. 12). Many countries have no such rule, so a disclosure can rule out protection abroad: decide on the strategy before publishing, presenting at an event or selling.',
    notInventionsTitle: 'What is not considered an invention (art. 10)',
    notInventions: [
      'discoveries, scientific theories and mathematical methods;',
      'purely abstract concepts;',
      'schemes, plans, principles or methods for business, accounting, finance, education, advertising, lotteries and inspection;',
      'literary, architectural, artistic and scientific works or any aesthetic creation;',
      'computer programs as such;',
      'presentation of information;',
      'rules of games;',
      'operative or surgical techniques and methods, and therapeutic or diagnostic methods, for use on the human or animal body;',
      'natural living beings in whole or in part and biological materials found in nature, even if isolated from it, and natural biological processes.',
    ],
    notPatentableTitle: 'What cannot be patented (art. 18)',
    notPatentable: [
      'anything contrary to morals, good customs, public security, order or health;',
      'products and processes resulting from the transformation of the atomic nucleus;',
      'living beings in whole or in part, except transgenic microorganisms that meet the requirements.',
    ],
    softwareTitle: 'Software and computer-implemented inventions',
    software: [
      'Not every computer program is patentable: the law excludes “computer programs as such” (art. 10, V).',
      'A computer-implemented invention may be patentable when it solves a technical problem and achieves a technical effect that goes beyond the way the code is written, according to INPI’s examination guidelines (INPI/PR Ordinance 411/2020). Illustrative example: a control method for an embedded system that reduces a sensor’s energy use can be examined as an invention; a purely mathematical algorithm or a business method cannot.',
      'The code itself is protected by copyright under Law 9,609/1998, with no need to register it; registering the program with INPI is optional and serves as evidence of authorship and date.',
    ],
  },
  search: {
    why: 'A prior-art search shows whether something identical or very close already exists. It avoids spending on an application with no chance, helps pin down what is really new and guides the drafting of the claims.',
    whereTitle: 'Where to search',
    where: [
      { label: 'BuscaWeb (INPI)', link: 'buscaWeb', text: 'applications and patents filed in Brazil.' },
      { label: 'Espacenet (EPO)', link: 'espacenet', text: 'more than 150 million patent documents from many countries.' },
      { label: 'PATENTSCOPE (WIPO)', link: 'patentscope', text: 'international (PCT) applications and national collections.' },
      { label: 'Patent Public Search (USPTO)', link: 'usptoSearch', text: 'patents and published applications in the United States.' },
    ],
    howTitle: 'How to do it',
    how: [
      'Describe the invention in a few sentences and list keywords and synonyms, in Portuguese and in English.',
      'Use the International Patent Classification (IPC) or the CPC: look up the codes of the closest documents and search by them again.',
      'Read the claims of the documents you find: they define what each patent protects.',
      'Include non-patent literature (papers, technical standards, catalogues) and record where, when and with which terms you searched.',
      'Your search does not replace INPI’s examination, which runs its own.',
    ],
  },
  steps: {
    lede: 'The general sequence of an invention patent application at INPI. Deadlines are those of the law; fees are those of the fee table in force when checked.',
    labels: { goal: 'Goal', prepare: 'What to prepare', actions: 'Actions', mistakes: 'Common mistakes', fee: 'INPI fee', sources: 'Official sources' },
    items: [
      { title: 'Identify and describe the invention', goal: 'Know exactly which technical problem the invention solves, and how.', prepare: 'Problem, solution, advantages, possible variants, drawings or photos, test results.', actions: 'Write a technical description and keep dated records of the development.', mistakes: 'Describing only the idea or the desired result without explaining how to achieve it.', links: [{ label: 'Basic patent guide (INPI)', link: 'basicGuide' }] },
      { title: 'Assess patentability', goal: 'Check novelty, inventive step and industrial applicability, and that the subject matter is not excluded.', prepare: 'The description from the previous step and articles 8 to 18 of the LPI.', actions: 'Compare the invention with what you already know of the field and identify what is different.', mistakes: 'Confusing commercial novelty (nobody sells it) with technical novelty (nobody has disclosed it).', links: [{ label: 'Law 9,279/1996, arts. 8 to 18', link: 'lpi' }] },
      { title: 'Search the prior art', goal: 'Find close documents before investing in an application.', prepare: 'Keywords, synonyms and classification codes.', actions: 'Search BuscaWeb, Espacenet and PATENTSCOPE; record your searches.', mistakes: 'Searching only in Portuguese or only one database.', links: [{ label: 'BuscaWeb (INPI)', link: 'buscaWeb' }, { label: 'Espacenet', link: 'espacenet' }, { label: 'PATENTSCOPE', link: 'patentscope' }] },
      { title: 'Choose a protection strategy', goal: 'Choose between an invention patent, a utility model, a trade secret or software registration, and the countries to cover.', prepare: 'Target markets, budget, product lifetime.', actions: 'Consider the priority right (12 months for patents under the Paris Convention) and the international PCT route for other countries.', mistakes: 'Disclosing or selling before deciding, losing novelty in countries without a grace period.', links: [{ label: 'Paris Convention (WIPO)', link: 'paris' }, { label: 'Patent Cooperation Treaty (PCT)', link: 'pct' }] },
      { title: 'Prepare the technical documents', goal: 'Gather the material that supports the description.', prepare: 'Technical drawings, test data, embodiments, sequence listings when biological material is involved.', actions: 'Arrange the material in the order the invention will be explained.', mistakes: 'Leaving out important variants: no new matter can be added after filing (art. 32).', links: [{ label: 'Basic manual for applicants (INPI)', link: 'basicManual' }] },
      { title: 'Draft the description, claims, abstract and drawings', goal: 'Assemble the application with the parts the law requires (art. 19).', prepare: 'A description sufficient for a skilled person to carry out the invention; claims that define the protection; an abstract; drawings where needed.', actions: 'Write clear claims, supported by the description, from the broadest to the most specific.', mistakes: 'Claims too broad (not new) or too narrow (easy to design around).', links: [{ label: 'Law 9,279/1996, art. 19', link: 'lpi' }, { label: 'Basic manual for applicants (INPI)', link: 'basicManual' }] },
      { title: 'Access INPI’s systems', goal: 'Get access to electronic filing.', prepare: 'A gov.br account or INPI login, and registration in e-INPI.', actions: 'Open the Patent Services Module.', mistakes: 'Registering applicant details that differ from those in the application.', links: [{ label: 'Patent Services Module', link: 'servicesModule' }, { label: 'Basic patent guide (INPI)', link: 'basicGuide' }] },
      { title: 'File the application and pay the fee', goal: 'Obtain the filing date, which fixes the prior art taken into account.', prepare: 'The federal payment slip (GRU) for code 200 and the application files.', actions: 'Issue and pay the GRU, fill in the filing form and attach the documents.', mistakes: 'Paying the wrong service code or omitting the GRU number.', fee: 'Code 200: R$ 260.00 (R$ 130.00 with the discount).', links: [{ label: 'GRU payment slip (INPI)', link: 'gru' }, { label: 'Patent fee table', link: 'patentFees' }] },
      { title: 'Follow publications and deadlines', goal: 'Miss no office action or deadline: INPI’s acts are notified in the Industrial Property Gazette (RPI).', prepare: 'The application number.', actions: 'Check the weekly RPI and the status in BuscaWeb. The application is published after 18 months of secrecy (art. 30); annuities start in the 3rd year from filing (art. 84).', mistakes: 'Waiting for an individual notice: publication in the RPI already counts as notification.', fee: 'Application annuity, code 220: R$ 400.00 (R$ 200.00 with the discount).', links: [{ label: 'Industrial Property Gazette (RPI)', link: 'rpi' }, { label: 'BuscaWeb (INPI)', link: 'buscaWeb' }] },
      { title: 'Request examination', goal: 'Start the technical examination.', prepare: 'Payment of the examination fee.', actions: 'Request examination within 36 months of filing, or the application is shelved (art. 33).', mistakes: 'Missing the 36-month deadline.', fee: 'Code 203, up to 10 claims: R$ 870.00 (R$ 435.00 with the discount); each claim beyond 10 costs extra.', links: [{ label: 'Law 9,279/1996, art. 33', link: 'lpi' }, { label: 'Patent fee table', link: 'patentFees' }] },
      { title: 'Answer office actions', goal: 'Comply with or contest the examiner’s requirements and opinions.', prepare: 'Technical arguments and, if needed, amended claims within what was disclosed.', actions: 'Answer within 90 days of publication (art. 36); without an answer, the application is shelved for good.', mistakes: 'Adding new matter or letting the deadline pass.', fee: 'Compliance with a requirement, code 207: R$ 130.00 (R$ 65.00 with the discount).', links: [{ label: 'Law 9,279/1996, art. 36', link: 'lpi' }] },
      { title: 'Decision and grant', goal: 'Receive the decision: allowance or refusal (art. 37).', prepare: 'Keep following the RPI.', actions: 'If allowed, pay the letters-patent fee within 60 days (art. 38). If refused, an appeal may be filed within 60 days (art. 212).', mistakes: 'Missing the payment deadline after allowance.', fee: 'Letters patent within the ordinary term, code 212: R$ 0.00. Appeal, code 214: R$ 1,580.00 (R$ 790.00 with the discount).', links: [{ label: 'Patent procedure flowchart (INPI)', link: 'processFlow' }] },
      { title: 'Maintain the rights', goal: 'Keep the patent in force until the end of its term.', prepare: 'A calendar of annuities.', actions: 'Pay each annuity in the first 3 months of the year, or in the following 6 months with a surcharge (art. 84). Without payment the patent lapses (art. 86); restoration may be requested within 3 months (art. 87).', mistakes: 'Forgetting an annuity.', fee: 'Annuities of a granted patent: R$ 1,000.00 (years 3 to 6) to R$ 2,800.00 (year 16 onwards), half with the discount.', links: [{ label: 'Law 9,279/1996, arts. 84 to 87', link: 'lpi' }, { label: 'Patent fee table', link: 'patentFees' }] },
    ],
  },
  costs: {
    lede: 'INPI fees for invention patents (MDIC Ordinance 110/2025 and INPI/PR Ordinance 10/2025, table of 20 December 2025). Check the table in force before paying.',
    feesTitle: 'Main fees',
    feesHead: ['Code', 'Service', 'Fee', 'With discount'],
    fees: [
      ['200', 'Filing an application (electronic)', 'R$ 260.00', 'R$ 130.00'],
      ['203', 'Request for examination of an invention (up to 10 claims)', 'R$ 870.00', 'R$ 435.00'],
      ['207', 'Compliance with a requirement', 'R$ 130.00', 'R$ 65.00'],
      ['220', 'Annuity of an invention application (ordinary term)', 'R$ 400.00', 'R$ 200.00'],
      ['222', 'Patent annuity, years 3 to 6', 'R$ 1,000.00', 'R$ 500.00'],
      ['224', 'Patent annuity, years 7 to 10', 'R$ 1,600.00', 'R$ 800.00'],
      ['226', 'Patent annuity, years 11 to 15', 'R$ 2,200.00', 'R$ 1,100.00'],
      ['228', 'Patent annuity, year 16 onwards', 'R$ 2,800.00', 'R$ 1,400.00'],
      ['212', 'Issue of letters patent (ordinary term)', 'R$ 0.00', 'R$ 0.00'],
      ['214', 'Appeal', 'R$ 1,580.00', 'R$ 790.00'],
    ],
    feesNote: 'The 50% discount applies, among others, to natural persons, micro-enterprises, individual micro-entrepreneurs and small businesses, under the conditions of the table; low-income individuals and persons with disabilities get a 100% discount on some services.',
    feesLink: 'Patent fee table (INPI)',
    deadlinesTitle: 'Statutory deadlines',
    deadlines: [
      'Grace period: disclosures by the inventor in the 12 months before filing (art. 12).',
      'Secrecy: 18 months from filing or priority; then publication (art. 30).',
      'Request for examination: within 36 months of filing (art. 33).',
      'Answer to an office action: 90 days (art. 36). Appeal: 60 days (art. 212).',
      'Annuities: from the 3rd year after filing (art. 84).',
      'Term: 20 years (invention) or 15 years (utility model) from filing (art. 40). The minimum term counted from grant was repealed by Law 14,195/2021, following the Supreme Court’s ruling in ADI 5529.',
    ],
    professional: 'Besides the fees there may be professional costs (a patent agent or lawyer) for searching, drafting and prosecution. These are not regulated. The law allows applicants to act on their own or through a representative (art. 216).',
  },
  stats: {
    title: 'Companies with the most patent applications',
    lede: 'The ten companies with the most applications at each office, 2020 to 2026, according to the official lists. The indicators differ between offices and must not be added up or compared directly.',
    viewLabel: 'Office and indicator',
    views: {
      'br-nonresidents': { label: 'Brazil · foreign companies', indicator: 'Invention patent applications filed at INPI by non-resident applicants, by filing year.' },
      'br-residents': { label: 'Brazil · resident companies', indicator: 'Invention patent applications filed at INPI by resident applicants, by filing year. Companies only: universities, institutes, foundations and individuals are left out.' },
      epo: { label: 'Europe · EPO', indicator: 'European patent applications at the European Patent Office (EPO): direct filings and PCT applications that entered the European phase, counted by first-named applicant, with groups consolidated by the EPO. The EPO serves 39 countries, not only the European Union.' },
      us: { label: 'United States · USPTO', indicator: 'Utility patents granted by the USPTO, by grant year, counted by the first assignee that is a company, with names disambiguated by PatentsView. These are grants, not applications: do not compare them with INPI or the EPO.' },
      cn: { label: 'China · CNIPA', indicator: '' },
    },
    unavailable: {
      us: { text: 'The USPTO publishes no official company ranking for 2020 to 2026 (the latest “Patenting by Organizations” report we could locate covers up to 2005). The indicator is computed from the USPTO’s open data (PatentsView, grants up to 31 December 2025), whose download needs a free USPTO API key; this version of the site does not include those data yet.', links: [{ label: 'USPTO: research datasets', link: 'usptoDatasets' }, { label: 'PatentsView (USPTO data)', link: 'patentsView' }] },
      cn: { text: 'We found no applicant ranking published by CNIPA in a verifiable official source for 2020 to 2026, so there is no chart.', links: [{ label: 'CNIPA', link: 'cnipa' }] },
    },
    companiesLabel: 'Companies in the chart',
    companiesHint: 'Choose up to 8. Each company keeps its colour.',
    chartLabel: 'Patent applications per year',
    yAxis: 'Applications',
    tableCaption: 'Values by company and year',
    colCompany: 'Company',
    notListed: 'not in the published list (at most {n})',
    notPublished: 'no data published',
    partialYear: '2026: current year; the offices publish the ranking in the following year.',
    dataUntil: 'Data up to {date}.',
    rank: 'rank',
    method: [
      'Sources: INPI’s annual rankings (the 50 largest applicants of each year; ties at the end of the list are all included) and the EPO Patent Index/Technology Dashboard (top 50 applicants).',
      'The ten companies are those with the largest sum of applications in the published lists of 2020 to 2025.',
      'When a company is missing from a year’s list, its value is not zero: it had at most as many as the last entry of that year.',
      'Names as published; only spellings of the same name and documented renames are merged (Raytheon Technologies → RTX; FCA Fiat Chrysler Automóveis Brasil → Stellantis Automóveis Brasil, same company registration; Ericsson). Distinct subsidiaries stay separate, such as Dow Chemical and Dow Global Technologies: INPI listed groups in 2020 and 2021 and legal entities from 2022.',
      'INPI grouped residents by the root of the company registration number (CNPJ) until 2023 and by CNPJ or name from 2024.',
    ],
    sourcesLabel: 'Source for each year',
    sourceYear: '{year} file',
    loading: 'Loading the data…',
    loadError: 'The chart data could not be loaded.',
  },
  sources: {
    title: 'Official sources',
    items: [
      { label: 'Law 9,279/1996 (Industrial Property Law)', link: 'lpi' },
      { label: 'Law 9,609/1998 (computer programs)', link: 'softwareLaw' },
      { label: 'Law 9,610/1998 (copyright)', link: 'copyrightLaw' },
      { label: 'INPI: examination guidelines for computer-implemented inventions (INPI/PR Ordinance 411/2020)', link: 'ciiGuidelines' },
      { label: 'INPI: basic patent guide', link: 'basicGuide' },
      { label: 'INPI: basic manual for applicants', link: 'basicManual' },
      { label: 'INPI: patent procedure flowchart', link: 'processFlow' },
      { label: 'INPI: fee tables', link: 'feeTables' },
      { label: 'INPI: applicant rankings', link: 'inpiRankings' },
      { label: 'EPO: statistics', link: 'epoStatistics' },
      { label: 'WIPO: Paris Convention', link: 'paris' },
      { label: 'WIPO: PCT', link: 'pct' },
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'Can I patent an app?', a: 'Not the program as such (art. 10, V); the code is protected by copyright. A computer-implemented invention that solves a technical problem with a technical effect can be examined as an invention (INPI/PR Ordinance 411/2020).' },
      { q: 'I have already shown the invention at an event. Can I still apply?', a: 'In Brazil, disclosures by the inventor in the 12 months before filing do not count as prior art (art. 12). Other countries may have a different rule.' },
      { q: 'Is a Brazilian patent valid abroad?', a: 'No. Protection is territorial; for other countries, use the 12-month Paris Convention priority or the PCT route.' },
      { q: 'Do I need a lawyer or a patent agent?', a: 'The law allows applicants to act on their own (art. 216). A qualified professional helps with the search and with drafting the claims, which define the scope of protection.' },
      { q: 'How long does a patent last?', a: '20 years (invention) or 15 years (utility model) from filing, provided the annuities are paid (arts. 40, 84 and 86).' },
    ],
  },
};

const DE: GuideText = {
  tabsLabel: 'Abschnitte des Patentleitfadens',
  tabs: {
    assistant: 'Assistent', intro: 'Einführung', eligibility: 'Was patentierbar ist', search: 'Recherche zum Stand der Technik',
    steps: 'Schritt für Schritt', costs: 'Kosten und Fristen', stats: 'Statistik', sources: 'Quellen und FAQ',
  },
  checked: 'Angaben am 9. Oktober 2026 anhand der amtlichen Quellen geprüft.',
  disclaimer: 'Lehrinhalt auf Grundlage des brasilianischen Rechts und öffentlicher Dokumente des INPI. Er ist weder Rechtsberatung noch eine Garantie für die Erteilung eines Patents: Jeder Fall erfordert eine Einzelprüfung, am besten durch eine qualifizierte Fachperson.',
  intro: {
    what: 'Was ein Patent ist',
    whatText: [
      'Ein Patent ist ein vom Staat, in Brasilien vom INPI, erteiltes Schutzrecht, das seinem Inhaber für begrenzte Zeit das Recht gibt, Dritten die Herstellung, Benutzung, das Anbieten, den Verkauf oder die Einfuhr der Erfindung ohne Zustimmung zu untersagen (Gesetz über gewerbliches Eigentum, LPI, Art. 42).',
      'Im Gegenzug wird die Anmeldung öffentlich: Sie bleibt 18 Monate geheim und wird dann veröffentlicht (Art. 30). Der Schutz gilt nur in dem Land, das das Patent erteilt hat.',
    ],
    kindsTitle: 'Erfindungspatent und Gebrauchsmuster',
    kinds: [
      { name: 'Erfindungspatent (PI)', text: 'Für eine neue technische Lösung mit erfinderischer Tätigkeit und gewerblicher Anwendbarkeit (Art. 8). Laufzeit 20 Jahre ab Anmeldung (Art. 40).' },
      { name: 'Gebrauchsmuster (MU)', text: 'Für einen Gebrauchsgegenstand mit neuer Form oder Anordnung, die seine Benutzung oder Herstellung funktional verbessert, mit erfinderischem Schritt (Art. 9). Laufzeit 15 Jahre ab Anmeldung (Art. 40).' },
    ],
    compareTitle: 'Patent, Marke, Urheberrecht und Softwareregistrierung',
    compareHead: ['Schutzrecht', 'Schutzgegenstand', 'Gesetz', 'Laufzeit'],
    compare: [
      ['Patent', 'Technische Lösung: Erzeugnis oder Verfahren', 'Gesetz 9.279/1996', '20 Jahre (Erfindung) bzw. 15 Jahre (Gebrauchsmuster) ab Anmeldung'],
      ['Marke', 'Zeichen zur Unterscheidung von Waren oder Dienstleistungen', 'Gesetz 9.279/1996', '10 Jahre ab Eintragung, verlängerbar (Art. 133)'],
      ['Urheberrecht', 'Werke der Literatur, Kunst und Wissenschaft', 'Gesetz 9.610/1998', '70 Jahre nach dem Tod des Urhebers (Art. 41); keine Eintragung nötig'],
      ['Computerprogramm', 'Der Code und seine Ausdrucksform als Werk', 'Gesetz 9.609/1998', '50 Jahre; die Registrierung beim INPI ist freiwillig (Art. 2 §§ 2 und 3)'],
    ],
    filedVsGrantedTitle: 'Anmelden heißt nicht, ein Patent zu haben',
    filedVsGranted: 'Die Anmeldung erzeugt einen Antrag, der anschließend geprüft und erteilt oder zurückgewiesen werden kann (Art. 37). Das Patent wird erst nach dem Erteilungsbeschluss und der Zahlung der Gebühr mit der Patenturkunde erteilt (Art. 38). Nach der Erteilung kann der Inhaber auch für die Nutzung zwischen Veröffentlichung und Erteilung Entschädigung verlangen (Art. 44).',
  },
  eligibility: {
    requirementsTitle: 'Voraussetzungen der Patentierbarkeit',
    requirements: [
      { name: 'Neuheit', text: 'Die Erfindung darf nicht zum Stand der Technik gehören (Art. 11).' },
      { name: 'Erfinderische Tätigkeit', text: 'Für eine Fachperson darf sie sich nicht in naheliegender Weise aus dem Stand der Technik ergeben (Art. 13). Beim Gebrauchsmuster genügt ein erfinderischer Schritt: Es darf sich nicht in gewöhnlicher Weise ergeben (Art. 14).' },
      { name: 'Gewerbliche Anwendbarkeit', text: 'Sie muss in irgendeinem Gewerbezweig hergestellt oder benutzt werden können (Art. 15).' },
    ],
    priorArtTitle: 'Stand der Technik',
    priorArt: 'Alles, was vor dem Anmeldetag durch schriftliche oder mündliche Beschreibung, durch Benutzung oder auf andere Weise in Brasilien oder im Ausland der Öffentlichkeit zugänglich gemacht wurde (Art. 11 § 1). Dazu gehören Artikel, Vorträge, Videos, verkaufte Produkte und Patentanmeldungen aus allen Ländern.',
    graceTitle: 'Offenbarung vor der Anmeldung: die Neuheitsschonfrist',
    grace: 'In Brasilien gilt eine Offenbarung durch den Erfinder (oder auf Grundlage seiner Informationen) in den 12 Monaten vor der Anmeldung nicht als Stand der Technik (Art. 12). Viele Länder kennen keine solche Regel, sodass eine Offenbarung den Schutz im Ausland verhindern kann: Legen Sie die Strategie fest, bevor Sie veröffentlichen, auf einer Veranstaltung präsentieren oder verkaufen.',
    notInventionsTitle: 'Was nicht als Erfindung gilt (Art. 10)',
    notInventions: [
      'Entdeckungen, wissenschaftliche Theorien und mathematische Methoden;',
      'rein abstrakte Konzepte;',
      'Pläne, Regeln und Verfahren für geschäftliche, buchhalterische, finanzielle, pädagogische, werbliche, Lotterie- und Kontrolltätigkeiten;',
      'Werke der Literatur, Architektur, Kunst und Wissenschaft sowie jede ästhetische Schöpfung;',
      'Computerprogramme als solche;',
      'die Wiedergabe von Informationen;',
      'Spielregeln;',
      'operative oder chirurgische Techniken und Verfahren sowie Therapie- und Diagnostizierverfahren am menschlichen oder tierischen Körper;',
      'natürliche Lebewesen ganz oder teilweise und in der Natur vorgefundenes, auch daraus isoliertes biologisches Material sowie natürliche biologische Vorgänge.',
    ],
    notPatentableTitle: 'Was nicht patentierbar ist (Art. 18)',
    notPatentable: [
      'was gegen die guten Sitten oder die öffentliche Sicherheit, Ordnung oder Gesundheit verstößt;',
      'Erzeugnisse und Verfahren, die aus der Umwandlung des Atomkerns hervorgehen;',
      'Lebewesen ganz oder teilweise, mit Ausnahme transgener Mikroorganismen, die die Voraussetzungen erfüllen.',
    ],
    softwareTitle: 'Software und computerimplementierte Erfindungen',
    software: [
      'Nicht jedes Computerprogramm ist patentierbar: Das Gesetz schließt „Computerprogramme als solche“ aus (Art. 10, V).',
      'Eine computerimplementierte Erfindung kann patentierbar sein, wenn sie ein technisches Problem löst und eine technische Wirkung erzielt, die über die Art, wie der Code geschrieben ist, hinausgeht; so die Prüfungsrichtlinien des INPI (Verordnung INPI/PR Nr. 411/2020). Anschauliches Beispiel: Ein Steuerverfahren für ein eingebettetes System, das den Energieverbrauch eines Sensors senkt, kann als Erfindung geprüft werden; ein rein mathematischer Algorithmus oder eine Geschäftsmethode nicht.',
      'Der Code selbst ist nach Gesetz 9.609/1998 urheberrechtlich geschützt, ohne Registrierung; die Registrierung des Programms beim INPI ist freiwillig und dient als Nachweis von Urheberschaft und Datum.',
    ],
  },
  search: {
    why: 'Die Recherche zeigt, ob es bereits etwas Gleiches oder sehr Ähnliches gibt. Sie vermeidet Kosten für eine aussichtslose Anmeldung, zeigt, was wirklich neu ist, und leitet die Formulierung der Ansprüche.',
    whereTitle: 'Wo recherchieren',
    where: [
      { label: 'BuscaWeb (INPI)', link: 'buscaWeb', text: 'in Brasilien eingereichte Anmeldungen und Patente.' },
      { label: 'Espacenet (EPA)', link: 'espacenet', text: 'über 150 Millionen Patentdokumente aus vielen Ländern.' },
      { label: 'PATENTSCOPE (WIPO)', link: 'patentscope', text: 'internationale Anmeldungen (PCT) und nationale Bestände.' },
      { label: 'Patent Public Search (USPTO)', link: 'usptoSearch', text: 'Patente und veröffentlichte Anmeldungen der USA.' },
    ],
    howTitle: 'Vorgehen',
    how: [
      'Beschreiben Sie die Erfindung in wenigen Sätzen und notieren Sie Stichwörter und Synonyme, auch auf Englisch.',
      'Nutzen Sie die Internationale Patentklassifikation (IPC) oder die CPC: Ermitteln Sie die Klassen der nächstliegenden Dokumente und recherchieren Sie erneut danach.',
      'Lesen Sie die Ansprüche der gefundenen Dokumente: Sie bestimmen, was jedes Patent schützt.',
      'Beziehen Sie Nichtpatentliteratur ein (Artikel, technische Normen, Kataloge) und halten Sie fest, wo, wann und mit welchen Begriffen Sie recherchiert haben.',
      'Ihre Recherche ersetzt nicht die Prüfung des INPI, das selbst recherchiert.',
    ],
  },
  steps: {
    lede: 'Der allgemeine Ablauf einer Anmeldung eines Erfindungspatents beim INPI. Die Fristen sind die gesetzlichen; die Gebühren die der zum Prüfzeitpunkt geltenden Gebührentabelle.',
    labels: { goal: 'Ziel', prepare: 'Vorzubereiten', actions: 'Schritte', mistakes: 'Häufige Fehler', fee: 'Gebühr des INPI', sources: 'Amtliche Quellen' },
    items: [
      { title: 'Erfindung erfassen und beschreiben', goal: 'Genau wissen, welches technische Problem die Erfindung löst und wie.', prepare: 'Problem, Lösung, Vorteile, mögliche Varianten, Zeichnungen oder Fotos, Testergebnisse.', actions: 'Verfassen Sie eine technische Beschreibung und bewahren Sie datierte Entwicklungsunterlagen auf.', mistakes: 'Nur die Idee oder das gewünschte Ergebnis zu beschreiben, ohne zu erklären, wie man dahin gelangt.', links: [{ label: 'Leitfaden zu Patenten (INPI)', link: 'basicGuide' }] },
      { title: 'Patentierbarkeit einschätzen', goal: 'Neuheit, erfinderische Tätigkeit und gewerbliche Anwendbarkeit prüfen und Ausschlüsse ausschließen.', prepare: 'Die Beschreibung aus dem vorigen Schritt und Art. 8 bis 18 LPI.', actions: 'Vergleichen Sie die Erfindung mit dem bekannten Fachwissen und benennen Sie die Unterschiede.', mistakes: 'Kommerzielle Neuheit (niemand verkauft es) mit technischer Neuheit (niemand hat es offenbart) zu verwechseln.', links: [{ label: 'Gesetz 9.279/1996, Art. 8 bis 18', link: 'lpi' }] },
      { title: 'Stand der Technik recherchieren', goal: 'Nahe Dokumente finden, bevor Sie in eine Anmeldung investieren.', prepare: 'Stichwörter, Synonyme und Klassifikationssymbole.', actions: 'Recherchieren Sie in BuscaWeb, Espacenet und PATENTSCOPE; dokumentieren Sie die Recherchen.', mistakes: 'Nur auf Portugiesisch oder nur in einer Datenbank zu suchen.', links: [{ label: 'BuscaWeb (INPI)', link: 'buscaWeb' }, { label: 'Espacenet', link: 'espacenet' }, { label: 'PATENTSCOPE', link: 'patentscope' }] },
      { title: 'Schutzstrategie festlegen', goal: 'Zwischen Erfindungspatent, Gebrauchsmuster, Geschäftsgeheimnis oder Softwareregistrierung wählen und die Länder bestimmen.', prepare: 'Zielmärkte, Budget, Lebensdauer des Produkts.', actions: 'Berücksichtigen Sie das Prioritätsrecht (12 Monate für Patente nach der Pariser Verbandsübereinkunft) und den internationalen PCT-Weg.', mistakes: 'Vor der Entscheidung zu offenbaren oder zu verkaufen und damit die Neuheit in Ländern ohne Schonfrist zu verlieren.', links: [{ label: 'Pariser Verbandsübereinkunft (WIPO)', link: 'paris' }, { label: 'Vertrag über die internationale Zusammenarbeit (PCT)', link: 'pct' }] },
      { title: 'Technische Unterlagen vorbereiten', goal: 'Das Material sammeln, das die Beschreibung stützt.', prepare: 'Technische Zeichnungen, Versuchsdaten, Ausführungsbeispiele, Sequenzprotokolle bei biologischem Material.', actions: 'Ordnen Sie das Material in der Reihenfolge, in der die Erfindung erklärt wird.', mistakes: 'Wichtige Varianten wegzulassen: Nach der Anmeldung darf kein neuer Gegenstand hinzugefügt werden (Art. 32).', links: [{ label: 'Handbuch für Anmelder (INPI)', link: 'basicManual' }] },
      { title: 'Beschreibung, Ansprüche, Zusammenfassung und Zeichnungen verfassen', goal: 'Die Anmeldung mit den gesetzlich vorgeschriebenen Teilen erstellen (Art. 19).', prepare: 'Eine Beschreibung, die eine Fachperson zur Ausführung befähigt; Ansprüche, die den Schutz festlegen; eine Zusammenfassung; Zeichnungen, falls nötig.', actions: 'Formulieren Sie klare, von der Beschreibung gestützte Ansprüche, vom breitesten zum speziellsten.', mistakes: 'Zu breite (nicht neue) oder zu enge (leicht zu umgehende) Ansprüche.', links: [{ label: 'Gesetz 9.279/1996, Art. 19', link: 'lpi' }, { label: 'Handbuch für Anmelder (INPI)', link: 'basicManual' }] },
      { title: 'Zugang zu den Systemen des INPI', goal: 'Zugang zur elektronischen Einreichung erhalten.', prepare: 'Ein gov.br-Konto oder INPI-Login sowie die Registrierung im e-INPI.', actions: 'Öffnen Sie das Dienstmodul für Patente (Módulo de Serviços de Patentes).', mistakes: 'Anmelderdaten zu registrieren, die von denen in der Anmeldung abweichen.', links: [{ label: 'Dienstmodul für Patente', link: 'servicesModule' }, { label: 'Leitfaden zu Patenten (INPI)', link: 'basicGuide' }] },
      { title: 'Anmeldung einreichen und Gebühr zahlen', goal: 'Den Anmeldetag erhalten, der den maßgeblichen Stand der Technik festlegt.', prepare: 'Den Zahlschein des Bundes (GRU) für Code 200 und die Anmeldeunterlagen.', actions: 'Stellen Sie die GRU aus und bezahlen Sie sie, füllen Sie das Anmeldeformular aus und fügen Sie die Unterlagen bei.', mistakes: 'Einen falschen Dienstcode zu bezahlen oder die GRU-Nummer nicht anzugeben.', fee: 'Code 200: 260,00 R$ (130,00 R$ mit Ermäßigung).', links: [{ label: 'GRU-Zahlschein (INPI)', link: 'gru' }, { label: 'Gebührentabelle für Patente', link: 'patentFees' }] },
      { title: 'Veröffentlichungen und Fristen verfolgen', goal: 'Keinen Bescheid und keine Frist verpassen: Das INPI teilt seine Handlungen in der Revista da Propriedade Industrial (RPI) mit.', prepare: 'Die Anmeldenummer.', actions: 'Verfolgen Sie die wöchentliche RPI und den Stand in BuscaWeb. Die Anmeldung wird nach 18 Monaten Geheimhaltung veröffentlicht (Art. 30); Jahresgebühren beginnen im 3. Jahr nach der Anmeldung (Art. 84).', mistakes: 'Auf eine persönliche Benachrichtigung zu warten: Die Veröffentlichung in der RPI gilt bereits als Zustellung.', fee: 'Jahresgebühr der Anmeldung, Code 220: 400,00 R$ (200,00 R$ mit Ermäßigung).', links: [{ label: 'Revista da Propriedade Industrial (RPI)', link: 'rpi' }, { label: 'BuscaWeb (INPI)', link: 'buscaWeb' }] },
      { title: 'Prüfung beantragen', goal: 'Die technische Prüfung einleiten.', prepare: 'Die Zahlung der Prüfungsgebühr.', actions: 'Beantragen Sie die Prüfung innerhalb von 36 Monaten nach der Anmeldung, sonst wird sie abgelegt (Art. 33).', mistakes: 'Die 36-Monats-Frist zu versäumen.', fee: 'Code 203, bis 10 Ansprüche: 870,00 R$ (435,00 R$ mit Ermäßigung); jeder weitere Anspruch kostet zusätzlich.', links: [{ label: 'Gesetz 9.279/1996, Art. 33', link: 'lpi' }, { label: 'Gebührentabelle für Patente', link: 'patentFees' }] },
      { title: 'Auf Bescheide antworten', goal: 'Anforderungen und Stellungnahmen der Prüfung erfüllen oder bestreiten.', prepare: 'Technische Argumente und, falls nötig, geänderte Ansprüche im Rahmen des Offenbarten.', actions: 'Antworten Sie innerhalb von 90 Tagen nach der Veröffentlichung (Art. 36); ohne Antwort wird die Anmeldung endgültig abgelegt.', mistakes: 'Neuen Gegenstand hinzuzufügen oder die Frist verstreichen zu lassen.', fee: 'Erfüllung einer Anforderung, Code 207: 130,00 R$ (65,00 R$ mit Ermäßigung).', links: [{ label: 'Gesetz 9.279/1996, Art. 36', link: 'lpi' }] },
      { title: 'Entscheidung und Erteilung', goal: 'Die Entscheidung erhalten: Erteilung oder Zurückweisung (Art. 37).', prepare: 'Die RPI weiter verfolgen.', actions: 'Nach dem Erteilungsbeschluss die Gebühr für die Patenturkunde binnen 60 Tagen zahlen (Art. 38). Bei Zurückweisung ist binnen 60 Tagen Beschwerde möglich (Art. 212).', mistakes: 'Die Zahlungsfrist nach dem Erteilungsbeschluss zu versäumen.', fee: 'Patenturkunde in der regulären Frist, Code 212: 0,00 R$. Beschwerde, Code 214: 1.580,00 R$ (790,00 R$ mit Ermäßigung).', links: [{ label: 'Verfahrensablauf für Patente (INPI)', link: 'processFlow' }] },
      { title: 'Rechte aufrechterhalten', goal: 'Das Patent bis zum Ende der Laufzeit in Kraft halten.', prepare: 'Einen Kalender der Jahresgebühren.', actions: 'Zahlen Sie jede Jahresgebühr in den ersten 3 Monaten des Jahres oder in den folgenden 6 Monaten mit Zuschlag (Art. 84). Ohne Zahlung erlischt das Patent (Art. 86); die Wiederherstellung kann binnen 3 Monaten beantragt werden (Art. 87).', mistakes: 'Eine Jahresgebühr zu vergessen.', fee: 'Jahresgebühren eines erteilten Patents: 1.000,00 R$ (3. bis 6. Jahr) bis 2.800,00 R$ (ab dem 16. Jahr), mit Ermäßigung die Hälfte.', links: [{ label: 'Gesetz 9.279/1996, Art. 84 bis 87', link: 'lpi' }, { label: 'Gebührentabelle für Patente', link: 'patentFees' }] },
    ],
  },
  costs: {
    lede: 'Gebühren des INPI für Erfindungspatente (Verordnung GM/MDIC Nr. 110/2025 und INPI/PR Nr. 10/2025, Tabelle vom 20. Dezember 2025). Prüfen Sie vor der Zahlung die geltende Tabelle.',
    feesTitle: 'Wichtigste Gebühren',
    feesHead: ['Code', 'Leistung', 'Gebühr', 'Mit Ermäßigung'],
    fees: [
      ['200', 'Einreichung einer Anmeldung (elektronisch)', '260,00 R$', '130,00 R$'],
      ['203', 'Prüfungsantrag für eine Erfindung (bis 10 Ansprüche)', '870,00 R$', '435,00 R$'],
      ['207', 'Erfüllung einer Anforderung', '130,00 R$', '65,00 R$'],
      ['220', 'Jahresgebühr einer Erfindungsanmeldung (reguläre Frist)', '400,00 R$', '200,00 R$'],
      ['222', 'Jahresgebühr des Patents, 3. bis 6. Jahr', '1.000,00 R$', '500,00 R$'],
      ['224', 'Jahresgebühr des Patents, 7. bis 10. Jahr', '1.600,00 R$', '800,00 R$'],
      ['226', 'Jahresgebühr des Patents, 11. bis 15. Jahr', '2.200,00 R$', '1.100,00 R$'],
      ['228', 'Jahresgebühr des Patents, ab dem 16. Jahr', '2.800,00 R$', '1.400,00 R$'],
      ['212', 'Ausstellung der Patenturkunde (reguläre Frist)', '0,00 R$', '0,00 R$'],
      ['214', 'Beschwerde', '1.580,00 R$', '790,00 R$'],
    ],
    feesNote: 'Die Ermäßigung von 50 % gilt unter anderem für natürliche Personen, Kleinstunternehmen, Einzelunternehmer und kleine Unternehmen unter den Bedingungen der Tabelle; einkommensschwache Personen und Menschen mit Behinderung erhalten bei einigen Leistungen 100 % Ermäßigung.',
    feesLink: 'Gebührentabelle für Patente (INPI)',
    deadlinesTitle: 'Gesetzliche Fristen',
    deadlines: [
      'Neuheitsschonfrist: Offenbarungen des Erfinders in den 12 Monaten vor der Anmeldung (Art. 12).',
      'Geheimhaltung: 18 Monate ab Anmeldung oder Priorität; danach Veröffentlichung (Art. 30).',
      'Prüfungsantrag: innerhalb von 36 Monaten nach der Anmeldung (Art. 33).',
      'Antwort auf einen Bescheid: 90 Tage (Art. 36). Beschwerde: 60 Tage (Art. 212).',
      'Jahresgebühren: ab dem 3. Jahr nach der Anmeldung (Art. 84).',
      'Laufzeit: 20 Jahre (Erfindung) bzw. 15 Jahre (Gebrauchsmuster) ab Anmeldung (Art. 40). Die ab der Erteilung gerechnete Mindestlaufzeit wurde nach dem Urteil des Obersten Gerichtshofs (ADI 5529) durch Gesetz 14.195/2021 aufgehoben.',
    ],
    professional: 'Neben den Gebühren können Kosten für Fachleute (Patentvertreter oder Rechtsanwalt) für Recherche, Ausarbeitung und Verfahren anfallen. Sie sind nicht gesetzlich festgelegt. Das Gesetz erlaubt, selbst zu handeln oder einen Vertreter zu bestellen (Art. 216).',
  },
  stats: {
    title: 'Unternehmen mit den meisten Patentanmeldungen',
    lede: 'Die zehn Unternehmen mit den meisten Anmeldungen je Amt, 2020 bis 2026, nach den amtlichen Listen. Die Kennzahlen unterscheiden sich zwischen den Ämtern und dürfen weder addiert noch direkt verglichen werden.',
    viewLabel: 'Amt und Kennzahl',
    views: {
      'br-nonresidents': { label: 'Brasilien · ausländische Unternehmen', indicator: 'Anmeldungen von Erfindungspatenten beim INPI durch nicht ansässige Anmelder, nach Anmeldejahr.' },
      'br-residents': { label: 'Brasilien · ansässige Unternehmen', indicator: 'Anmeldungen von Erfindungspatenten beim INPI durch ansässige Anmelder, nach Anmeldejahr. Nur Unternehmen: Hochschulen, Institute, Stiftungen und natürliche Personen sind ausgenommen.' },
      epo: { label: 'Europa · EPA', indicator: 'Europäische Patentanmeldungen beim Europäischen Patentamt (EPA): Direktanmeldungen und PCT-Anmeldungen in der europäischen Phase, gezählt nach dem erstgenannten Anmelder, mit vom EPA konsolidierten Konzernen. Das EPA ist für 39 Staaten zuständig, nicht nur für die Europäische Union.' },
      us: { label: 'USA · USPTO', indicator: 'Vom USPTO erteilte Utility-Patente, nach Erteilungsjahr, gezählt nach dem ersten Inhaber (Assignee), der ein Unternehmen ist, mit von PatentsView bereinigten Namen. Es sind Erteilungen, keine Anmeldungen: nicht mit INPI oder EPA vergleichen.' },
      cn: { label: 'China · CNIPA', indicator: '' },
    },
    unavailable: {
      us: { text: 'Das USPTO veröffentlicht für 2020 bis 2026 keine amtliche Rangliste der Unternehmen (der neueste auffindbare Bericht „Patenting by Organizations“ reicht bis 2005). Die Kennzahl wird aus den offenen Daten des USPTO berechnet (PatentsView, Erteilungen bis 31.12.2025), deren Download einen kostenlosen API-Schlüssel des USPTO erfordert; diese Version der Website enthält diese Daten noch nicht.', links: [{ label: 'USPTO: Forschungsdatensätze', link: 'usptoDatasets' }, { label: 'PatentsView (Daten des USPTO)', link: 'patentsView' }] },
      cn: { text: 'Für 2020 bis 2026 haben wir keine von der CNIPA in einer überprüfbaren amtlichen Quelle veröffentlichte Anmelderrangliste gefunden; daher gibt es kein Diagramm.', links: [{ label: 'CNIPA', link: 'cnipa' }] },
    },
    companiesLabel: 'Unternehmen im Diagramm',
    companiesHint: 'Bis zu 8 auswählen. Jedes Unternehmen behält seine Farbe.',
    chartLabel: 'Patentanmeldungen pro Jahr',
    yAxis: 'Anmeldungen',
    tableCaption: 'Werte nach Unternehmen und Jahr',
    colCompany: 'Unternehmen',
    notListed: 'nicht in der veröffentlichten Liste (höchstens {n})',
    notPublished: 'keine Daten veröffentlicht',
    partialYear: '2026: laufendes Jahr; die Ämter veröffentlichen die Rangliste im Folgejahr.',
    dataUntil: 'Daten bis {date}.',
    rank: 'Rang',
    method: [
      'Quellen: die jährlichen Ranglisten des INPI (die 50 größten Anmelder jedes Jahres; Gleichstände am Listenende sind alle enthalten) und der Patent Index/Technology Dashboard des EPA (50 größte Anmelder).',
      'Die zehn Unternehmen sind die mit der größten Summe an Anmeldungen in den veröffentlichten Listen 2020 bis 2025.',
      'Fehlt ein Unternehmen in der Liste eines Jahres, ist sein Wert nicht null: Es hatte höchstens so viele wie der letzte Eintrag jenes Jahres.',
      'Namen wie veröffentlicht; zusammengeführt werden nur Schreibweisen desselben Namens und belegte Umfirmierungen (Raytheon Technologies → RTX; FCA Fiat Chrysler Automóveis Brasil → Stellantis Automóveis Brasil, dieselbe Registernummer; Ericsson). Verschiedene Tochtergesellschaften bleiben getrennt, etwa Dow Chemical und Dow Global Technologies: Das INPI führte 2020 und 2021 Konzerne und ab 2022 juristische Personen auf.',
      'Das INPI gruppierte ansässige Anmelder bis 2023 nach dem Stamm der Steuernummer (CNPJ) und ab 2024 nach CNPJ oder Namen.',
    ],
    sourcesLabel: 'Quelle für jedes Jahr',
    sourceYear: 'Datei {year}',
    loading: 'Daten werden geladen…',
    loadError: 'Die Daten des Diagramms konnten nicht geladen werden.',
  },
  sources: {
    title: 'Amtliche Quellen',
    items: [
      { label: 'Gesetz 9.279/1996 (Gesetz über gewerbliches Eigentum)', link: 'lpi' },
      { label: 'Gesetz 9.609/1998 (Computerprogramme)', link: 'softwareLaw' },
      { label: 'Gesetz 9.610/1998 (Urheberrecht)', link: 'copyrightLaw' },
      { label: 'INPI: Prüfungsrichtlinien für computerimplementierte Erfindungen (Verordnung INPI/PR Nr. 411/2020)', link: 'ciiGuidelines' },
      { label: 'INPI: Leitfaden zu Patenten', link: 'basicGuide' },
      { label: 'INPI: Handbuch für Anmelder', link: 'basicManual' },
      { label: 'INPI: Verfahrensablauf für Patente', link: 'processFlow' },
      { label: 'INPI: Gebührentabellen', link: 'feeTables' },
      { label: 'INPI: Ranglisten der Anmelder', link: 'inpiRankings' },
      { label: 'EPA: Statistik', link: 'epoStatistics' },
      { label: 'WIPO: Pariser Verbandsübereinkunft', link: 'paris' },
      { label: 'WIPO: PCT', link: 'pct' },
    ],
    faqTitle: 'Häufige Fragen',
    faq: [
      { q: 'Kann ich eine App patentieren?', a: 'Das Programm als solches nicht (Art. 10, V); der Code ist urheberrechtlich geschützt. Eine computerimplementierte Erfindung, die ein technisches Problem mit technischer Wirkung löst, kann als Erfindung geprüft werden (Verordnung INPI/PR Nr. 411/2020).' },
      { q: 'Ich habe die Erfindung schon auf einer Veranstaltung gezeigt. Kann ich noch anmelden?', a: 'In Brasilien gelten Offenbarungen des Erfinders in den 12 Monaten vor der Anmeldung nicht als Stand der Technik (Art. 12). In anderen Ländern kann die Regel anders sein.' },
      { q: 'Gilt ein brasilianisches Patent im Ausland?', a: 'Nein. Der Schutz ist territorial; für andere Länder nutzen Sie die zwölfmonatige Priorität nach der Pariser Verbandsübereinkunft oder den PCT-Weg.' },
      { q: 'Brauche ich einen Anwalt oder Patentvertreter?', a: 'Das Gesetz erlaubt, selbst zu handeln (Art. 216). Eine qualifizierte Fachperson hilft bei der Recherche und bei der Formulierung der Ansprüche, die den Schutzumfang bestimmen.' },
      { q: 'Wie lange gilt ein Patent?', a: '20 Jahre (Erfindung) bzw. 15 Jahre (Gebrauchsmuster) ab Anmeldung, sofern die Jahresgebühren gezahlt werden (Art. 40, 84 und 86).' },
    ],
  },
};

export const GUIDE_I18N: Record<Locale, GuideText> = { pt: PT, en: EN, de: DE };
