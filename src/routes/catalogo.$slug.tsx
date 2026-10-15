import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { CommentsSection } from "@/components/site/comments-section";
import { StarsDisplay, StarsInput } from "@/components/site/star-rating";
import { getPostBySlug, listPosts } from "@/lib/posts";
import { listCategories } from "@/lib/categories";
import { getRatingSummary } from "@/lib/ratings";
import { useSettingsQuery } from "@/lib/hooks/use-settings";
import { useRatingSummaryQuery, useMyRatingQuery, useRatePostMutation } from "@/lib/hooks/use-ratings";
import { whatsappHref } from "@/lib/mock-store";
import { getAdminSession } from "@/lib/admin-auth";
import { authClient } from "@/lib/auth-client";
import { CONTAINER, CtaBand, EYEBROW, ProductCard, SectionHeader, btn, textLink } from "@/components/site/page-kit";
import { SITE_URL, absUrl, plainText, truncate } from "@/lib/seo";
import { formatBRL, plainTextToHtml } from "@/lib/format";

export const Route = createFileRoute("/catalogo/$slug")({
  loader: async ({ params }) => {
    const [postRes, postsRes, categoriesRes, adminSessionRes] = await Promise.allSettled([
      getPostBySlug({ data: { slug: params.slug } }),
      listPosts(),
      listCategories(),
      getAdminSession(),
    ]);
    const post = postRes.status === "fulfilled" ? postRes.value : null;
    if (!post) throw notFound();

    const ratingRes = await getRatingSummary({ data: { postId: post.id } }).catch(() => ({ average: 0, count: 0 }));

    return {
      post,
      ratingSSR: ratingRes,
      posts: postsRes.status === "fulfilled" ? postsRes.value : [],
      categories: categoriesRes.status === "fulfilled" ? categoriesRes.value : [],
      isAdmin: !!(adminSessionRes.status === "fulfilled" && adminSessionRes.value),
    };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};
    const img = post.images?.[0] ? absUrl(post.images[0]) : "";
    const plainTitle = plainText(post.title);
    // Descrição sem quebras de linha e cortada sem partir palavra no meio.
    // Se a 1ª linha só repete o título ("Galinha GSB à Venda"), ela é pulada.
    const lines = (post.description ?? "").split(/\n+/);
    if (lines.length > 1 && plainText(lines[0]).toLowerCase().includes(plainTitle.toLowerCase())) lines.shift();
    const desc = truncate(plainText(lines.join(" ")), 155);
    // "Galinha GSB — Galinha GSB" repetia o nome; agora: "Galinha GSB à Venda | Galinha GSB"
    const title = `${plainTitle} à Venda | Galinha GSB`;
    const url = `${SITE_URL}/catalogo/${post.slug}`;

    const rating = loaderData?.ratingSSR;

    // JSON-LD para rich snippets de Product + AggregateRating no Google
    const jsonLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: plainTitle,
      description: desc,
      sku: post.slug,
      url,
      brand: { "@type": "Brand", name: "Galinha GSB" },
      ...(img ? { image: [img] } : {}),
      ...(post.price ? {
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "BRL",
          price: post.price.toFixed(2),
          availability: post.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "Galinha GSB" },
        },
      } : {}),
      ...(rating && rating.count > 0 ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating.average.toFixed(1),
          reviewCount: rating.count,
          bestRating: "5",
          worstRating: "1",
        },
      } : {}),
    };

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        ...(img ? [{ property: "og:image", content: img }, { name: "twitter:image", content: img }] : []),
        { name: "twitter:card", content: img ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(jsonLd) },
      ],
    };
  },
  component: PostDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Anúncio não encontrado</h1>
        <Link to="/catalogo" className="mt-6 inline-block text-primary hover:underline">← Voltar ao catálogo</Link>
      </div>
    </SiteLayout>
  ),
});

