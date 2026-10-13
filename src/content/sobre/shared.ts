import type { LinkItem, SobreContent } from "./types";

/**
 * Rotas e conteúdos comuns às duas versões (demonstração e produção).
 * Todos os caminhos com verified: true foram conferidos em
 * https://galinhagsb.com.br em 11/10/2026 (resposta HTTP 200).
 */

export const SITE_URL = "https://galinhagsb.com.br";

export const links = {
  home: { label: "Início", href: "/", verified: true },
  sobre: { label: "Sobre", href: "/sobre", verified: true },
  blog: { label: "Blog", href: "/blog", verified: true },
  guia: { label: "Guia da GSB", href: "/guia", verified: true },
  guiaPdf: {
    label: "Guia completo em PDF",
    href: "/guia-completo-galinha-gsb-sertaneja-balao.pdf",
    external: true,
    verified: true,
  },
  guiaOrigem: { label: "Origem e formação histórica", href: "/guia/origem", verified: true },
  guiaCaracteristicas: { label: "Características da raça", href: "/guia/caracteristicas", verified: true },
  guiaPlumagem: { label: "Plumagens e cores", href: "/guia/plumagem", verified: true },
  guiaSelecao: { label: "Seleção de reprodutores", href: "/guia/selecao", verified: true },
  guiaReproducao: { label: "Reprodução e incubação", href: "/guia/reproducao", verified: true },
  guiaPintinhos: { label: "Pintinhos e desenvolvimento", href: "/guia/pintinhos", verified: true },
  guiaManejo: { label: "Manejo, instalações e alimentação", href: "/guia/alimentacao", verified: true },
  guiaSanidade: { label: "Sanidade e observação diária", href: "/guia/sanidade", verified: true },
  artigoGalinheiro: {
    label: "Galinheiro ideal para a GSB",
    href: "/blog/galinheiro-ideal-para-galinha-gsb-espaco-poleiro-e-ninho-na-medida-certa",
    verified: true,
  },
  catalogo: { label: "Catálogo", href: "/catalogo", verified: true },
  contato: { label: "Contato", href: "/contato", verified: true },
  autor: { label: "Página do autor", href: "/autor/leonardo-reis", verified: true },
  privacidade: { label: "Política de Privacidade", href: "/privacidade", verified: true },
  termos: { label: "Termos de Uso", href: "/termos", verified: true },
  cookies: { label: "Aviso de Cookies / LGPD", href: "/cookies", verified: true },
  publicidade: { label: "Anúncios e Google AdSense", href: "/publicidade", verified: true },
  afiliados: { label: "Divulgação de links afiliados", href: "/afiliados", verified: true },
  /**
   * NÃO EXISTE no site (retornou 404 em 11/10/2026). Quando a política
   * editorial for publicada, crie a rota, troque verified para true e
   * defina editorial.status = "vigente".
   */
  politicaEditorial: {
    label: "Política editorial",
    href: "/politica-editorial",
    verified: false,
  },
} satisfies Record<string, LinkItem>;

export const sharedPurpose: SobreContent["purpose"] = {
  mission:
    "Compartilhar informações úteis sobre a Galinha Sertaneja Balão e incentivar práticas responsáveis de criação e manejo.",
  vision:
    "Desenvolver um espaço digital especializado, acessível e continuamente aprimorado, voltado ao conhecimento sobre a raça.",
  values: [
    "Transparência",
    "Respeito aos animais",
    "Responsabilidade",
    "Qualidade informativa",
    "Melhoria contínua",
  ],
};

export const sharedEditorialCommitments: string[] = [
  "Priorizar informações verificáveis e indicar quando algo é observação de criador.",
  "Consultar materiais técnicos de avicultura sempre que o tema exigir.",
  "Identificar quem escreve e quem responde por cada conteúdo.",
  "Diferenciar relatos de experiência de recomendações técnicas.",
  "Revisar artigos quando surgirem informações relevantes ou mais atuais.",
  "Corrigir erros identificados e registrar as atualizações importantes.",
  "Deixar claro o que é conteúdo publicitário, afiliado ou comercial.",
  "Recomendar assistência veterinária quando a situação exigir avaliação profissional.",
];

