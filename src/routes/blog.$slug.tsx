import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { AdSlot } from "@/components/site/ad-slot";
import { BlogLikeButton } from "@/components/site/blog-like-button";
import { UserCircle2 } from "lucide-react";
import { getBlogPostBySlug, listPublishedBlogSummaries } from "@/lib/blog";
import { listPosts } from "@/lib/posts";
import { topicFor, relatedPosts, relatedProduct, linkKnownTitles } from "@/lib/related";
import { AUTHOR } from "@/lib/author";
import { TEMA_CURTO, chapterForPost } from "@/lib/guia-map";
import { CONTAINER, CtaBand, EYEBROW } from "@/components/site/page-kit";
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
  const tema = TEMA_CURTO[chapterForPost(post.slug)?.num ?? 0] ?? "Blog";
  return (
    <SiteLayout>
      {/* ── Topo do artigo ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary-deep text-primary-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_80%_at_85%_20%,color-mix(in_oklab,var(--primary-glow)_24%,transparent),transparent_70%)]"
        />
        <div className={`relative ${CONTAINER} pb-24 pt-8 md:pb-32 md:pt-12`}>
          <Link to="/blog" className="text-sm text-primary-foreground/75 hover:text-primary-foreground">
            ← Blog
          </Link>
          <div className="mt-6 max-w-3xl">
            <p className={`${EYEBROW} text-accent-warm`}>
              {tema}
              <span className="ml-2 text-primary-foreground/60">{formatDate(post.createdAt)}</span>
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">{plainText(post.title)}</h1>
            {post.excerpt && <p className="mt-4 text-base leading-relaxed text-primary-foreground/85 md:text-lg">{plainText(post.excerpt)}</p>}
            {/* Autor — sempre visível e ligado à página de autor (sinal de E-E-A-T) */}
            <Link to={AUTHOR.path as any} className="mt-6 inline-flex items-center gap-3 rounded-full pr-4 transition hover:bg-primary-foreground/10">
              {post.author?.avatar ? (
                <img src={post.author.avatar} alt={post.author.name} className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-primary-foreground/20" />
              ) : (
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-foreground/10">
                  <UserCircle2 className="h-5 w-5" />
                </span>
              )}
              <span className="text-left">
                <span className="block text-sm font-semibold">Por {post.author?.name || AUTHOR.name}</span>
                <span className="block text-xs text-primary-foreground/70">{AUTHOR.role} há mais de 10 anos</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-6 text-left md:px-8 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="-mt-16 min-w-0 text-left md:-mt-24">
          {post.coverImage ? (
            <div className="aspect-video overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-card)] md:rounded-3xl">
              <img src={post.coverImage} alt={plainText(post.title)} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="aspect-video overflow-hidden rounded-2xl bg-muted md:rounded-3xl" />
          )}
          <div className="mt-4 flex justify-end">
            <BlogLikeButton postId={post.id} initialCount={post.likeCount ?? 0} />
          </div>

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

        <aside className="hidden pt-10 lg:block">
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
      <CtaBand title="Ficou com alguma dúvida?" text="Pergunte direto ao criador pelo WhatsApp." message={`Olá! Li o artigo "${plainText(post.title)}" e tenho uma dúvida.`} />
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
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/80">Faz parte do Guia da GSB</span>
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
