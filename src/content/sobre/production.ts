import type { GalleryItem, SobreContent } from "./types";
import {
  SITE_URL,
  links,
  sharedBreed,
  sharedEditorialCommitments,
  sharedHub,
  sharedPurpose,
  sharedTransparencyLinks,
} from "./shared";

/**
 * ============================================================
 * CONTEÚDO DE PRODUÇÃO — dados do responsável real.
 * ============================================================
 * Fonte: textos já publicados em galinhagsb.com.br (/sobre,
 * /autor/leonardo-reis, /guia e /contato), consultados em 11/10/2026.
 *
 * Tudo entre [COLCHETES] está PENDENTE de confirmação:
 *  - aparece destacado em âmbar no modo revisão;
 *  - é omitido automaticamente no build final.
 * Fotos com verified: false seguem a mesma regra.
 */

const BLOB = "https://entijsrevhhfkiaj.public.blob.vercel-storage.com/gsb";

/** Foto já usada pelo site na página /sobre, com o alt "Leonardo Reis". */
const LEONARDO_PHOTO = `${BLOB}/1790166643559-731356615_4105946109542215_6095357414885185782_n-nR7ngNSIzvlmXWgMmNK5bBzRpqZ6Cy.webp`;

/**
 * Candidatas à galeria: fotos com aparência de registro real encontradas
 * no acervo do site. A ORIGEM NÃO FOI CONFIRMADA — podem ser do plantel
 * ou de terceiros. Confirme com o responsável e troque verified para true.
 * Imagens geradas por IA nunca devem entrar aqui.
 */
const galleryItems: GalleryItem[] = [
  {
    id: "plantel-1",
    category: "plantel",
    src: `${BLOB}/1788900692458-786702090_122229151472517462_35271574783756697_n-CcvWPrivtBnq1p1OmC9uMkyCAzksWY.webp`,
    alt: "Galinha de plumagem salpicada em preto e branco descansando sobre chão de terra",
    caption: "Galinha de plumagem salpicada em repouso.",
    verified: false,
    placeholderLabel: "[FOTO REAL: AVE DO PLANTEL]",
  },
  {
    id: "reprodutores-1",
    category: "reprodutores",
    src: `${BLOB}/1787662641807-741613631_122223732350517462_2243969387885911686_n-qvFTm03yvikI2PxjVZxc7wDNxLKfFh.webp`,
    alt: "Galo de plumagem avermelhada ao lado de galinhas preta e pintada em área arborizada",
    caption: "Galo e galinhas em área com sombra natural.",
    verified: false,
    placeholderLabel: "[FOTO REAL: REPRODUTORES]",
  },
  {
    id: "ambiente-1",
    category: "ambiente",
    src: `${BLOB}/1787014361067-764975744_1002865099464654_4123278116638690376_n-2xxhsW8YunjRgLBKWlyykbIi0mmatJ.webp`,
    alt: "Galo e galinha de grande porte em pátio cercado por tela",
    caption: "Aves em área cercada.",
    verified: false,
    placeholderLabel: "[FOTO REAL: AMBIENTE DE CRIAÇÃO]",
  },
  {
    id: "manejo-1",
    category: "manejo",
    src: `${BLOB}/1787013919604-774129610_4741399636138676_178565116144598150_n-H30UWBFf4GuLNwDiVPoWO6M0Mv9dR7.jpeg`,
    alt: "Galinhas de plumagens variadas se alimentando em um comedouro no chão",
    caption: "Hora da alimentação.",
    verified: false,
    placeholderLabel: "[FOTO REAL: ROTINA DE MANEJO]",
  },
  {
    id: "pintinhos-1",
    category: "pintinhos",
    src: `${BLOB}/1788709496651-franguinhos-XPWOMMVaElNGi3nf8qSR1R2L7qq7kK.webp`,
    alt: "Grupo de frangos jovens de plumagem pintada reunidos em um abrigo",
    caption: "Frangos jovens em fase de crescimento.",
    verified: false,
    placeholderLabel: "[FOTO REAL: PINTINHOS E DESENVOLVIMENTO]",
  },
  {
    id: "reprodutores-2",
    category: "reprodutores",
    src: `${BLOB}/1787012740811-1-MWT3HrT4kiciHDdwynDSd4Aq6Otppe.webp`,
    alt: "Galo de plumagem vermelha e porte alto em pé sobre um banco, diante de uma janela",
    caption: "Galo de grande porte.",
    verified: false,
    placeholderLabel: "[FOTO REAL: REPRODUTOR]",
  },
];

