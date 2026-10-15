import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { AdSlot } from "@/components/site/ad-slot";
import { BlogLikeButton } from "@/components/site/blog-like-button";
import { UserCircle2 } from "lucide-react";
import { listPublishedBlogSummaries } from "@/lib/blog";
import { useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { CONTAINER, CtaBand, EYEBROW, FilterChips, PageHero, btn } from "@/components/site/page-kit";
import { AUTHOR } from "@/lib/author";
import { TEMA_CURTO, chapterForPost } from "@/lib/guia-map";
import { plainText } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    try {
      const all = await listPublishedBlogSummaries();
      return { posts: all.filter((p) => p.published) };
    } catch {
      return { posts: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Blog — Galinha GSB" },
      { name: "description", content: "Artigos sobre criação de galinhas Sertanejo Balão (GSB), manejo, saúde e dicas para criadores." },
      { property: "og:title", content: "Blog — Galinha GSB" },
      { property: "og:description", content: "Artigos sobre criação de galinhas Sertanejo Balão (GSB), manejo, saúde e dicas para criadores." },
      { property: "og:image", content: "https://galinhagsb.com.br/logo.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Blog — Galinha GSB" },
      { name: "twitter:description", content: "Artigos sobre criação de galinhas Sertanejo Balão (GSB), manejo, saúde e dicas para criadores." },
    ],
  }),
  component: Blog,
});

function Blog() {
  const { posts } = Route.useLoaderData();
  const hydrated = useHydrated();
  const [tema, setTema] = useState("ALL");
  const temaNum = (slug: string) => chapterForPost(slug)?.num ?? 0;
  const temas = [...new Set(posts.map((p) => temaNum(p.slug)).filter(Boolean))].sort((a, b) => a - b);
  const visiveis = tema === "ALL" ? posts : posts.filter((p) => String(temaNum(p.slug)) === tema);
  const [destaque, ...resto] = visiveis;
  const data = (iso: string) =>
    hydrated ? new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "") : "";
  const Meta = ({ slug, iso }: { slug: string; iso: string }) => (
    <p className={`${EYEBROW} text-primary`}>
      {TEMA_CURTO[temaNum(slug)] ?? "Blog"}
      {hydrated && <span className="ml-2 text-muted-foreground">{data(iso)}</span>}
    </p>
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Blog"
        title="Artigos do criador"
        intro={`Manejo, reprodução, saúde e dúvidas do dia a dia com a Sertaneja Balão, escritos por ${AUTHOR.name} a partir da rotina do plantel.`}
      >
        <Link to="/guia" className={btn.outlineOnDark}>
          Ler o Guia da GSB
        </Link>
      </PageHero>

      <section className={`${CONTAINER} py-10 md:py-14`}>
        {temas.length > 1 && (
          <FilterChips
            label="Filtrar por tema"
            value={tema}
            onChange={setTema}
            options={[{ id: "ALL", label: "Todos" }, ...temas.map((n) => ({ id: String(n), label: TEMA_CURTO[n] }))]}
          />
        )}

        {!destaque ? (
          <p className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">Nenhum artigo publicado ainda.</p>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div>
              <Link to="/blog/$slug" params={{ slug: destaque.slug }} className="group grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                  {destaque.coverImage && (
                    <img src={destaque.coverImage} alt={plainText(destaque.title)} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
                  )}
                </div>
                <div>
                  <Meta slug={destaque.slug} iso={destaque.createdAt} />
                  <h2 className="mt-2 font-display text-2xl leading-snug group-hover:text-primary md:text-3xl">{plainText(destaque.title)}</h2>
                  {destaque.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base">{plainText(destaque.excerpt)}</p>}
                </div>
              </Link>

              {resto.length > 0 && (
                <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                  {resto.map((p) => (
                    <li key={p.id}>
                      <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                          {p.coverImage && (
                            <img src={p.coverImage} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                          )}
                        </div>
                        <div className="mt-3">
                          <Meta slug={p.slug} iso={p.createdAt} />
                        </div>
                        <h3 className="mt-1.5 font-display text-lg leading-snug group-hover:text-primary">{plainText(p.title)}</h3>
                      </Link>
                      <div className="mt-2 flex items-center justify-between">
                        {p.author ? (
                          <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                            {p.author.avatar ? (
                              <img src={p.author.avatar} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover" />
                            ) : (
                              <UserCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                            )}
                            <span className="truncate">{p.author.name}</span>
                          </span>
                        ) : (
                          <span />
                        )}
                        <BlogLikeButton postId={p.id} initialCount={p.likeCount} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <aside className="hidden lg:block">
              <AdSlot
                slot="blog"
                label="Espaço publicitário — formato vertical"
                className="sticky top-24"
                format="vertical"
                fullWidthResponsive={false}
                style={{ minHeight: 600 }}
                placeholder={null}
              />
            </aside>
          </div>
        )}
      </section>

      <CtaBand
        title="Ficou com alguma dúvida?"
        text="Mande sua pergunta ao criador — ela pode virar o próximo artigo do blog."
        message="Olá! Li o blog do site e tenho uma dúvida sobre a Sertaneja Balão."
      />
    </SiteLayout>
  );
}
