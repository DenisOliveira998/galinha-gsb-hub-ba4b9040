/**
 * Tipos do conteúdo da página "Sobre" do Galinha GSB.
 *
 * Convenção de campos pendentes: qualquer texto escrito entre colchetes,
 * como "[ANO DE INÍCIO CONFIRMADO]", é tratado como PENDENTE.
 * - Em modo revisão (dev ou VITE_SOBRE_REVIEW=true) aparece destacado em âmbar.
 * - Em produção final o campo pendente é simplesmente omitido da página.
 */

export type ContentMode = "demo" | "production";

/** Nomes de ícones resolvidos em src/components/sobre/icons.tsx */
export type IconName =
  | "eye"
  | "wheat"
  | "house"
  | "dna"
  | "messages"
  | "target"
  | "telescope"
  | "heart-handshake"
  | "book-open"
  | "file-down"
  | "store"
  | "sprout"
  | "stethoscope"
  | "mail"
  | "shield-check"
  | "user"
  | "file-text"
  | "refresh"
  | "scale"
  | "megaphone"
  | "feather"
  | "leaf"
  | "users"
  | "clipboard-check";

export type LinkItem = {
  label: string;
  href: string;
  /** Abre em nova aba (WhatsApp, redes sociais, PDF). */
  external?: boolean;
  /** true = caminho conferido no site em produção. */
  verified: boolean;
};

export type ImageAsset = {
  /** null = ainda não há fotografia → exibe espaço reservado. */
  src: string | null;
  alt: string;
  caption?: string;
  /**
   * true = foto confirmada como do acervo real do projeto.
   * Fotos com verified=false só aparecem em modo revisão.
   */
  verified: boolean;
  /** Texto mostrado no espaço reservado quando não há foto publicável. */
  placeholderLabel: string;
  width?: number;
  height?: number;
};

export type Fact = { label: string; value: string };

export type StoryChapter = {
  /** Ano ou marco. Use colchetes para pendências: "[ANO CONFIRMADO]". */
  marker?: string;
  title: string;
  text: string;
};

export type PracticeKind = "pratica" | "principio";

export type Practice = {
  icon: IconName;
  title: string;
  text: string;
  /**
   * "pratica"   → procedimento declarado/confirmado pelo responsável.
   * "principio" → orientação de manejo defendida pelo portal, sem afirmar
   *               que é executada no criatório.
   */
  kind: PracticeKind;
  link?: LinkItem;
};

export type GalleryCategory =
  | "plantel"
  | "ambiente"
  | "reprodutores"
  | "pintinhos"
  | "manejo";

export type GalleryItem = ImageAsset & { id: string; category: GalleryCategory };

export type HubItem = {
  icon: IconName;
  title: string;
  description: string;
  link: LinkItem;
};

export type FaqItem = { question: string; answer: string; link?: LinkItem };

export type ContactChannel = {
  kind: "whatsapp" | "email" | "instagram" | "youtube" | "page";
  label: string;
  value: string;
  href: string;
};

export type SobreContent = {
  mode: ContentMode;
  /** Mensagem exibida no topo quando o conteúdo é de demonstração. */
  demoNotice?: string;

  seo: {
    title: string;
    description: string;
    canonical: string;
    ogImage: string;
    /** Demonstração nunca deve ser indexada. */
    noindex: boolean;
  };

  organization: {
    name: string;
    url: string;
    logo: string;
    sameAs: string[];
  };

  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    intro: string;
    image: ImageAsset;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    facts: Fact[];
  };

  story: {
    eyebrow: string;
    title: string;
    lead: string;
    chapters: StoryChapter[];
    closing: string;
  };

  responsible: {
    isFictional: boolean;
    name: string;
    role: string;
    photo: ImageAsset;
    bio: string[];
    details: Fact[];
    values?: string[];
    articlesLink: LinkItem;
    contactLink: LinkItem;
    /** Só usado no JSON-LD de produção. Deixe vazio se não confirmado. */
    profileUrl?: string;
  };

  purpose: {
    mission: string;
    vision: string;
    values: string[];
  };

  practices: {
    intro: string;
    image: ImageAsset;
    items: Practice[];
  };

  editorial: {
    title: string;
    intro: string[];
    /** "proposta" enquanto não existir uma política editorial publicada. */
    status: "vigente" | "proposta";
    policyLink?: LinkItem;
    commitments: string[];
    blogLink: LinkItem;
    disclosureLinks: LinkItem[];
  };

  breed: {
    title: string;
    paragraphs: string[];
    highlights: { title: string; text: string }[];
    image: ImageAsset;
    links: LinkItem[];
  };

  hub: { intro: string; items: HubItem[] };

  gallery: { intro: string; items: GalleryItem[] };

  transparency: {
    intro: string;
    points: { icon: IconName; title: string; text: string }[];
    links: LinkItem[];
  };

  faq: FaqItem[];

  cta: {
    title: string;
    text: string;
    primary: LinkItem;
    secondary: LinkItem;
  };

  contacts: ContactChannel[];
};
