import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { AdSlot } from "@/components/site/ad-slot";
import { BlogLikeButton } from "@/components/site/blog-like-button";
import { UserCircle2 } from "lucide-react";
import { listBlogPosts } from "@/lib/blog";

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    try {
      const all = await listBlogPosts();
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
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Blog — Galinha GSB" },
      { name: "twitter:description", content: "Artigos sobre criação de galinhas Sertanejo Balão (GSB), manejo, saúde e dicas para criadores." },
    ],
  }),
  component: Blog,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function Blog() {
  const { posts } = Route.useLoaderData();
  return (
    <SiteLayout>
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-6 text-left md:px-8 md:py-8">
          <h1 className="font-display text-2xl md:text-3xl">Blog</h1>
          <p className="mt-1.5 max-w-2xl text-xs opacity-85 md:text-sm">Dicas de manejo, novidades do plantel e conteúdo sobre a raça Sertanejo Balão.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-5 md:px-8 md:py-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group flex h-full flex-col overflow-hidden rounded-xl bg-card text-left shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]"
              >
                {/* capa proporção 16/9 */}
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  {p.coverImage && (
                    <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-3 text-left">
                  <div className="text-[10px] text-muted-foreground">{formatDate(p.createdAt)}</div>
                  <h2 className="mt-0.5 line-clamp-2 font-display text-sm leading-snug">{p.title}</h2>
                  <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{p.excerpt}</p>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    {/* autor */}
                    {p.author ? (
                      <div className="flex items-center gap-1.5 min-w-0">
                        {p.author.avatar ? (
                          <img src={p.author.avatar} alt={p.author.name} className="h-5 w-5 rounded-full object-cover shrink-0" />
                        ) : (
                          <UserCircle2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <span className="truncate text-[10px] text-muted-foreground">{p.author.name}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-semibold text-primary">Ler mais →</span>
                    )}

                    <BlogLikeButton postId={p.id} initialCount={p.likeCount} />
                  </div>
                </div>
              </Link>
            ))}

            {posts.length === 0 && (
              <p className="col-span-full rounded-xl bg-muted p-8 text-center text-sm text-muted-foreground">
                Nenhum post publicado ainda.
              </p>
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
              placeholder={
                <div className="flex min-h-[600px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">Espaço publicitário</div>
                  <p className="mt-2 text-xs text-muted-foreground">Formato vertical disponível para parceiros.</p>
                </div>
              }
            />
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
