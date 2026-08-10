import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { AdSlot } from "@/components/site/ad-slot";
import { getBlogPostBySlug } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getBlogPostBySlug({ data: { slug: params.slug } });
    if (!post || !post.published) throw notFound();
    return { post };
  },
  component: BlogDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Post não encontrado</h1>
        <Link to="/blog" className="mt-6 inline-block text-primary hover:underline">← Voltar ao blog</Link>
      </div>
    </SiteLayout>
  ),
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function BlogDetail() {
  const { post } = Route.useLoaderData();
  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-6xl gap-6 px-3 py-6 text-left md:px-8 md:py-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="min-w-0 text-left">
          <Link to="/blog" className="text-xs text-muted-foreground hover:text-foreground md:text-sm">← Voltar ao blog</Link>
          <div className="mt-3 overflow-hidden rounded-2xl shadow-[var(--shadow-card)] md:mt-4 md:rounded-3xl">
            <img src={post.coverImage} alt={post.title} className="aspect-[16/9] w-full object-cover" />
          </div>
          <div className="mt-4 text-[11px] text-muted-foreground md:text-xs">{formatDate(post.createdAt)}</div>
          <h1 className="mt-1 text-left font-display text-xl md:text-2xl">{post.title}</h1>
          <p className="mt-2 text-left text-sm text-muted-foreground md:text-base">{post.excerpt}</p>

          {/* Anúncio dentro do conteúdo — visível no mobile/tablet */}
          <AdSlot
            slot="blog"
            label="Espaço publicitário"
            className="mt-5 lg:hidden"
            placeholder={
              <div className="grid min-h-[90px] place-items-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-5 text-center">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">Espaço publicitário</div>
                  <p className="mt-1 text-xs text-muted-foreground">Reserve este espaço.</p>
                </div>
              </div>
            }
          />

          <div className="mt-5 whitespace-pre-line text-left text-sm leading-relaxed text-foreground/90 md:text-base">{post.content}</div>

          {(post.blocks ?? []).length > 0 && (
            <div className="mt-6 space-y-5">
              {(post.blocks ?? []).map((b) =>
                b.type === "text" ? (
                  <p key={b.id} className="whitespace-pre-line text-left text-sm leading-relaxed text-foreground/90 md:text-base">
                    {b.text}
                  </p>
                ) : b.image ? (
                  <img key={b.id} src={b.image} alt="" loading="lazy" className="aspect-[16/9] w-full rounded-2xl object-cover" />
                ) : null,
              )}
            </div>
          )}

          {(post.images ?? []).length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(post.images ?? []).map((img, i) => (
                <img key={i} src={img} alt={`${post.title} — imagem ${i + 1}`} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
              ))}
            </div>
          )}
        </article>

        <aside className="hidden lg:block">
          <AdSlot
            slot="blog"
            label="Espaço publicitário — formato vertical"
            className="sticky top-24"
            format="vertical"
            fullWidthResponsive={false}
            style={{ minHeight: 600 }}
            placeholder={
              <div className="flex min-h-[600px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">Espaço publicitário</div>
                <p className="mt-2 text-xs text-muted-foreground">Formato vertical (skyscraper) disponível para parceiros.</p>
              </div>
            }
          />
        </aside>
      </div>
    </SiteLayout>
  );
}
