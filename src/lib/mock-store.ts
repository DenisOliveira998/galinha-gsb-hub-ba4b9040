import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import chicksImage from "@/assets/category-chicks.jpg";

/** Categorias são dinâmicas (gerenciadas no admin) — o id é uma string livre. */
export type Category = string;

export interface CategoryItem {
  id: string;
  label: string;
  image?: string;
}
export type PostStatus = "DRAFT" | "PUBLISHED" | "SOLD";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Comment {
  id: string;
  postId: string;
  name: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: Category;
  description: string;
  price?: number;
  status: PostStatus;
  images: string[];
  createdAt: string;
  /** Perguntas e respostas cadastradas manualmente no admin. */
  faq?: FaqItem[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  createdAt: string;
  /** Imagens numeradas adicionais (galeria do post). */
  images?: string[];
  /** Blocos alternados de texto e imagem que compõem o corpo do post. */
  blocks?: BlogBlock[];
}

export interface BlogBlock {
  id: string;
  type: "text" | "image";
  text?: string;
  image?: string;
}

export interface SiteSettings {
  whatsapp: string;
  /** Link completo do WhatsApp, ex: https://wa.me/5511999999999 */
  whatsappLink: string;
  instagram: string;
  email: string;
  aboutText: string;
  /** Cor principal da marca (hex), configurável em Configurações -> Aparência. */
  brandColor: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaTo: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  OVOS_FERTEIS: "Ovos férteis",
  PINTINHOS: "Galinhas",
  REPRODUTORES: "Reprodutores",
};

export const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  OVOS_FERTEIS:
    "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=1200&q=80",
  PINTINHOS:
    chicksImage,
  REPRODUTORES:
    "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=1200&q=80",
};

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "OVOS_FERTEIS", label: "Ovos férteis", image: CATEGORY_PLACEHOLDERS.OVOS_FERTEIS },
  { id: "PINTINHOS", label: "Galinhas", image: CATEGORY_PLACEHOLDERS.PINTINHOS },
  { id: "REPRODUTORES", label: "Reprodutores", image: CATEGORY_PLACEHOLDERS.REPRODUTORES },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const initialPosts: Post[] = [
  {
    id: "1",
    title: "Ovos férteis GSB — dúzia selecionada",
    slug: "ovos-ferteis-gsb-duzia",
    category: "OVOS_FERTEIS",
    description:
      "Dúzia de ovos férteis da raça Sertanejo Balão, coletados de aves selecionadas. Alta taxa de eclosão e procedência garantida.",
    price: 120,
    status: "PUBLISHED",
    images: [CATEGORY_PLACEHOLDERS.OVOS_FERTEIS],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Pintinhos GSB — 15 dias",
    slug: "pintinhos-gsb-15-dias",
    category: "PINTINHOS",
    description:
      "Pintinhos saudáveis com 15 dias de vida, vacinados e prontos para o novo criador.",
    price: 45,
    status: "PUBLISHED",
    images: [CATEGORY_PLACEHOLDERS.PINTINHOS],
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Reprodutor GSB — linhagem pura",
    slug: "reprodutor-gsb-linhagem-pura",
    category: "REPRODUTORES",
    description:
      "Galo reprodutor Sertanejo Balão de linhagem pura, excelente conformação e postura.",
    price: 550,
    status: "PUBLISHED",
    images: [CATEGORY_PLACEHOLDERS.REPRODUTORES],
    createdAt: new Date().toISOString(),
  },
];

const initialBlog: BlogPost[] = [
  {
    id: "b1",
    title: "Como cuidar de pintinhos GSB nos primeiros dias",
    slug: "cuidados-pintinhos-primeiros-dias",
    excerpt:
      "Guia rápido com temperatura, alimentação e manejo para receber pintinhos saudáveis.",
    content:
      "Nos primeiros dias, o cuidado com temperatura, ração e água é decisivo para a sobrevivência dos pintinhos. Mantenha o pinteiro entre 32 e 35 °C na primeira semana...",
    coverImage: chicksImage,
    published: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "b2",
    title: "A importância da raça Sertanejo Balão",
    slug: "importancia-raca-sertanejo-balao",
    excerpt:
      "Conheça a história, características e valor cultural da raça GSB no sertão brasileiro.",
    content:
      "A Sertanejo Balão é uma raça tradicional do sertão nordestino, resultado de décadas de seleção. Sua rusticidade e beleza única a tornam...",
    coverImage:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200&q=80",
    published: true,
    createdAt: new Date().toISOString(),
  },
];

