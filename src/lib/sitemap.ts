// Sitemaps do site (servidos direto pelo src/server.ts, antes do roteador SSR).
//
// Estrutura:
//   /sitemap.xml                → índice que aponta para os 4 sitemaps abaixo
//   /sitemaps/paginas.xml       → home, catálogo, blog e páginas institucionais
//   /sitemaps/guia.xml          → Guia da raça (8 capítulos + PDF)
//   /sitemaps/blog.xml          → artigos publicados (com imagem de capa)
//   /sitemaps/catalogo.xml      → anúncios publicados (com foto principal)
//
// Separar por seção faz o Search Console mostrar a indexação de cada parte
// (ex.: "blog: 18 de 20 indexadas"), o que ajuda a acompanhar o AdSense.
// Páginas noindex (conta, carrinho, admin, catálogo com filtro) ficam de fora.

import { SITE_URL } from "./seo";

// Data da última mudança REAL de conteúdo das páginas fixas. Atualize ao
// editar o texto dessas páginas — o Google ignora lastmod que muda sempre.
const GUIA_UPDATED = "2026-09-27";
const STATIC_PAGES: { path: string; lastmod: string }[] = [
  { path: "/sobre", lastmod: "2026-09-01" },
  { path: "/contato", lastmod: "2026-08-31" },
  { path: "/afiliados", lastmod: "2026-08-02" },
  { path: "/publicidade", lastmod: "2026-08-02" },
  { path: "/privacidade", lastmod: "2026-08-02" },
  { path: "/termos", lastmod: "2026-08-02" },
  { path: "/cookies", lastmod: "2026-08-02" },
];
const GUIA_PAGES = [
  "/guia",
  "/guia/origem",
  "/guia/caracteristicas",
  "/guia/plumagem",
  "/guia/alimentacao",
  "/guia/reproducao",
  "/guia/pintinhos",
  "/guia/selecao",
  "/guia/sanidade",
  "/guia-completo-galinha-gsb-sertaneja-balao.pdf",
];

export const SITEMAP_PATHS = [
  "/sitemap.xml",
  "/sitemaps/paginas.xml",
  "/sitemaps/guia.xml",
  "/sitemaps/blog.xml",
  "/sitemaps/catalogo.xml",
] as const;

type Entry = { loc: string; lastmod?: string; image?: string };
type Content = {
  posts: { slug: string; updatedAt: Date; images: { url: string }[] }[];
  blogs: { slug: string; updatedAt: Date; coverImage: string | null }[];
};

const day = (d: Date) => d.toISOString().split("T")[0];
const latest = (dates: Date[]) => (dates.length ? day(new Date(Math.max(...dates.map((d) => d.getTime())))) : undefined);
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const abs = (url: string) => (/^https?:\/\//i.test(url) ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`);

async function loadContent(): Promise<Content> {
  try {
    const { prisma } = await import("./prisma");
    const [posts, blogs] = await Promise.all([
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        select: {
          slug: true,
          updatedAt: true,
          images: { select: { url: true }, orderBy: { order: "asc" }, take: 1 },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true, coverImage: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);
    return { posts, blogs };
  } catch (err) {
    console.error("[sitemap] falha ao ler o banco", err);
    return { posts: [], blogs: [] };
  }
}

function urlset(entries: Entry[]): string {
  const body = entries
    .map((e) => {
      const parts = [`    <loc>${esc(`${SITE_URL}${e.loc}`)}</loc>`];
      if (e.lastmod) parts.push(`    <lastmod>${e.lastmod}</lastmod>`);
      if (e.image) {
        // Só image:loc — o Google descontinuou image:title/caption em 2022.
        parts.push(`    <image:image>\n      <image:loc>${esc(abs(e.image))}</image:loc>\n    </image:image>`);
      }
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>`;
}

function sitemapIndex(children: { path: string; lastmod?: string }[]): string {
  const body = children
    .map(
      (c) =>
        `  <sitemap>\n    <loc>${SITE_URL}${c.path}</loc>${c.lastmod ? `\n    <lastmod>${c.lastmod}</lastmod>` : ""}\n  </sitemap>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}

function paginasEntries(c: Content): Entry[] {
  const blogLast = latest(c.blogs.map((b) => b.updatedAt));
  const postsLast = latest(c.posts.map((p) => p.updatedAt));
  const homeLast = [blogLast, postsLast, GUIA_UPDATED].filter(Boolean).sort().pop();
  return [
    { loc: "/", lastmod: homeLast },
    { loc: "/catalogo", lastmod: postsLast },
    { loc: "/blog", lastmod: blogLast },
    ...STATIC_PAGES.map((p) => ({ loc: p.path, lastmod: p.lastmod })),
  ];
}

const guiaEntries = (): Entry[] => GUIA_PAGES.map((loc) => ({ loc, lastmod: GUIA_UPDATED }));

const blogEntries = (c: Content): Entry[] =>
  c.blogs.map((b) => ({
    loc: `/blog/${b.slug}`,
    lastmod: day(b.updatedAt),
    ...(b.coverImage ? { image: b.coverImage } : {}),
  }));

const catalogoEntries = (c: Content): Entry[] =>
  c.posts.map((p) => ({
    loc: `/catalogo/${p.slug}`,
    lastmod: day(p.updatedAt),
    ...(p.images[0] ? { image: p.images[0].url } : {}),
  }));

export async function handleSitemap(pathname: string): Promise<Response> {
  const content = await loadContent();
  let xml: string;
  switch (pathname) {
    case "/sitemaps/paginas.xml":
      xml = urlset(paginasEntries(content));
      break;
    case "/sitemaps/guia.xml":
      xml = urlset(guiaEntries());
      break;
    case "/sitemaps/blog.xml":
      xml = urlset(blogEntries(content));
      break;
    case "/sitemaps/catalogo.xml":
      xml = urlset(catalogoEntries(content));
      break;
    default: {
      const pag = paginasEntries(content);
      xml = sitemapIndex([
        { path: "/sitemaps/paginas.xml", lastmod: pag[0].lastmod },
        { path: "/sitemaps/guia.xml", lastmod: GUIA_UPDATED },
        { path: "/sitemaps/blog.xml", lastmod: latest(content.blogs.map((b) => b.updatedAt)) },
        { path: "/sitemaps/catalogo.xml", lastmod: latest(content.posts.map((p) => p.updatedAt)) },
      ]);
    }
  }
  return new Response(xml, {
    status: 200,
    headers: {
      "content-type": "application/xml; charset=utf-8",
      // 10 min na CDN: post novo aparece no sitemap rápido sem bater no banco a cada acesso.
      "cache-control": "public, max-age=0, must-revalidate",
      "cdn-cache-control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
