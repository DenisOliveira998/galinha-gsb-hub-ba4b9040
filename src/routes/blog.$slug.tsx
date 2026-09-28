import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { AdSlot } from "@/components/site/ad-slot";
import { BlogLikeButton } from "@/components/site/blog-like-button";
import { UserCircle2 } from "lucide-react";
import { getBlogPostBySlug, listPublishedBlogSummaries } from "@/lib/blog";
import { listPosts } from "@/lib/posts";
import { topicFor, relatedPosts, relatedProduct, linkKnownTitles } from "@/lib/related";
import { AUTHOR } from "@/lib/author";
import { SITE_URL, DEFAULT_OG_IMAGE, absUrl, plainText, truncate, pageTitle, demoteH1, stripHeadingEmojis } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const [postRes, blogsRes, productsRes] = await Promise.allSettled([
      getBlogPostBySlug({ data: { slug: params.slug } }),
      listPublishedBlogSummaries(),
      listPosts(),
    ]);
    const post = postRes.status === "fulfilled" ? postRes.value : null;
    if (!post || !post.published) throw notFound();

    // "Leia também": links internos para outros posts, o Guia e o catálogo.
    const blogs = blogsRes.status === "fulfilled" ? blogsRes.value : [];
    const products = productsRes.status === "fulfilled" ? productsRes.value : [];
    const product = relatedProduct(post.slug, products);
    return {
      post,
      related: relatedPosts(post.slug, blogs, 3),
      titles: blogs.map((b) => ({ slug: b.slug, title: b.title })),
      guia: topicFor(post.slug).guia,
      product: product ? { slug: product.slug, title: product.title, image: product.images?.[0] ?? null } : null,
    };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};
    const img = post.coverImage ? absUrl(post.coverImage) : "";
    const plainTitle = plainText(post.title);
    const desc = truncate(plainText(post.excerpt), 155);
    const title = pageTitle(plainTitle);

    // JSON-LD de artigo: ajuda o Google (e buscadores de IA) a entender autor e data.
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: plainTitle.slice(0, 110),
      description: desc,
      image: [img || DEFAULT_OG_IMAGE],
      datePublished: post.createdAt,
      dateModified: post.updatedAt ?? post.createdAt,
      mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
      inLanguage: "pt-BR",
      // Por ora todo o conteúdo é do Leonardo Reis (ver src/lib/author.ts).
      author: { "@type": "Person", name: post.author?.name || AUTHOR.name, url: `${SITE_URL}${AUTHOR.path}` },
      publisher: {
        "@type": "Organization",
        name: "Galinha GSB",
        logo: { "@type": "ImageObject", url: DEFAULT_OG_IMAGE },
      },
    };

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: plainTitle },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: post.createdAt },
        ...(img ? [{ property: "og:image", content: img }, { name: "twitter:image", content: img }] : []),
        { name: "twitter:card", content: img ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: plainTitle },
        { name: "twitter:description", content: desc },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
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
  const { post, related, guia, product, titles } = Route.useLoaderData();
  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-6xl gap-6 px-3 py-6 text-left md:px-8 md:py-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="min-w-0 text-left">
          <Link to="/blog" className="text-xs text-muted-foreground hover:text-foreground md:text-sm">← Voltar ao blog</Link>
          {post.coverImage ? (
            <div className="mt-3 aspect-video overflow-hidden rounded-2xl shadow-[var(--shadow-card)] md:mt-4 md:rounded-3xl">
              <img src={post.coverImage} alt={plainText(post.title)} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="mt-3 aspect-video overflow-hidden rounded-2xl bg-muted md:mt-4 md:rounded-3xl" />
          )}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="text-[11px] text-muted-foreground md:text-xs">{formatDate(post.createdAt)}</div>
            <BlogLikeButton postId={post.id} initialCount={post.likeCount ?? 0} />
          </div>
          <h1 className="mt-1 text-left font-display text-xl md:text-2xl" dangerouslySetInnerHTML={{ __html: post.title }} />
          <div className="mt-2 text-left text-sm text-muted-foreground md:text-base prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: post.excerpt }} />

          {/* Autor */}
          {/* Autor — sempre visível e ligado à página de autor (sinal de E-E-A-T) */}
          {(
            <Link to={AUTHOR.path as any} className="mt-4 flex items-center gap-3 rounded-xl bg-muted/50 p-3 transition hover:bg-muted">
              {post.author?.avatar ? (
                <img src={post.author.avatar} alt={post.author.name} className="h-10 w-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <UserCircle2 className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold">Por {post.author?.name || AUTHOR.name}</p>
                {post.author?.bio ? (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{plainText(post.author.bio)}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">{AUTHOR.role} há mais de 10 anos</p>
                )}
              </div>
            </Link>
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

          <div className="prose prose-sm mt-5 max-w-none text-left text-foreground/90 md:text-base blog-content" dangerouslySetInnerHTML={{ __html: linkKnownTitles(stripHeadingEmojis(demoteH1(post.content)), titles) }} />

          {(post.blocks ?? []).length > 0 && (
            <div className="mt-6 space-y-5">
              {(post.blocks ?? []).map((b) =>
                b.type === "text" ? (
                  <div key={b.id} className="prose prose-sm max-w-none text-left text-foreground/90 md:text-base" dangerouslySetInnerHTML={{ __html: linkKnownTitles(stripHeadingEmojis(demoteH1(b.text)), titles) }} />
                ) : b.image ? (
                  <img key={b.id} src={b.image} alt="" loading="lazy" className="aspect-[16/9] w-full rounded-2xl object-cover" />
                ) : null,
              )}
            </div>
          )}

          {(post.images ?? []).length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(post.images ?? []).map((img, i) => (
                <img key={i} src={img} alt={`${plainText(post.title)} — imagem ${i + 1}`} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
              ))}
            </div>
          )}
          <ReadMore related={related} guia={guia} product={product} />
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

type ReadMoreProps = {
  related: Array<{ id: string; slug: string; title: string; coverImage: string | null; createdAt: string }>;
  guia: { to: string; label: string };
  product: { slug: string; title: string; image: string | null } | null;
};

function ReadMore({ related, guia, product }: ReadMoreProps) {
  return (
    <section className="mt-10 border-t border-border pt-6" aria-labelledby="continue-lendo">
      <h2 id="continue-lendo" className="font-display text-lg md:text-xl">Continue lendo</h2>

      {related.length > 0 && (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {related.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group flex flex-col overflow-hidden rounded-xl bg-card text-left shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]"
            >
              <div className="aspect-video w-full overflow-hidden bg-muted">
                {p.coverImage && (
                  <img src={p.coverImage} alt={plainText(p.title)} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                )}
              </div>
              <h3 className="line-clamp-3 p-3 font-display text-sm leading-snug">{plainText(p.title)}</h3>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link
          to={guia.to as any}
          className="flex flex-col rounded-xl border border-primary/20 bg-primary/5 p-4 text-left transition hover:bg-primary/10"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/80">Guia da raça</span>
          <span className="mt-1 font-display text-sm md:text-base">{guia.label} →</span>
        </Link>
        {product ? (
          <Link
            to="/catalogo/$slug"
            params={{ slug: product.slug }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition hover:shadow-[var(--shadow-card)]"
          >
            {product.image && <img src={product.image} alt={plainText(product.title)} loading="lazy" className="h-14 w-14 shrink-0 rounded-lg object-cover" />}
            <span className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">No catálogo</span>
              <span className="font-display text-sm md:text-base">{plainText(product.title)} →</span>
            </span>
          </Link>
        ) : (
          <Link
            to="/catalogo"
            className="flex flex-col rounded-xl border border-border bg-card p-4 text-left transition hover:shadow-[var(--shadow-card)]"
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">No catálogo</span>
            <span className="mt-1 font-display text-sm md:text-base">Ovos férteis, pintinhos e aves GSB →</span>
          </Link>
        )}
      </div>
    </section>
  );
}