const initialSettings: SiteSettings = {
  whatsapp: "(00) 00000-0000",
  whatsappLink: "https://wa.me/5500000000000",
  instagram: "@instagram_do_criador",
  email: "email@exemplo.com",
  aboutText:
    "A Galinha GSB (Sertanejo Balão) é uma raça tradicional brasileira, criada com dedicação em nosso plantel há muitos anos. Trabalhamos com procedência garantida, suporte ao criador e amor pela avicultura sertaneja.",
  brandColor: DEFAULT_BRAND_COLOR,
};

const initialHeroSlides: HeroSlide[] = [
  {
    id: "h1",
    image:
      "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=1600&q=80",
    title: "Conheça a raça GSB",
    subtitle: "Ovos férteis, galinhas e reprodutores da linhagem Sertanejo Balão.",
    ctaLabel: "Ver catálogo",
    ctaTo: "/catalogo",
  },
  {
    id: "h2",
    image: chicksImage,
    title: "Pintinhos saudáveis",
    subtitle: "Aves selecionadas, com procedência garantida e suporte ao criador.",
    ctaLabel: "Ver anúncios",
    ctaTo: "/catalogo",
  },
  {
    id: "h3",
    image:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1600&q=80",
    title: "Tradição no plantel",
    subtitle: "Mais de 10 anos de dedicação à avicultura sertaneja.",
    ctaLabel: "Sobre a raça",
    ctaTo: "/sobre",
  },
];

