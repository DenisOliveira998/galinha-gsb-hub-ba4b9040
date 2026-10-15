import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { HeartHandshake, ShieldCheck, Truck } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { AdSlot } from "@/components/site/ad-slot";
import { CicloCriacao } from "@/components/site/ciclo-criacao";
import { CtaBand, ProductCard } from "@/components/site/page-kit";
import { useHydrated } from "@/hooks/use-hydrated";
import { listPosts } from "@/lib/posts";
import { listPublishedBlogSummaries } from "@/lib/blog";
import { listCategories } from "@/lib/categories";
import { getRatingSummary } from "@/lib/ratings";
import { SITE_URL, DEFAULT_OG_IMAGE, plainText } from "@/lib/seo";
import { AUTHOR } from "@/lib/author";
import { TEMA_CURTO, chapterForPost } from "@/lib/guia-map";

// Home (redesenho de out/2026, aplicado a pedido do usuário): topo com o galo
// do plantel, catálogo com filtros e ação por WhatsApp, diferenciais, blog,
// "Do ovo à galinha adulta" (fases ligadas ao Guia) e chamada final.
// Regras mantidas: dados reais do banco, cores da marca e nenhuma promessa
// que o site não cumpra — "Reservar"/"Avise-me" abrem o WhatsApp com a
// mensagem pronta, que é como a reserva funciona de fato.

type HomeData = {
  posts: Awaited<ReturnType<typeof listPosts>>;
  blog: Awaited<ReturnType<typeof listPublishedBlogSummaries>>;
  categories: Awaited<ReturnType<typeof listCategories>>;
  ratingsMap: Record<string, { average: number; count: number }>;
};

export const Route = createFileRoute("/")({
  loader: async (): Promise<HomeData> => {
    const [postsRes, blogRes, categoriesRes] = await Promise.allSettled([
      listPosts(),
      listPublishedBlogSummaries(),
      listCategories(),
    ]);
    const posts = postsRes.status === "fulfilled" ? postsRes.value : [];
    const ratingsRes = await Promise.allSettled(posts.map((p) => getRatingSummary({ data: { postId: p.id } })));
    const ratingsMap: HomeData["ratingsMap"] = {};
    posts.forEach((p, i) => {
      const r = ratingsRes[i];
      ratingsMap[p.id] = r.status === "fulfilled" ? r.value : { average: 0, count: 0 };
    });
    return {
      posts,
      blog: blogRes.status === "fulfilled" ? blogRes.value : [],
      categories: categoriesRes.status === "fulfilled" ? categoriesRes.value : [],
      ratingsMap,
    };
  },
  head: ({ loaderData }) => {
    const galo = loaderData?.posts.find((p) => p.slug.includes("galo"))?.images[0];
    return {
      links: galo ? [{ rel: "preload", href: galo, as: "image" }] : [],
      // JSON-LD da marca e do site: ajuda o Google a mostrar nome/logo corretos.
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify([
            { "@context": "https://schema.org", "@type": "Organization", name: "Galinha GSB", url: SITE_URL, logo: DEFAULT_OG_IMAGE },
            { "@context": "https://schema.org", "@type": "WebSite", name: "Galinha GSB", url: SITE_URL, inLanguage: "pt-BR" },
          ]),
        },
      ],
    };
  },
  component: Home,
});

/* ------------------------------------------------------------------ */
/* Conteúdo fixo                                                       */
/* ------------------------------------------------------------------ */

const DIFERENCIAIS = [
  { icon: ShieldCheck, title: "Procedência conhecida", text: "Aves do plantel próprio, com seleção acompanhada ano a ano." },
  { icon: HeartHandshake, title: "Suporte ao criador", text: "Orientação sobre manejo, nutrição e saúde das aves." },
  { icon: Truck, title: "Entrega cuidadosa", text: "Embalagem apropriada para ovos e transporte cuidadoso de aves." },
];

