import { create } from "zustand";
import chicksImage from "@/assets/category-chicks.jpg";

export type Category = "OVOS_FERTEIS" | "PINTINHOS" | "MATRIZES" | "REPRODUTORES";
export type PostStatus = "DRAFT" | "PUBLISHED" | "SOLD";

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
}

export interface SiteSettings {
  whatsapp: string;
  instagram: string;
  email: string;
  aboutText: string;
  heroImage: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  OVOS_FERTEIS: "Ovos férteis",
  PINTINHOS: "Galinhas",
  MATRIZES: "Matrizes",
  REPRODUTORES: "Reprodutores",
};

export const CATEGORY_PLACEHOLDERS: Record<Category, string> = {
  OVOS_FERTEIS:
    "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=1200&q=80",
  PINTINHOS:
    chicksImage,
  MATRIZES:
    "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200&q=80",
  REPRODUTORES:
    "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=1200&q=80",
};

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
      "Dúzia de ovos férteis da raça Sertanejo Balão, coletados de matrizes selecionadas. Alta taxa de eclosão e procedência garantida.",
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
    id: "3",
    title: "Matriz GSB adulta",
    slug: "matriz-gsb-adulta",
    category: "MATRIZES",
    description:
      "Matriz adulta em plena postura, linhagem tradicional. Ideal para iniciar ou reforçar seu plantel.",
    price: 380,
    status: "PUBLISHED",
    images: [CATEGORY_PLACEHOLDERS.MATRIZES],
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
    coverImage:
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&q=80",
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
  instagram: "@instagram_do_criador",
  email: "email@exemplo.com",
  aboutText:
    "A Galinha GSB (Sertanejo Balão) é uma raça tradicional brasileira, criada com dedicação em nosso plantel há muitos anos. Trabalhamos com procedência garantida, suporte ao criador e amor pela avicultura sertaneja.",
  heroImage:
    "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=1400&q=80",
};

interface State {
  isAuthenticated: boolean;
  posts: Post[];
  blog: BlogPost[];
  settings: SiteSettings;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addPost: (p: Omit<Post, "id" | "slug" | "createdAt">) => Post;
  updatePost: (id: string, p: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addBlog: (b: Omit<BlogPost, "id" | "slug" | "createdAt">) => BlogPost;
  updateBlog: (id: string, b: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;
  updateSettings: (s: Partial<SiteSettings>) => void;
}

// Mock in-memory store. Substitua por integração com TiDB Cloud + Prisma
// quando conectar o banco real.
export const useStore = create<State>((set, get) => ({
  isAuthenticated: false,
  posts: initialPosts,
  blog: initialBlog,
  settings: initialSettings,
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
      images: p.images.length ? p.images : [CATEGORY_PLACEHOLDERS[p.category]],
    };
    set({ posts: [post, ...get().posts] });
    return post;
  },
  updatePost: (id, patch) =>
    set({
      posts: get().posts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }),
  deletePost: (id) =>
    set({ posts: get().posts.filter((p) => p.id !== id) }),
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
}));