import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { HeartHandshake, ShieldCheck, Truck } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { AdSlot } from "@/components/site/ad-slot";
import { CicloCriacao } from "@/components/site/ciclo-criacao";
import { Contador } from "@/components/site/contador";
import { HeroPenas } from "@/components/site/hero-penas";
import { CtaBand, ProductCard } from "@/components/site/page-kit";
import { useHydrated } from "@/hooks/use-hydrated";
import { listPosts } from "@/lib/posts";
import { listPublishedBlogSummaries } from "@/lib/blog";
import { listCategories } from "@/lib/categories";
import { getRatingSummary } from "@/lib/ratings";
import { SITE_URL, DEFAULT_OG_IMAGE, plainText } from "@/lib/seo";
import { AUTHOR } from "@/lib/author";
import { TEMA_CURTO, chapterForPost } from "@/lib/guia-map";

// Home (redesenho de out/2026, aplicado a pedido do usuário): hero dinâmico
// vindo da landing (foto do plantel, penas e números), catálogo com filtros e ação por WhatsApp, diferenciais, blog,
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
  head: () => {
    return {
      // Foto do hero (maior elemento da primeira tela): baixa antes do CSS.
      links: [{ rel: "preload", href: "/img/hero-plantel.webp", as: "image", fetchPriority: "high" }],
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

/** Números do hero — os mesmos já publicados no site (blog de postura, Sobre e Guia). */
const NUMEROS: { rotulo: string; valor?: number; antes?: string; depois?: string; fixo?: string }[] = [
  { rotulo: "peso de um galo adulto", valor: 8, antes: "até ", depois: " kg" },
  { rotulo: "ovos por fêmea ao ano", fixo: "160–260" },
  { rotulo: "anos de criação da raça", valor: 10, antes: "+" },
  { rotulo: "de seleção até o reprodutor", valor: 3, depois: " rodadas" },
];

/** Título que surge palavra por palavra (desfoque → nítido), só com CSS. */
function Palavras({ texto, destaque = false, inicio = 0 }: { texto: string; destaque?: boolean; inicio?: number }) {
  const Tag = destaque ? "em" : "span";
  return (
    <>
      {texto.split(" ").map((p, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <Tag
            className={`palavra${destaque ? " font-medium italic text-accent-warm" : ""}`}
            style={{ animationDelay: `${(0.25 + (inicio + i) * 0.16) * 2.2}s` }}
          >
            {p}
          </Tag>
        </Fragment>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

function Home() {
  const { posts, blog, categories } = Route.useLoaderData();
  const hydrated = useHydrated();
  const [cat, setCat] = useState<string>("ALL");

  const produtos = posts.filter((p) => p.status === "PUBLISHED");
  const visiveis = cat === "ALL" ? produtos : produtos.filter((p) => p.category === cat);
  const [destaque, ...outros] = blog.filter((p) => p.published).slice(0, 5);
  const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? "";
  const dataCurta = (iso: string) =>
    hydrated ? new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "") : "";
  const temaDoPost = (slug: string) => TEMA_CURTO[chapterForPost(slug)?.num ?? 0] ?? "Blog";

  return (
    <SiteLayout>
      {/* ── Topo (hero dinâmico da landing, out/2026) ────────────
          Foto do plantel com zoom lento, penas e poeira de luz caindo,
          título surgindo palavra por palavra e números que contam.
          Fica por baixo do cabeçalho transparente (-mt-20 = altura dele). */}
      <section className="relative isolate -mt-20 grid min-h-[100svh] items-end overflow-hidden bg-[#0e2418] text-white">
        <div className="hero-gsb-foto" role="img" aria-label="Três aves GSB do plantel no terreiro" />
        <div className="hero-gsb-veu" aria-hidden="true" />
        <HeroPenas />
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-12 pt-32 md:gap-7 md:px-8 md:pb-14 md:pt-40">
          <p className={`${eyebrow} text-accent-warm`}>Raça brasileira de grande porte · Baixa Grande, BA</p>
          <h1 className="max-w-[13ch] font-display text-[clamp(2.75rem,8.2vw,7rem)] font-semibold leading-[1.02] tracking-[-0.025em]">
            <Palavras texto="A gigante do sertão," />{" "}
            <Palavras texto="criada de perto." destaque inicio={4} />
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            Portal Galinha GSB, especializado na Galinha Sertaneja Balão. Encontre notícias, conteúdos sobre criação e
            manejo, além de ovos férteis, pintinhos, galinhas e reprodutores GSB.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <a
              href="#plantel"
              className="inline-flex min-h-12 items-center rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-soft)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-warm focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e2418] md:text-base"
            >
              Ver aves disponíveis
            </a>
            <Link
              to="/guia"
              className="inline-flex min-h-12 items-center rounded-full border border-white/40 px-7 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-warm md:text-base"
            >
              Conhecer a raça
            </Link>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] bg-white/15 ring-1 ring-inset ring-white/20 backdrop-blur-md md:mt-6 md:grid-cols-4">
            {NUMEROS.map((n) => (
              <div key={n.rotulo} className="flex flex-col-reverse bg-[rgba(14,36,24,0.35)] px-4 py-4 md:px-6 md:py-5">
                <dt className="text-[13px] leading-snug text-white/80 md:text-[13.5px]">{n.rotulo}</dt>
                <dd className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.1] text-accent-warm">
                  {n.fixo ?? <Contador valor={n.valor!} antes={n.antes} depois={n.depois} />}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <span className="hero-gsb-rolar" aria-hidden="true">role devagar</span>
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
                      {p.coverImage && <img src={p.coverImage} alt="" loading="lazy" decoding="async" className="aspect-video w-28 shrink-0 self-start rounded-xl bg-muted object-cover" />}
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