/** Atalhos de tema do blog → capítulo do Guia correspondente. */
const TEMAS = [
  { label: "Alimentação", to: "/guia/alimentacao" },
  { label: "Reprodução", to: "/guia/reproducao" },
  { label: "Pintinhos", to: "/guia/pintinhos" },
  { label: "Saúde e vacinas", to: "/guia/sanidade" },
  { label: "Seleção", to: "/guia/selecao" },
];

const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.16em]";

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

function Home() {
  const { posts, blog, categories } = Route.useLoaderData();
  const hydrated = useHydrated();
  const [cat, setCat] = useState<string>("ALL");

  const produtos = posts.filter((p) => p.status === "PUBLISHED");
  const visiveis = cat === "ALL" ? produtos : produtos.filter((p) => p.category === cat);
  const galo = produtos.find((p) => p.slug.includes("galo")) ?? produtos[0];
  const [destaque, ...outros] = blog.filter((p) => p.published).slice(0, 4);
  const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? "";
  const dataCurta = (iso: string) =>
    hydrated ? new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "") : "";
  const temaDoPost = (slug: string) => TEMA_CURTO[chapterForPost(slug)?.num ?? 0] ?? "Blog";

  return (
    <SiteLayout>
      {/* ── Topo ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary-deep text-primary-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_70%_at_75%_40%,color-mix(in_oklab,var(--primary-glow)_28%,transparent),transparent_70%)]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 pb-14 pt-12 md:grid-cols-[1.1fr_1fr] md:px-8 md:pb-20 md:pt-16">
          <div>
            <p className={`${eyebrow} text-accent-warm`}>Raça brasileira de grande porte</p>
            <h1 className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.04] tracking-tight md:text-6xl">
              Galinha GSB, a <span className="text-accent-warm">Sertaneja Balão</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-primary-foreground/85">
              Ovos férteis, pintinhos, galinhas e reprodutores do plantel do {AUTHOR.name}, com orientação de criação, manejo e
              alimentação para quem está começando ou ampliando o galinheiro.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#plantel"
                className="inline-flex min-h-11 items-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-soft)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-warm focus-visible:ring-offset-2 focus-visible:ring-offset-primary-deep"
              >
                Ver aves disponíveis
              </a>
              <Link
                to="/guia"
                className="inline-flex min-h-11 items-center rounded-full border border-primary-foreground/35 px-6 py-2.5 text-sm font-semibold transition hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-warm"
              >
                Conhecer a raça
              </Link>
            </div>
          </div>

          {galo && (
            <div className="relative mx-auto w-full max-w-sm md:max-w-md">
              {/* Brilho suave e desfocado atrás do galo */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[105%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary-glow)_85%,var(--accent-warm))_0%,color-mix(in_oklab,var(--primary-glow)_70%,transparent)_30%,color-mix(in_oklab,var(--primary-glow)_30%,transparent)_52%,transparent_70%)] blur-3xl"
              />
              <img
                src={galo.images[0]}
                alt={`${plainText(galo.title)}, ave do plantel`}
                width={1024}
                height={1024}
                fetchPriority="high"
                className="relative z-0 h-auto w-full drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)]"
              />
              <div className="absolute bottom-[22%] left-0 z-10 -rotate-6 rounded-2xl bg-accent-warm px-4 py-2.5 text-accent-warm-foreground shadow-[var(--shadow-card)] md:-left-6">
                <p className="font-display text-lg font-semibold leading-none">até 8 kg</p>
                <p className="mt-1 text-[11px] leading-none opacity-80">peso de um galo adulto</p>
              </div>
            </div>
          )}
        </div>

      </section>

      {/* ── Catálogo ─────────────────────────────────────────── */}
      {produtos.length > 0 && (
        <section id="plantel" aria-labelledby="plantel-titulo" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-14 md:px-8 md:pt-20">
          <p className={`${eyebrow} text-primary`}>Catálogo</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 id="plantel-titulo" className="font-display text-3xl leading-tight md:text-4xl">
                Disponíveis no plantel
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Itens esgotados continuam aqui: peça pelo WhatsApp para ser avisado quando houver reposição.
              </p>
            </div>
            <Link to="/catalogo" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
              Ver catálogo completo
            </Link>
          </div>

          {categories.length > 1 && (
            <div role="group" aria-label="Filtrar por categoria" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
              {[{ id: "ALL", label: "Todos" }, ...categories].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={cat === c.id}
                  onClick={() => setCat(c.id)}
                  className={`min-h-9 shrink-0 rounded-full px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    cat === c.id ? "bg-primary-deep text-primary-foreground" : "border border-border bg-card hover:bg-muted"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {visiveis.map((p) => (
              <li key={p.id}>
                <ProductCard p={p} category={catLabel(p.category)} />
              </li>
            ))}
          </ul>

          {/* diferenciais */}
          <ul className="mt-10 grid border-y border-border md:grid-cols-3">
            {DIFERENCIAIS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className={`flex gap-3 py-5 md:px-6 ${i > 0 ? "border-t border-border md:border-l md:border-t-0" : "md:pl-0"}`}>
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-base">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Anúncio (só aparece com slot ativo no AdSense) */}
      <section className="mx-auto mt-10 max-w-6xl px-4 empty:hidden md:px-8">
        <AdSlot slot="homeBanner" label="Espaço publicitário — formato banner" placeholder={null} />
      </section>

      {/* ── Blog ─────────────────────────────────────────────── */}
      {destaque && (
        <section aria-labelledby="blog-titulo" className="mx-auto max-w-6xl px-4 pt-14 md:px-8 md:pt-20">
          <p className={`${eyebrow} text-primary`}>Blog</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="blog-titulo" className="font-display text-3xl leading-tight md:text-4xl">
                Artigos do criador
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">Manejo, reprodução e saúde, escritos por {AUTHOR.name}, criador da raça.</p>
            </div>
            <Link to="/blog" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
              Todos os artigos
            </Link>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[1.25fr_1fr] md:gap-10">
            <Link to="/blog/$slug" params={{ slug: destaque.slug }} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                {destaque.coverImage && (
                  <img src={destaque.coverImage} alt={plainText(destaque.title)} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
                )}
              </div>
              <p className={`${eyebrow} mt-4 text-primary`}>
                {temaDoPost(destaque.slug)}
                {hydrated && <span className="ml-2 text-muted-foreground">{dataCurta(destaque.createdAt)}</span>}
              </p>
              <h3 className="mt-2 font-display text-2xl leading-snug group-hover:text-primary md:text-3xl">{plainText(destaque.title)}</h3>
              {destaque.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{plainText(destaque.excerpt)}</p>}
            </Link>

            <div>
              <ul className="divide-y divide-border">
                {outros.map((p) => (
                  <li key={p.id}>
                    <Link to="/blog/$slug" params={{ slug: p.slug }} className="group flex gap-4 py-4 first:pt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {p.coverImage && <img src={p.coverImage} alt="" loading="lazy" decoding="async" className="h-20 w-24 shrink-0 rounded-xl object-cover" />}
                      <span className="min-w-0">
                        <span className={`${eyebrow} block text-primary`}>
                          {temaDoPost(p.slug)}
                          {hydrated && <span className="ml-2 text-muted-foreground">{dataCurta(p.createdAt)}</span>}
                        </span>
                        <span className="mt-1 block font-display text-base leading-snug group-hover:text-primary">{plainText(p.title)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
                {TEMAS.map((t) => (
                  <Link
                    key={t.to}
                    to={t.to as "/"}
                    className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold transition hover:bg-primary/10 hover:text-primary"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Do ovo à galinha adulta (fases ligadas ao Guia) ──── */}
      <CicloCriacao className="mx-auto max-w-6xl px-4 pt-14 md:px-8 md:pt-20" />

      {/* ── Chamada final ───────────────────────────────────── */}
      <CtaBand message="Olá! Vim pelo site e gostaria de reservar ovos ou pintinhos." />

      <section className="mx-auto max-w-6xl px-4 pb-12 empty:hidden md:px-8">
        <AdSlot slot="homeRectangle" label="Espaço publicitário" placeholder={null} />
      </section>
    </SiteLayout>
  );
}