export const sharedBreed: SobreContent["breed"] = {
  title: "Nossa dedicação à Galinha Sertaneja Balão",
  paragraphs: [
    "A Sertaneja Balão faz parte do conjunto de galinhas formadas pela seleção feita por criadores brasileiros ao longo de gerações. O material reunido no Guia da GSB associa sua formação à criação regional no sertão da Bahia — mas, como acontece com muitas raças locais, boa parte dessa história vem de relatos de criadores e ainda tem pouca documentação formal.",
    "Por isso tratamos a raça com interesse e cuidado: apresentamos o que é descrito por criadores e pela literatura disponível, separamos observação de afirmação técnica e evitamos transformar hipóteses sobre origem, genética ou desempenho em verdades absolutas.",
  ],
  highlights: [
    {
      title: "Ligação com a avicultura brasileira",
      text: "Uma ave formada pela seleção de criadores locais, parte de um patrimônio de raças que merece ser conhecido e registrado.",
    },
    {
      title: "Características que despertam interesse",
      text: "Criadores costumam destacar o porte avantajado, a plumagem solta, o peito largo, a rusticidade e o temperamento tranquilo.",
    },
    {
      title: "Manejo à altura do porte",
      text: "Aves grandes pedem poleiros, ninhos, espaço e alimentação adequados a cada fase — informação que procuramos tornar acessível.",
    },
    {
      title: "Diversidade e características raciais",
      text: "Seleção cuidadosa e atenção à consanguinidade ajudam a manter a variabilidade e os traços que identificam a raça.",
    },
    {
      title: "Informar quem está chegando",
      text: "Quem começa merece orientação clara antes de investir: o que esperar da raça, quais cuidados ela exige e onde buscar ajuda.",
    },
  ],
  image: {
    src: null,
    alt: "Galinha Sertaneja Balão em ambiente de criação",
    verified: false,
    placeholderLabel: "[FOTOGRAFIA REAL DE UMA GSB — RETRATO DE CORPO INTEIRO]",
    width: 1200,
    height: 1500,
  },
  links: [links.guiaOrigem, links.guiaCaracteristicas, links.guiaPlumagem],
};

export const sharedHub: SobreContent["hub"] = {
  intro:
    "A página institucional é só a porta de entrada. O portal reúne material para quem está conhecendo a raça e para quem já cria há tempo.",
  items: [
    {
      icon: "book-open",
      title: "Artigos do blog",
      description:
        "Textos práticos sobre sexagem, incubação, predadores, custos, vacinação e o dia a dia do galinheiro.",
      link: { ...links.blog, label: "Ler o blog" },
    },
    {
      icon: "feather",
      title: "Guia da Galinha GSB",
      description:
        "Oito temas organizados — da origem da raça à sanidade — para consultar no navegador, na ordem que preferir.",
      link: { ...links.guia, label: "Abrir o guia" },
    },
    {
      icon: "file-down",
      title: "Guia completo em PDF",
      description:
        "A versão completa do guia em um único arquivo, com capítulos extras para ler com calma ou guardar.",
      link: { ...links.guiaPdf, label: "Baixar o PDF" },
    },
    {
      icon: "wheat",
      title: "Manejo e alimentação",
      description:
        "Poleiros, ninhos, piso, sombreamento e consumo de ração por fase, pensados para o grande porte da GSB.",
      link: { ...links.guiaManejo, label: "Ver orientações de manejo" },
    },
    {
      icon: "store",
      title: "Catálogo",
      description:
        "Ovos férteis, pintinhos, galinhas e galos reprodutores. A disponibilidade varia conforme a época do plantel.",
      link: { ...links.catalogo, label: "Ver o catálogo" },
    },
    {
      icon: "messages",
      title: "Contato",
      description:
        "Dúvidas sobre a raça, sobre o catálogo ou uma correção a sugerir? Os canais oficiais estão reunidos em um só lugar.",
      link: { ...links.contato, label: "Falar com a gente" },
    },
  ],
};

export const sharedTransparencyLinks: LinkItem[] = [
  links.privacidade,
  links.termos,
  links.contato,
  links.autor,
  links.publicidade,
  links.afiliados,
  links.cookies,
];

export const galleryCategoryLabels = {
  plantel: "Aves do plantel",
  ambiente: "Ambiente de criação",
  reprodutores: "Reprodutores",
  pintinhos: "Pintinhos e desenvolvimento",
  manejo: "Rotina de manejo",
} as const;