function PostDetail() {
  const { post, posts, categories, isAdmin } = Route.useLoaderData();
  const { data: settings } = useSettingsQuery();

  const { data: session } = authClient.useSession();
  const loggedIn = !!session?.user;

  const { data: summary } = useRatingSummaryQuery(post.id);
  const { data: myRating } = useMyRatingQuery(post.id);
  const rateMutation = useRatePostMutation(post.id);

  const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;
  const faq = (post.faq ?? []).filter((f) => f.question.trim() || f.answer.trim());
  const related = posts
    .filter((p) => p.id !== post.id && p.status !== "DRAFT")
    .slice(0, 6);

  const nome = plainText(post.title);
  const esgotado = !post.inStock || post.status === "SOLD";
  const waHref = settings
    ? whatsappHref(
        settings,
        esgotado ? `Olá! Gostaria de ser avisado quando houver reposição de: ${nome}` : `Olá! Gostaria de reservar: ${nome}`,
      )
    : null;

  return (
    <SiteLayout>
      {/* ── Topo do produto ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary-deep text-primary-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background:radial-gradient(50%_70%_at_28%_45%,color-mix(in_oklab,var(--primary-glow)_28%,transparent),transparent_70%)]"
        />
        <div className={`relative ${CONTAINER} py-8 md:py-12`}>
          <Link to="/catalogo" className="text-sm text-primary-foreground/75 hover:text-primary-foreground">
            ← Catálogo
          </Link>
          <div className="mt-6 grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <img
              src={post.images[0]}
              alt={nome}
              width={1024}
              height={1024}
              fetchPriority="high"
              className={`mx-auto aspect-square w-full max-w-md object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)] ${esgotado ? "opacity-80" : ""}`}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className={`${EYEBROW} text-accent-warm`}>{catLabel(post.category)}</p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    esgotado ? "bg-destructive text-destructive-foreground" : "bg-primary-foreground/15 text-primary-foreground"
                  }`}
                >
                  {esgotado ? "Esgotado" : "Disponível"}
                </span>
              </div>
              <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.06] tracking-tight md:text-5xl">{nome}</h1>
              {post.price ? (
                <p className={`mt-5 font-display text-3xl tabular-nums md:text-4xl ${esgotado ? "text-primary-foreground/60 line-through" : "text-accent-warm"}`}>
                  {formatBRL(post.price)}
                </p>
              ) : null}
              <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/80">
                {esgotado
                  ? "Este item está esgotado no momento. Peça pelo WhatsApp para ser avisado quando houver reposição."
                  : "A reserva é feita direto com o criador pelo WhatsApp, que confirma disponibilidade, envio ou retirada."}
              </p>
              {waHref && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className={`${btn.accent} focus-visible:ring-accent-warm`}>
                    {esgotado ? "Avisar quando voltar" : "Reservar no WhatsApp"}
                  </a>
                  <Link to="/guia" className={btn.outlineOnDark}>
                    Conhecer a raça
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Descrição, avaliações e perguntas ───────────────── */}
      <div className={`${CONTAINER} py-12 md:py-16`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <SectionHeader eyebrow="Sobre este item" title="Descrição" />
            <div
              className="prose prose-sm mt-5 max-w-none text-muted-foreground md:prose-base"
              dangerouslySetInnerHTML={{ __html: plainTextToHtml(post.description) }}
            />
          </div>
          <aside className="h-fit rounded-2xl border border-border bg-card p-5 md:p-6">
            <h2 className="font-display text-xl">Avaliações</h2>
            <div className="mt-3">
              <StarsDisplay average={summary?.average ?? 0} count={summary?.count ?? 0} size="md" />
            </div>
            <div className="mt-3 text-sm">
              {loggedIn ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">{myRating ? "Sua avaliação:" : "Avalie este item:"}</span>
                  <StarsInput
                    value={myRating ?? 0}
                    onRate={(v) => {
                      rateMutation.mutate(v);
                      toast.success("Avaliação enviada!");
                    }}
                  />
                </div>
              ) : (
                <p className="text-muted-foreground">
                  <Link to="/conta/login" className="font-semibold text-primary hover:underline">
                    Entre na sua conta
                  </Link>{" "}
                  para avaliar.
                </p>
              )}
            </div>
          </aside>
        </div>

        {faq.length > 0 && (
          <section className="mt-14">
            <SectionHeader eyebrow="Dúvidas" title="Perguntas e respostas" />
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {faq.map((f) => (
                <li key={f.id} className="py-5">
                  <p className="font-display text-lg">{f.question}</p>
                  <div className="prose prose-sm mt-2 max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: f.answer ?? "" }} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <CommentsSection postId={post.id} isAdmin={isAdmin} />

        {related.length > 0 && (
          <section className="mt-14">
            <SectionHeader
              eyebrow="Catálogo"
              title="Mais do plantel"
              action={
                <Link to="/catalogo" className={textLink}>
                  Ver catálogo completo
                </Link>
              }
            />
            <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {related.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <ProductCard p={p} category={catLabel(p.category)} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <CtaBand message={`Olá! Vim pela página de ${nome} e tenho uma dúvida.`} />
    </SiteLayout>
  );
}
