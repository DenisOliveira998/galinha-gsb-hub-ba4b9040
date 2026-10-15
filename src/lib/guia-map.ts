// Mapa Guia ↔ blog ("hub e raios").
//
// O Guia e o blog não têm texto copiado entre si, mas tratavam dos mesmos
// assuntos e disputavam as mesmas buscas. A divisão de papéis passa a ser:
//   • capítulo do Guia = referência resumida do tema (o "hub");
//   • posts do blog    = aprofundamentos práticos daquele tema (os "raios").
// O capítulo lista os seus posts ("Aprofunde no blog") e cada post aponta de
// volta para o seu capítulo ("Continue lendo"). Cada post pertence a UM capítulo.
//
// Ao publicar um post novo, inclua o slug no capítulo certo. Se um slug mudar,
// atualize aqui — link para slug inexistente leva a uma página 404.

export type GuiaChapter = {
  num: number;
  to: string;
  label: string;
  /** Posts que aprofundam o capítulo: slug + título exibido. */
  posts: { slug: string; title: string }[];
};

export const GUIA_CHAPTERS: GuiaChapter[] = [
  {
    num: 1,
    to: "/guia/origem",
    label: "Origem e formação histórica",
    posts: [
      { slug: "de-onde-veio-a-galinha-gsb-a-historia-por-tras-da-raca-gigante-de-baixa-grande-na-bahia", title: "De onde veio a Galinha GSB? A história por trás da raça gigante de Baixa Grande, na Bahia" },
      { slug: "galinha-gsb-o-que-e-origem-e-por-que-ela-esta-conquistando-o-brasil", title: "Galinha GSB: o que é, origem e por que ela está conquistando o Brasil" },
    ],
  },
  {
    num: 2,
    to: "/guia/caracteristicas",
    label: "Características, padrão morfológico e dimorfismo",
    posts: [
      { slug: "caracteristicas-da-galinha-gsb-o-padrao-completo-da-raca-parte-por-parte", title: "Características da Galinha GSB: o padrão completo da raça, parte por parte" },
      { slug: "galinha-sertaneja-balao-e-mansa-descubra-o-temperamento-da-gsb", title: "Galinha Sertaneja Balão é mansa? Descubra o temperamento da GSB" },
      { slug: "sertaneja-balao-x-indio-gigante-x-brahma-qual-e-realmente-a-maior-galinha-do-brasil", title: "Sertaneja Balão x Índio Gigante x Brahma: qual é a maior galinha do Brasil?" },
    ],
  },
  {
    num: 3,
    to: "/guia/plumagem",
    label: "Plumagens, cores e leitura visual",
    posts: [
      { slug: "cores-e-padroes-da-galinha-gsb-conheca-as-variacoes-mais-raras-e-valorizadas", title: "Cores e padrões da Galinha GSB: as variações mais raras e valorizadas" },
    ],
  },
  {
    num: 4,
    to: "/guia/selecao",
    label: "Seleção de reprodutores e formação do plantel",
    posts: [
      { slug: "como-saber-se-a-galinha-gsb-e-macho-ou-femea-guia-de-sexagem-dos-pintinhos-a-fase-adulta", title: "Como saber se a Galinha GSB é macho ou fêmea? Sexagem dos pintinhos à fase adulta" },
      { slug: "nao-compre-ovos-de-galinha-gsb-no-mercado-livre-sem-ler-isto-antes", title: "Não compre ovos de Galinha GSB no Mercado Livre sem ler isto antes" },
    ],
  },
  {
    num: 5,
    to: "/guia/reproducao",
    label: "Reprodução, fertilidade e incubação",
    posts: [
      { slug: "como-chocar-ovos-ferteis-de-galinha-gsb-guia-completo-de-incubacao-e-ovoscopia", title: "Como chocar ovos férteis de Galinha GSB: incubação e ovoscopia" },
      { slug: "quantos-ovos-a-galinha-gsb-poe-por-ano-producao-media-e-como-aumentar", title: "Quantos ovos a Galinha GSB põe por ano?" },
      { slug: "como-receber-pintinhos-e-ovos-ferteis-com-seguranca-guia-de-transporte", title: "Como receber pintinhos e ovos férteis com segurança: transporte" },
    ],
  },
  {
    num: 6,
    to: "/guia/pintinhos",
    label: "Pintinhos e desenvolvimento",
    posts: [
      { slug: "como-e-o-crescimento-da-galinha-gsb-mes-a-mes", title: "Como é o crescimento da Galinha GSB mês a mês" },
      { slug: "como-criar-galinha-gsb-do-zero-guia-completo-para-iniciantes", title: "Como criar Galinha GSB do zero: guia para iniciantes" },
    ],
  },
  {
    num: 7,
    to: "/guia/alimentacao",
    label: "Manejo, instalações e alimentação",
    posts: [
      { slug: "alimentacao-da-galinha-gsb-o-que-dar-para-ela-crescer-forte-e-saudavel", title: "Alimentação da Galinha GSB: o que dar para ela crescer forte e saudável" },
      { slug: "galinheiro-ideal-para-galinha-gsb-espaco-poleiro-e-ninho-na-medida-certa", title: "Galinheiro ideal para Galinha GSB: espaço, poleiro e ninho" },
      { slug: "como-proteger-a-galinha-gsb-de-predadores-guia-para-deixar-o-galinheiro-mais-seguro", title: "Como proteger a Galinha GSB de predadores" },
      { slug: "posso-criar-galinha-gsb-no-quintal-de-casa-legislacao-e-regras-urbanas", title: "Posso criar Galinha GSB no quintal de casa? Regras urbanas" },
      { slug: "quanto-custa-criar-galinha-gsb-guia-de-custos-mensais-e-retorno", title: "Quanto custa criar Galinha GSB? Custos mensais" },
    ],
  },
  {
    num: 8,
    to: "/guia/sanidade",
    label: "Sanidade e observação diária",
    posts: [
      { slug: "saude-da-galinha-gsb-doencas-mais-comuns-e-como-preveni-las", title: "Saúde da Galinha GSB: doenças mais comuns e como preveni-las" },
      { slug: "calendario-de-vacinacao-para-pintinhos-e-galinhas-gsb", title: "Calendário de vacinação para pintinhos e galinhas GSB" },
    ],
  },
];

/** Post de dúvidas gerais: ligado à visão geral do Guia, não a um capítulo. */
export const GUIA_FAQ_POST = {
  slug: "perguntas-frequentes-sobre-a-galinha-gsb",
  title: "Perguntas frequentes sobre a Galinha GSB",
};

/** Nome curto do tema de cada capítulo, usado como etiqueta dos posts. */
export const TEMA_CURTO: Record<number, string> = {
  1: "Origem",
  2: "Características",
  3: "Plumagem",
  4: "Seleção",
  5: "Reprodução",
  6: "Pintinhos",
  7: "Manejo",
  8: "Saúde",
};

export const chapterByPath = (path: string) => GUIA_CHAPTERS.find((c) => c.to === path);

export const chapterForPost = (slug: string) => GUIA_CHAPTERS.find((c) => c.posts.some((p) => p.slug === slug));
