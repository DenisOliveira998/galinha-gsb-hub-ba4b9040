import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { AdSlot } from "@/components/site/ad-slot";
import { BlogLikeButton } from "@/components/site/blog-like-button";
import { UserCircle2 } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    try {
      const post = await getBlogPostBySlug({ data: { slug: params.slug } });
      if (!post || !post.published) throw notFound();
      return { post };
    } catch (e) {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};
    const img = post.coverImage ?? "";
    const desc = post.excerpt?.slice(0, 160) ?? "";
    return {
      meta: [
        { title: `${post.title} — Blog Galinha GSB` },
        { name: "description", content: desc },
        { property: "og:title", content: `${post.title} — Blog Galinha GSB` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        ...(img ? [{ property: "og:image", content: img }, { name: "twitter:image", content: img }] : []),
        { name: "twitter:card", content: img ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: `${post.title} — Blog Galinha GSB` },
        { name: "twitter:description", content: desc },
      ],
    };
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
          {post.coverImage ? (
            <div className="mt-3 aspect-video overflow-hidden rounded-2xl shadow-[var(--shadow-card)] md:mt-4 md:rounded-3xl">
              <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="mt-3 aspect-video overflow-hidden rounded-2xl bg-muted md:mt-4 md:rounded-3xl" />
          )}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="text-[11px] text-muted-foreground md:text-xs">{formatDate(post.createdAt)}</div>
            <BlogLikeButton postId={post.id} initialCount={post.likeCount ?? 0} />
          </div>
          <h1 className="mt-1 text-left font-display text-xl md:text-2xl">{post.title}</h1>
          <p className="mt-2 text-left text-sm text-muted-foreground md:text-base">{post.excerpt}</p>

          {/* Autor */}
          {post.author && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              {post.author.avatar ? (
                <img src={post.author.avatar} alt={post.author.name} className="h-10 w-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <UserCircle2 className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold">{post.author.name}</p>
                {post.author.bio && <p className="text-xs text-muted-foreground line-clamp-2">{post.author.bio}</p>}
              </div>
            </div>
          )}

          {/* Anúncio dentro do conteúdo — visível no mobile/tablet */}
          <AdSlot
            slot="blog"
            label="Espaço publicitário"
            className="mt-5 lg:hidden"
            customSlotId={post.adSlot}
            placeholder={
              <div className="grid min-h-[90px] place-items-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-5 text-center">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">Espaço publicitário</div>
                  <p className="mt-1 text-xs text-muted-foreground">Reserve este espaço.</p>
                </div>
              </div>
            }
          />

          <div className="prose prose-sm mt-5 max-w-none text-left text-foreground/90 md:text-base" dangerouslySetInnerHTML={{ __html: post.content }} />

          {(post.blocks ?? []).length > 0 && (
            <div className="mt-6 space-y-5">
              {(post.blocks ?? []).map((b) =>
                b.type === "text" ? (
                  <div key={b.id} className="prose prose-sm max-w-none text-left text-foreground/90 md:text-base" dangerouslySetInnerHTML={{ __html: b.text ?? "" }} />
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
            customSlotId={post.adSlot}
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