interface State {
  isAuthenticated: boolean;
  posts: Post[];
  blog: BlogPost[];
  settings: SiteSettings;
  heroSlides: HeroSlide[];
  categories: CategoryItem[];
  categoryImages: Record<string, string[]>;
  mediaLibrary: string[];
  /** Comentários por anúncio (mock). */
  comments: Comment[];
  /** Notas 1–5 por anúncio (mock). */
  ratings: Record<string, number[]>;
  /** Nota dada pelo visitante atual, por anúncio. */
  myRatings: Record<string, number>;
  /** IDs de anúncios favoritados. */
  favorites: string[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addPost: (p: Omit<Post, "id" | "slug" | "createdAt">) => Post;
  updatePost: (id: string, p: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addBlog: (b: Omit<BlogPost, "id" | "slug" | "createdAt">) => BlogPost;
  updateBlog: (id: string, b: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;
  updateSettings: (s: Partial<SiteSettings>) => void;
  addCategory: (label: string, image?: string) => CategoryItem;
  updateCategory: (id: string, patch: Partial<Omit<CategoryItem, "id">>) => void;
  deleteCategory: (id: string) => void;
  moveCategory: (id: string, dir: -1 | 1) => void;
  addHeroSlide: (s: Omit<HeroSlide, "id">) => void;
  updateHeroSlide: (id: string, s: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;
  moveHeroSlide: (id: string, dir: -1 | 1) => void;
  addHeroSlides: (images: string[]) => void;
  addCategoryImages: (c: Category, images: string[]) => void;
  updateCategoryImage: (c: Category, index: number, image: string) => void;
  deleteCategoryImage: (c: Category, index: number) => void;
  moveCategoryImage: (c: Category, index: number, dir: -1 | 1) => void;
  addMedia: (images: string[]) => void;
  deleteMedia: (image: string) => void;
  addComment: (postId: string, name: string, text: string) => void;
  deleteComment: (id: string) => void;
  ratePost: (postId: string, value: number) => void;
  toggleFavorite: (postId: string) => void;
}

// Mock in-memory store. Substitua por integração com TiDB Cloud + Prisma
// quando conectar o banco real.
export const useStore = create<State>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      posts: initialPosts,
      blog: initialBlog,
      settings: initialSettings,
      heroSlides: initialHeroSlides,
      categories: DEFAULT_CATEGORIES,
      categoryImages: {
        OVOS_FERTEIS: [CATEGORY_PLACEHOLDERS.OVOS_FERTEIS],
        PINTINHOS: [CATEGORY_PLACEHOLDERS.PINTINHOS],
        REPRODUTORES: [CATEGORY_PLACEHOLDERS.REPRODUTORES],
      },
      mediaLibrary: [
        ...initialHeroSlides.map((s) => s.image),
        CATEGORY_PLACEHOLDERS.OVOS_FERTEIS,
        CATEGORY_PLACEHOLDERS.PINTINHOS,
        CATEGORY_PLACEHOLDERS.REPRODUTORES,
      ],
      comments: [],
      ratings: {},
      myRatings: {},
      favorites: [],
      login: (email, password) => {
    // Credenciais mockadas — trocar por auth real depois
    if (email === "admin@galinhagsb.com" && password === "admin123") {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
      },
      logout: () => set({ isAuthenticated: false }),
      addPost: (p) => {
    const post: Post = {
      ...p,
      id: crypto.randomUUID(),
      slug: slugify(p.title) + "-" + Math.random().toString(36).slice(2, 6),
      createdAt: new Date().toISOString(),
      images: p.images.length
        ? p.images
        : [categoryImage(get().categories, get().categoryImages, p.category)],
    };
    set({ posts: [post, ...get().posts] });
    return post;
      },
      updatePost: (id, patch) =>
    set({
      posts: get().posts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }),
      deletePost: (id) =>
        set((s) => {
          const { [id]: _r, ...ratings } = s.ratings ?? {};
          const { [id]: _m, ...myRatings } = s.myRatings ?? {};
          return {
            posts: s.posts.filter((p) => p.id !== id),
            comments: (s.comments ?? []).filter((c) => c.postId !== id),
            favorites: (s.favorites ?? []).filter((f) => f !== id),
            ratings,
            myRatings,
          };
        }),
      addBlog: (b) => {
    const post: BlogPost = {
      ...b,
      id: crypto.randomUUID(),
      slug: slugify(b.title) + "-" + Math.random().toString(36).slice(2, 6),
      createdAt: new Date().toISOString(),
    };
    set({ blog: [post, ...get().blog] });
    return post;
      },
      updateBlog: (id, patch) =>
    set({
      blog: get().blog.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }),
      deleteBlog: (id) =>
    set({ blog: get().blog.filter((b) => b.id !== id) }),
      updateSettings: (s) =>
        set({ settings: { ...get().settings, ...s } }),
      addCategory: (label, image) => {
        const base = slugify(label).replace(/-/g, "_").toUpperCase() || "CATEGORIA";
        const existing = new Set((get().categories ?? []).map((c) => c.id));
        let id = base;
        let n = 2;
        while (existing.has(id)) id = `${base}_${n++}`;
        const item: CategoryItem = { id, label: label.trim(), image };
        set({ categories: [...(get().categories ?? []), item] });
        if (image) get().addMedia([image]);
        return item;
      },
      updateCategory: (id, patch) => {
        set({
          categories: (get().categories ?? []).map((c) =>
            c.id === id ? { ...c, ...patch } : c,
          ),
        });
        if (patch.image) get().addMedia([patch.image]);
      },
      deleteCategory: (id) =>
        set((s) => {
          const { [id]: _drop, ...categoryImages } = s.categoryImages ?? {};
          return {
            categories: (s.categories ?? []).filter((c) => c.id !== id),
            categoryImages,
          };
        }),
      moveCategory: (id, dir) => {
        const list = [...(get().categories ?? [])];
        const i = list.findIndex((c) => c.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= list.length) return;
        [list[i], list[j]] = [list[j], list[i]];
        set({ categories: list });
      },
      addHeroSlide: (s) =>
        set({ heroSlides: [...get().heroSlides, { ...s, id: crypto.randomUUID() }] }),
      updateHeroSlide: (id, patch) => {
        if (patch.image) get().addMedia([patch.image]);
        set({
          heroSlides: get().heroSlides.map((s) =>
            s.id === id ? { ...s, ...patch } : s,
          ),
        });
      },
      deleteHeroSlide: (id) =>
        set({ heroSlides: get().heroSlides.filter((s) => s.id !== id) }),
      addHeroSlides: (images) => {
        if (!images.length) return;
        set({
          heroSlides: [
            ...get().heroSlides,
            ...images.map((image) => ({
              id: crypto.randomUUID(),
              image,
              title: "Novo destaque",
              subtitle: "",
              ctaLabel: "Ver catálogo",
              ctaTo: "/catalogo",
            })),
          ],
        });
        get().addMedia(images);
      },
      addCategoryImages: (c, images) => {
        if (!images.length) return;
        const current = get().categoryImages;
        set({ categoryImages: { ...current, [c]: [...(current[c] ?? []), ...images] } });
        get().addMedia(images);
      },
      updateCategoryImage: (c, index, image) => {
        const current = get().categoryImages;
        const list = [...(current[c] ?? [])];
        if (index < 0 || index >= list.length) return;
        list[index] = image;
        set({ categoryImages: { ...current, [c]: list } });
        get().addMedia([image]);
      },
      deleteCategoryImage: (c, index) => {
        const current = get().categoryImages;
        set({
          categoryImages: {
            ...current,
            [c]: (current[c] ?? []).filter((_, i) => i !== index),
          },
        });
      },
      moveCategoryImage: (c, index, dir) => {
        const current = get().categoryImages;
        const list = [...(current[c] ?? [])];
        const j = index + dir;
        if (index < 0 || j < 0 || j >= list.length) return;
        [list[index], list[j]] = [list[j], list[index]];
        set({ categoryImages: { ...current, [c]: list } });
      },
      addMedia: (images) => {
        const lib = get().mediaLibrary;
        const next = images.filter((i) => i && !lib.includes(i));
        if (!next.length) return;
        set({ mediaLibrary: [...next, ...lib] });
      },
      deleteMedia: (image) =>
        set({ mediaLibrary: get().mediaLibrary.filter((i) => i !== image) }),
      addComment: (postId, name, text) =>
        set((s) => ({
          comments: [
            ...(s.comments ?? []),
            {
              id: crypto.randomUUID(),
              postId,
              name: name.trim() || "Visitante",
              text: text.trim(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      deleteComment: (id) =>
        set((s) => ({ comments: (s.comments ?? []).filter((c) => c.id !== id) })),
      ratePost: (postId, value) =>
        set((s) => {
          const v = Math.min(5, Math.max(1, Math.round(value)));
          const list = [...((s.ratings ?? {})[postId] ?? [])];
          const mine = (s.myRatings ?? {})[postId];
          if (mine) {
            const i = list.indexOf(mine);
            if (i >= 0) list.splice(i, 1);
          }
          list.push(v);
          return {
            ratings: { ...(s.ratings ?? {}), [postId]: list },
            myRatings: { ...(s.myRatings ?? {}), [postId]: v },
          };
        }),
      toggleFavorite: (postId) =>
        set((s) => {
          const list = s.favorites ?? [];
          const isFav = list.includes(postId);
          // Espelha a mudança no banco (não bloqueia a UI).
          if (typeof window !== "undefined") {
            void import("./favorites-db").then((m) =>
              isFav ? m.removeFavoriteRemote(postId) : m.addFavoriteRemote(postId),
            );
          }
          return {
            favorites: isFav
              ? list.filter((f) => f !== postId)
              : [postId, ...list],
          };
        }),
      moveHeroSlide: (id, dir) => {
        const list = [...get().heroSlides];
        const i = list.findIndex((s) => s.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= list.length) return;
        [list[i], list[j]] = [list[j], list[i]];
        set({ heroSlides: list });
      },
    }),
    {
      name: "gsb-store",
      // SSR-safe + resiliente a limite de cota do localStorage. Se o espaço
      // acabar (imagens em data URL são pesadas), descartamos primeiro o
      // estoque de imagens para que exclusões/edições continuem persistindo.
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? {
              getItem: (n: string) => window.localStorage.getItem(n),
              removeItem: (n: string) => window.localStorage.removeItem(n),
              setItem: (n: string, v: string) => {
                try {
                  window.localStorage.setItem(n, v);
                } catch {
                  try {
                    const parsed = JSON.parse(v);
                    if (parsed?.state) parsed.state.mediaLibrary = [];
                    window.localStorage.setItem(n, JSON.stringify(parsed));
                  } catch {
                    /* espaço insuficiente — mantém apenas em memória */
                  }
                }
              },
            }
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      // Persist only data — never the auth flag.
      partialize: (s) => ({
        posts: s.posts,
        blog: s.blog,
        settings: s.settings,
        heroSlides: s.heroSlides,
        categories: s.categories,
        categoryImages: s.categoryImages,
        mediaLibrary: s.mediaLibrary,
        comments: s.comments,
        ratings: s.ratings,
        myRatings: s.myRatings,
        favorites: s.favorites,
      }),
      version: 7,
      migrate: (persisted: any, version) => {
        if (!persisted) return persisted;
        if (version < 2) {
          persisted.posts = (persisted.posts ?? []).filter(
            (p: any) => p.category !== "MATRIZES",
          );
          persisted.settings = {
            ...initialSettings,
            ...(persisted.settings ?? {}),
          };
          if (!persisted.settings.whatsappLink) {
            persisted.settings.whatsappLink = initialSettings.whatsappLink;
          }
        }
        if (version < 3) {
          if (!persisted.heroSlides?.length) {
            persisted.heroSlides = initialHeroSlides;
          }
        }
        if (version < 4) {
          persisted.categoryImages = persisted.categoryImages ?? {
            OVOS_FERTEIS: [CATEGORY_PLACEHOLDERS.OVOS_FERTEIS],
            PINTINHOS: [CATEGORY_PLACEHOLDERS.PINTINHOS],
            REPRODUTORES: [CATEGORY_PLACEHOLDERS.REPRODUTORES],
          };
          persisted.mediaLibrary = persisted.mediaLibrary ?? [
            ...(persisted.heroSlides ?? []).map((s: any) => s.image),
            CATEGORY_PLACEHOLDERS.OVOS_FERTEIS,
            CATEGORY_PLACEHOLDERS.PINTINHOS,
            CATEGORY_PLACEHOLDERS.REPRODUTORES,
          ];
        }
        if (version < 5) {
          persisted.comments = persisted.comments ?? [];
          persisted.ratings = persisted.ratings ?? {};
          persisted.myRatings = persisted.myRatings ?? {};
          persisted.favorites = persisted.favorites ?? [];
        }
        if (version < 6) {
          if (!persisted.categories?.length) {
            persisted.categories = DEFAULT_CATEGORIES.map((c) => ({
              ...c,
              image: persisted.categoryImages?.[c.id]?.[0] ?? c.image,
            }));
          }
        }
        if (version < 7) {
          persisted.settings = { ...initialSettings, ...(persisted.settings ?? {}) };
          // Campo legado "Hero Imagem" — o hero usa apenas o carrossel agora.
          delete persisted.settings.heroImage;
          if (!persisted.settings.brandColor) {
            persisted.settings.brandColor = DEFAULT_BRAND_COLOR;
          }
        }
        return persisted;
      },
    },
  ),
);
// ---------------------------------------------------------------------------
// Helpers compartilhados — sempre derivam do mesmo store (fonte única).
// ---------------------------------------------------------------------------

/** Normaliza o link do WhatsApp configurado no admin (aceita link ou número). */
export function whatsappHref(settings: SiteSettings, text?: string): string {
  const raw = (settings.whatsappLink || "").trim();
  let base: string;
  if (/^https?:\/\//i.test(raw)) {
    base = raw.split("?")[0].replace(/\/$/, "");
  } else {
    const digits = (raw || settings.whatsapp || "").replace(/\D/g, "");
    base = `https://wa.me/${digits || "5500000000000"}`;
  }
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Data estável entre servidor e cliente (evita mismatch de fuso). */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

/** Média de avaliações de um anúncio (0 quando não há notas). */
export function ratingAverage(ratings: Record<string, number[]> | undefined, postId: string) {
  const list = ratings?.[postId] ?? [];
  if (!list.length) return { average: 0, count: 0 };
  return { average: list.reduce((a, b) => a + b, 0) / list.length, count: list.length };
}

// --------------------------------------------------------------- Categorias

/** Nome exibido de uma categoria (dinâmica, com fallback para as legadas). */
export function categoryLabel(cats: CategoryItem[] | undefined, id: string): string {
  return cats?.find((c) => c.id === id)?.label ?? CATEGORY_LABELS[id] ?? id;
}

/** Imagem de destaque de uma categoria. */
export function categoryImage(
  cats: CategoryItem[] | undefined,
  images: Record<string, string[]> | undefined,
  id: string,
): string {
  return (
    images?.[id]?.[0] ??
    cats?.find((c) => c.id === id)?.image ??
    CATEGORY_PLACEHOLDERS[id] ??
    "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200&q=80"
  );
}

/** Lista de categorias vinda do store (fonte única). */
export function useCategories(): CategoryItem[] {
  return useStore((s) => s.categories) ?? DEFAULT_CATEGORIES;
}

/** Função pronta para exibir o nome de uma categoria em qualquer página. */
export function useCategoryLabel(): (id: string) => string {
  const cats = useCategories();
  return (id: string) => categoryLabel(cats, id);
}