export const productionContent: SobreContent = {
  mode: "production",

  seo: {
    title: "Institucional | Galinha GSB: quem cria, a raça e como trabalhamos",
    description:
      "Quem está por trás do Galinha GSB, o que se sabe sobre a raça Sertaneja Balão — origem, porte, temperamento e postura —, como o plantel é cuidado e como comprar ovos e aves.",
    canonical: `${SITE_URL}/sobre`,
    ogImage: `${SITE_URL}/logo.png`,
    noindex: false,
  },

  organization: {
    name: "Galinha GSB",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://instagram.com/galinhasertanejabalao",
      "https://www.youtube.com/@galinhasertanejobalao",
    ],
  },

  hero: {
    eyebrow: "Institucional",
    title: "Quem cria, a raça e como trabalhamos",
    subtitle:
      "Um projeto dedicado ao conhecimento, à criação responsável e à valorização da Galinha Sertaneja Balão.",
    intro:
      "O Galinha GSB reúne em um só lugar o trabalho de um criador com a raça Sertanejo Balão e o conteúdo que ele produz para quem quer conhecê-la de verdade: artigos, um guia organizado por temas e um catálogo com animais do próprio plantel.",
    image: {
      src: `${BLOB}/1787012740811-1-MWT3HrT4kiciHDdwynDSd4Aq6Otppe.webp`,
      alt: "Galo Sertanejo Balão de plumagem vermelha e grande porte",
      verified: false, // [CONFIRMAR: foto do plantel do responsável?]
      placeholderLabel: "[FOTOGRAFIA REAL DE UMA GALINHA GSB DO PLANTEL]",
      width: 1200,
      height: 1500,
    },
    primaryCta: { label: "Conheça nosso trabalho", href: "#como-trabalhamos", verified: true },
    secondaryCta: { ...links.blog, label: "Explorar nosso blog" },
    facts: [
      { label: "Raça em foco", value: "Sertaneja Balão (GSB)" },
      { label: "Responsável", value: "Leonardo Reis" },
      { label: "Experiência declarada", value: "Mais de 10 anos com a raça" },
      { label: "Conteúdo", value: "Blog e Guia da GSB" },
    ],
  },

  story: {
    eyebrow: "Nossa história",
    title: "De um pequeno lote a um portal sobre a raça",
    lead:
      "O Galinha GSB não começou como site. Começou no galinheiro, com observação diária, perguntas sem resposta fácil e a vontade de entender melhor uma raça brasileira que ainda tem pouco material publicado em português.",
    chapters: [
      {
        marker: "[ANO DE INÍCIO CONFIRMADO]",
        title: "O começo",
        text: "Leonardo Reis começou com um pequeno lote de Sertanejo Balão adquirido de um criador da região. O que era curiosidade virou rotina: acompanhar as aves, anotar o que via e aprender com cada fase.",
      },
      {
        title: "O que chamou atenção na raça",
        text: "A combinação de rusticidade, temperamento tranquilo e uma silhueta inconfundível — plumagem solta, peito largo, porte de ave criada a campo — foi o que fez a raça deixar de ser uma entre várias e passar a ser o foco do trabalho.",
      },
      {
        marker: "Ao longo dos anos",
        title: "Seleção acompanhada de perto",
        text: "Com o tempo vieram a escolha dos reprodutores, o acompanhamento linhagem por linhagem e o crescimento gradual do plantel, sem atalhos.",
      },
      {
        marker: "[ANO DE LANÇAMENTO DO SITE]",
        title: "Um portal para reunir o que estava disperso",
        text: "O Galinha GSB nasceu para juntar em um só lugar duas frentes que já existiam de forma espalhada: publicar conteúdo sobre a raça e apresentar os animais do próprio plantel a quem quer criar com qualidade.",
      },
      {
        marker: "Hoje",
        title: "Conteúdo, plantel e conversa direta",
        text: "O portal reúne o blog, o Guia da GSB — com oito temas no site e uma versão completa em PDF — e o catálogo. Quem entra em contato fala diretamente com o criador.",
      },
    ],
    closing:
      "O objetivo continua o mesmo: ajudar a formar uma comunidade de criadores mais bem informada, aprendendo e corrigindo o rumo sempre que for preciso.",
  },

  responsible: {
    isFictional: false,
    name: "Leonardo Reis",
    role: "Criador e responsável pelo plantel e pelos conteúdos",
    photo: {
      src: LEONARDO_PHOTO,
      alt: "Leonardo Reis, criador e responsável pelo Galinha GSB",
      verified: true,
      placeholderLabel: "[FOTOGRAFIA REAL DO RESPONSÁVEL]",
      width: 800,
      height: 1000,
    },
    bio: [
      "Leonardo Reis cria galinhas da raça Sertanejo Balão há mais de dez anos. Começou com um pequeno lote adquirido de um criador da região e, desde então, seleciona os reprodutores linhagem por linhagem, acompanhando o plantel ao longo dos anos.",
      "É ele quem escreve os artigos do blog e o Guia da GSB, a partir do que aprendeu na prática com o próprio plantel, complementado pela literatura técnica disponível sobre avicultura de raças locais. Também é quem responde as mensagens de quem procura o portal.",
      "Os textos têm caráter informativo e não substituem a orientação de um médico-veterinário ou zootecnista, principalmente em casos de doença, vacinação e uso de medicamentos.",
    ],
    details: [
      { label: "Área de atuação", value: "Criação e seleção da Sertanejo Balão; produção de conteúdo sobre a raça" },
      { label: "Experiência declarada", value: "Mais de 10 anos com a raça" },
      { label: "Início da criação", value: "[ANO DE INÍCIO CONFIRMADO]" },
      { label: "Localização", value: "[CIDADE/UF CONFIRMADA]" },
    ],
    articlesLink: { ...links.autor, label: "Ver artigos publicados" },
    contactLink: { ...links.contato, label: "Entrar em contato" },
    profileUrl: `${SITE_URL}/autor/leonardo-reis`,
  },

  purpose: sharedPurpose,

  practices: {
    intro:
      "Separamos aqui o que é prática declarada do criatório e o que são princípios de manejo que o portal defende e explica nos seus conteúdos.",
    image: {
      src: null,
      alt: "Rotina de manejo do plantel",
      verified: false,
      placeholderLabel: "[FOTOGRAFIA REAL DA ROTINA DE MANEJO]",
      width: 1200,
      height: 900,
    },
    items: [
      {
        icon: "eye",
        kind: "pratica",
        title: "Observação e acompanhamento do plantel",
        text: "O plantel é acompanhado de perto ao longo dos anos. Comportamento, apetite, plumagem e desenvolvimento dizem muito sobre a saúde das aves — e orientam as decisões de seleção.",
        link: { ...links.guiaSanidade, label: "Guia: observação diária" },
      },
      {
        icon: "wheat",
        kind: "principio",
        title: "Alimentação adequada às necessidades das aves",
        text: "Defendemos alimentação ajustada a cada fase — pintinho, crescimento, postura e reprodução —, com água limpa sempre disponível e mudanças feitas de forma gradual.",
        link: { ...links.guiaManejo, label: "Guia: manejo e alimentação" },
      },
      {
        icon: "house",
        kind: "principio",
        title: "Instalações, higiene e bem-estar",
        text: "Aves de grande porte precisam de espaço, poleiros firmes e baixos, ninhos proporcionais, sombra, ventilação e cama limpa. Higiene e proteção contra predadores fazem parte do básico.",
        link: { ...links.artigoGalinheiro, label: "Artigo: galinheiro ideal" },
      },
      {
        icon: "dna",
        kind: "pratica",
        title: "Reprodução e seleção responsável",
        text: "Os reprodutores são escolhidos linhagem por linhagem. No guia, explicamos critérios de seleção, cuidados com consanguinidade e o registro de acasalamentos.",
        link: { ...links.guiaSelecao, label: "Guia: seleção de reprodutores" },
      },
      {
        icon: "messages",
        kind: "pratica",
        title: "Orientação transparente aos interessados",
        text: "Quem responde as mensagens é o próprio criador. A disponibilidade de ovos e aves muda conforme a época e a fase do plantel, por isso orientamos consultar antes de qualquer compra.",
        link: { ...links.contato, label: "Falar com o criador" },
      },
    ],
  },

  editorial: {
    title: "Informação responsável, conhecimento acessível",
    intro: [
      "Os artigos e o Guia da GSB são escritos por um responsável identificado, a partir da experiência com o próprio plantel e de consulta à literatura técnica sobre avicultura de raças locais.",
      "Os compromissos abaixo resumem como os conteúdos são produzidos, revisados e corrigidos. A versão completa está na política editorial do site.",
    ],
    status: "vigente",
    policyLink: links.politicaEditorial,
    commitments: sharedEditorialCommitments,
    blogLink: { ...links.blog, label: "Acessar o blog" },
    disclosureLinks: [links.publicidade, links.afiliados],
  },

  breed: sharedBreed,

  hub: sharedHub,

  gallery: {
    intro:
      "Registros do dia a dia da criação. Usamos apenas fotografias reais — imagens ilustrativas nunca são apresentadas como registro do plantel.",
    items: galleryItems,
  },

  transparency: {
    intro:
      "Confiança se constrói com informação clara sobre quem somos, o que fazemos e como o site se sustenta.",
    points: [
      {
        icon: "scale",
        title: "Finalidade educativa e comercial",
        text: "O portal publica conteúdo gratuito e também apresenta ovos férteis e aves do plantel. O site exibe anúncios e pode conter links afiliados, sempre identificados.",
      },
      {
        icon: "user",
        title: "Responsável identificado",
        text: "Leonardo Reis responde pelo plantel e pelos conteúdos publicados. Sua página de autor reúne os artigos assinados.",
      },
      {
        icon: "refresh",
        title: "Correção de informações",
        text: "Encontrou um erro ou uma informação desatualizada? Avise pelos canais de contato para que o conteúdo seja revisado.",
      },
      {
        icon: "mail",
        title: "Canais de contato abertos",
        text: "WhatsApp, e-mail e redes sociais oficiais estão listados na página de contato.",
      },
      {
        icon: "file-text",
        title: "Referências técnicas",
        text: "Temas técnicos são complementados por literatura de avicultura, e relatos de experiência são apresentados como tal.",
      },
      {
        icon: "stethoscope",
        title: "Orientação profissional",
        text: "Questões sanitárias, vacinação e uso de medicamentos exigem avaliação de médico-veterinário. Nossos textos não substituem essa orientação.",
      },
    ],
    links: sharedTransparencyLinks,
  },

  faq: [
    {
      question: "O que é o Galinha GSB?",
      answer:
        "É um portal dedicado à Galinha Sertaneja Balão (GSB). Reúne artigos, o Guia da GSB e um catálogo com animais do plantel do criador responsável, Leonardo Reis.",
    },
    {
      question: "Qual é o objetivo do portal?",
      answer:
        "Oferecer informação acessível, em português, sobre a raça — origem, características, manejo, reprodução e saúde — e incentivar uma criação mais consciente.",
    },
    {
      question: "Quem produz os conteúdos publicados?",
      answer:
        "Os textos são escritos por Leonardo Reis, criador da raça, a partir da experiência com o próprio plantel e de consulta à literatura técnica disponível.",
      link: { ...links.autor, label: "Ver página do autor" },
    },
    {
      question: "O site também apresenta ovos férteis e aves?",
      answer:
        "Sim. O catálogo apresenta ovos férteis, pintinhos, galinhas e galos reprodutores do próprio plantel. A disponibilidade muda conforme a época, então vale consultar antes de comprar.",
      link: { ...links.catalogo, label: "Ver o catálogo" },
    },
    {
      question: "Como posso entrar em contato?",
      answer:
        "Pelo WhatsApp, por e-mail ou pelo formulário da página de contato, que abre a mensagem pronta no WhatsApp do criador.",
      link: { ...links.contato, label: "Ir para o contato" },
    },
    {
      question: "As informações substituem orientação veterinária?",
      answer:
        "Não. O conteúdo é informativo. Em casos de doença, vacinação, uso de medicamentos ou qualquer sinal de alerta, procure um médico-veterinário.",
    },
    {
      question: "Como posso acompanhar novos artigos?",
      answer:
        "Os artigos novos aparecem primeiro no blog. Você também pode acompanhar o projeto pelo Instagram e pelo canal no YouTube.",
      link: { ...links.blog, label: "Ir para o blog" },
    },
    {
      question: "Quanto pesa uma Galinha GSB adulta?",
      answer:
        "Em exemplares bem desenvolvidos, a faixa de referência fica em torno de 6 a 8 kg nos machos e 4 a 6 kg nas fêmeas. Linhagem, idade, alimentação e manejo fazem esse número variar.",
      link: { label: "Ler a comparação com Índio Gigante e Brahma", href: "/blog/sertaneja-balao-x-indio-gigante-x-brahma-qual-e-realmente-a-maior-galinha-do-brasil", verified: true },
    },
    {
      question: "A Galinha Sertaneja Balão é mansa?",
      answer:
        "Criadores costumam descrevê-la como dócil, ativa e fácil de manejar. O temperamento também depende da convivência: aves manejadas com calma desde cedo tendem a ser mais tranquilas.",
      link: { label: "Ler sobre o temperamento da GSB", href: "/blog/galinha-sertaneja-balao-e-mansa-descubra-o-temperamento-da-gsb", verified: true },
    },
    {
      question: "Quantos ovos a GSB põe por ano?",
      answer:
        "Em boas condições de manejo, uma fêmea adulta e saudável põe em média entre 160 e 260 ovos por ano. A postura começa por volta de 5 a 6 meses de idade.",
      link: { label: "Ler sobre a produção de ovos", href: "/blog/quantos-ovos-a-galinha-gsb-poe-por-ano-producao-media-e-como-aumentar", verified: true },
    },
    {
      question: "Como funciona a compra de ovos férteis e aves?",
      answer:
        "Você escolhe no catálogo e fala com o criador pelo WhatsApp. Disponibilidade, pagamento e entrega ou retirada são combinados na conversa — o transporte de aves vivas e ovos férteis segue regras sanitárias.",
      link: { ...links.catalogo, label: "Ver o catálogo" },
    },
    {
      question: "Onde encontro informações sobre a raça Sertaneja Balão?",
      answer:
        "No Guia da GSB, organizado em oito temas no site, e na versão completa em PDF, que pode ser baixada gratuitamente.",
      link: { ...links.guia, label: "Abrir o Guia da GSB" },
    },
  ],

  cta: {
    title: "Conheça mais sobre a Galinha Sertaneja Balão",
    text: "Explore nossos conteúdos, conheça as características da raça e encontre informações para desenvolver uma criação mais consciente e bem orientada.",
    primary: { ...links.blog, label: "Explorar artigos" },
    secondary: { ...links.contato, label: "Entrar em contato" },
  },

  contacts: [
    {
      kind: "whatsapp",
      label: "WhatsApp",
      value: "+55 31 98625-0673",
      href: "https://wa.me/5531986250673?text=Ol%C3%A1!%20Li%20a%20p%C3%A1gina%20Sobre%20e%20gostaria%20de%20conversar.",
    },
    {
      kind: "email",
      label: "E-mail",
      value: "galinhabalaosertanejo@gmail.com",
      href: "mailto:galinhabalaosertanejo@gmail.com",
    },
    {
      kind: "instagram",
      label: "Instagram",
      value: "@galinhasertanejabalao",
      href: "https://instagram.com/galinhasertanejabalao",
    },
    {
      kind: "youtube",
      label: "YouTube",
      value: "@galinhasertanejobalao",
      href: "https://www.youtube.com/@galinhasertanejobalao",
    },
  ],
};

