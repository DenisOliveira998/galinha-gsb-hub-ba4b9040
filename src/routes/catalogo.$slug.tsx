import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { HelpCircle, ShoppingBag, Zap } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { useShop } from "@/lib/shop-store";
import { CommentsSection } from "@/components/site/comments-section";
import { FavoriteButton } from "@/components/site/favorite-button";
import { StarsDisplay, StarsInput } from "@/components/site/star-rating";
import { getPostBySlug, listPosts } from "@/lib/posts";
import { listCategories } from "@/lib/categories";
import { useSettingsQuery } from "@/lib/hooks/use-settings";
import { useRatingSummaryQuery, useMyRatingQuery, useRatePostMutation } from "@/lib/hooks/use-ratings";
import { whatsappHref } from "@/lib/mock-store";
import { getAdminSession } from "@/lib/admin-auth";
import { authClient } from "@/lib/auth-client";

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
    return {
      post,
      posts: postsRes.status === "fulfilled" ? postsRes.value : [],
      categories: categoriesRes.status === "fulfilled" ? categoriesRes.value : [],
      isAdmin: !!(adminSessionRes.status === "fulfilled" && adminSessionRes.value),
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
  const addToCart = useShop((s) => s.addToCart);
  const navigate = useNavigate();

  const { data: session } = authClient.useSession();
  const loggedIn = !!session?.user;

  const { data: summary } = useRatingSummaryQuery(post.id);
  const { data: myRating } = useMyRatingQuery(post.id);
  const rateMutation = useRatePostMutation(post.id);

  const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;
  const faq = (post.faq ?? []).filter((f) => f.question.trim() || f.answer.trim());
  const related = posts
    .filter((p) => p.id !== post.id && p.category === post.category && p.status !== "DRAFT")
    .slice(0, 3);

  const waNumber = settings?.whatsappLink || settings?.whatsapp || "";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <Link to="/catalogo" className="text-sm text-muted-foreground hover:text-foreground">← Voltar ao catálogo</Link>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
            <img src={post.images[0]} alt={post.title} className="aspect-square w-full object-cover" />
            <FavoriteButton postId={post.id} title={post.title} className="absolute right-3 top-3" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">{catLabel(post.category)}</div>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">{post.title}</h1>
            <div className="mt-2 flex flex-col gap-1.5">
              <StarsDisplay average={summary?.average ?? 0} count={summary?.count ?? 0} size="md" />
              {loggedIn ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {myRating ? "Sua avaliação:" : "Avalie este anúncio:"}
                  </span>
                  <StarsInput
                    value={myRating ?? 0}
                    onRate={(v) => {
                      rateMutation.mutate(v);
                      toast.success("Avaliação enviada!");
                    }}
                  />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  <Link to="/conta/login" className="font-semibold text-primary hover:underline">
                    Faça login
                  </Link>{" "}
                  para avaliar este anúncio.
                </p>
              )}
            </div>
            {post.price && <div className="mt-4 font-display text-3xl text-primary">R$ {post.price.toFixed(2)}</div>}
            <p className="mt-6 whitespace-pre-line text-muted-foreground">{post.description}</p>
            {post.status !== "SOLD" && post.price && (
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(post);
                    toast.success("Adicionado ao carrinho", { description: post.title });
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/15"
                >
                  <ShoppingBag className="h-4 w-4" /> Adicionar ao carrinho
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(post);
                    navigate({ to: "/checkout" });
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105"
                >
                  <Zap className="h-4 w-4" /> Comprar agora
                </button>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {waNumber && (
                <a
                  href={whatsappHref(settings ?? { whatsappLink: waNumber, whatsapp: waNumber }, `Olá! Tenho interesse em: ${post.title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted"
                >
                  Falar no WhatsApp
                </a>
              )}
              <Link to="/contato" className="rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted">
                {waNumber ? `Ver contato (${settings?.whatsapp ?? ""})` : "Entrar em contato"}
              </Link>
              <FavoriteButton postId={post.id} title={post.title} withLabel />
            </div>
          </div>
        </div>

        {faq.length > 0 && (
          <section className="mt-12 rounded-3xl bg-card p-5 text-left shadow-[var(--shadow-soft)] md:p-7">
            <h2 className="flex items-center gap-2 font-display text-xl">
              <HelpCircle className="h-5 w-5 text-primary" /> Perguntas e respostas
            </h2>
            <ul className="mt-4 space-y-3">
              {faq.map((f) => (
                <li key={f.id} className="rounded-2xl bg-muted/60 p-4">
                  <p className="text-sm font-semibold">{f.question}</p>
                  <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{f.answer}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <CommentsSection postId={post.id} isAdmin={isAdmin} />

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl md:text-2xl">Você também pode gostar</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {related.map((p) => (
                <article key={p.id} className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card text-left shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]">
                  <FavoriteButton postId={p.id} title={p.title} className="absolute right-3 top-3 z-10" />
                  <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="aspect-[4/3] overflow-hidden">
                    <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </Link>
                  <div className="flex flex-1 flex-col p-4 text-left">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{catLabel(p.category)}</div>
                    <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="mt-1 line-clamp-2 font-display text-base hover:text-primary">
                      {p.title}
                    </Link>
                    <div className="mt-1.5"><StarsDisplay average={0} count={0} size="sm" /></div>
                    {p.price && <div className="mt-auto pt-3 text-sm font-semibold">R$ {p.price.toFixed(2)}</div>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
