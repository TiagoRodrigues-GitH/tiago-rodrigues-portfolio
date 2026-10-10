/**
 * Official sources of the patent guide (checked on 9 October 2026). Legal texts are the consolidated versions on
 * planalto.gov.br; procedures, systems and fees are INPI's own pages and files.
 */
export const GUIDE_DATE = '2026-10-09';

export const LINKS = {
  lpi: 'https://www.planalto.gov.br/ccivil_03/leis/l9279.htm',
  softwareLaw: 'https://www.planalto.gov.br/ccivil_03/leis/l9609.htm',
  copyrightLaw: 'https://www.planalto.gov.br/ccivil_03/leis/l9610.htm',
  ciiGuidelines: 'https://www.gov.br/inpi/pt-br/servicos/patentes/consultas-publicas/arquivos/2020_11_16___diretrizes_iic___versao_final.pdf',
  basicGuide: 'https://www.gov.br/inpi/pt-br/servicos/patentes/guia-basico',
  basicManual: 'https://www.gov.br/inpi/pt-br/servicos/patentes/nova-estrutura-do-portal-gov/modulo-de-servicos-faq/ManualdePatentes20260923.pdf',
  processFlow: 'https://www.gov.br/inpi/pt-br/servicos/patentes/guia-basico/fluxo-processual-patentes.pdf',
  servicesModule: 'https://servicos.patentes.inpi.gov.br/',
  gru: 'https://meu.inpi.gov.br/pag/',
  rpi: 'https://revistas.inpi.gov.br/rpi/',
  buscaWeb: 'https://busca.inpi.gov.br/pePI/jsp/patentes/PatenteSearchBasico.jsp',
  feeTables: 'https://www.gov.br/inpi/pt-br/servicos/tabelas-de-retribuicao',
  patentFees: 'https://www.gov.br/inpi/pt-br/servicos/patentes/NovaTabeladeRetribuiesINPI_Patentes_20_dez_25.pdf',
  espacenet: 'https://worldwide.espacenet.com/',
  patentscope: 'https://patentscope.wipo.int/',
  usptoSearch: 'https://www.uspto.gov/patents/search/patent-public-search',
  paris: 'https://www.wipo.int/treaties/en/ip/paris/',
  pct: 'https://www.wipo.int/pct/en/',
  inpiRankings: 'https://www.gov.br/inpi/pt-br/inpi-data/relatorios/ranking-depositantes',
  epoStatistics: 'https://www.epo.org/en/about-us/statistics',
  cnipa: 'https://english.cnipa.gov.cn/',
} as const;

export type LinkKey = keyof typeof LINKS;
