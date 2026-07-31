import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { HelpCircle, ShoppingBag, Zap } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { useStore, useCategoryLabel, ratingAverage, whatsappHref } from "@/lib/mock-store";
import { useShop } from "@/lib/shop-store";
import { CommentsSection } from "@/components/site/comments-section";
import { FavoriteButton } from "@/components/site/favorite-button";
import { StarsDisplay, StarsInput } from "@/components/site/star-rating";
import { useHydrated } from "@/hooks/use-hydrated";

export const Route = createFileRoute("/catalogo/$slug")({
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
  const { slug } = Route.useParams();
  const post = useStore((s) => s.posts.find((p) => p.slug === slug));
  const catLabel = useCategoryLabel();
  const settings = useStore((s) => s.settings);
  const allPosts = useStore((s) => s.posts);
  const ratings = useStore((s) => s.ratings);
  const myRatings = useStore((s) => s.myRatings);
  const ratePost = useStore((s) => s.ratePost);
  const hydrated = useHydrated();
  const addToCart = useShop((s) => s.addToCart);
  const navigate = useNavigate();
  if (!post) throw notFound();

  const { average, count } = hydrated ? ratingAverage(ratings, post.id) : { average: 0, count: 0 };
  const myRating = hydrated ? (myRatings ?? {})[post.id] ?? 0 : 0;
  const faq = (post.faq ?? []).filter((f) => f.question.trim() || f.answer.trim());
  const related = allPosts
    .filter((p) => p.id !== post.id && p.category === post.category && p.status !== "DRAFT")
    .slice(0, 3);

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
            <div className="mt-2"><StarsDisplay average={average} count={count} size="md" /></div>
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
              <a href={whatsappHref(settings, `Olá! Tenho interesse em: ${post.title}`)} target="_blank" rel="noopener noreferrer" className="rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted">
                Falar no WhatsApp
              </a>
              <Link to="/contato" className="rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted">Ver contato ({settings.whatsapp})</Link>
              <FavoriteButton postId={post.id} title={post.title} withLabel />
            </div>

            <div className="mt-8 rounded-3xl bg-card p-5 text-left shadow-[var(--shadow-soft)]">
              <h2 className="font-display text-lg">Avalie este anúncio</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {myRating ? `Sua avaliação: ${myRating} de 5.` : "Clique nas estrelas para avaliar."}
              </p>
              <div className="mt-2">
                <StarsInput
                  value={myRating}
                  onRate={(v) => {
                    ratePost(post.id, v);
                    toast.success(`Avaliação registrada: ${v} estrela${v > 1 ? "s" : ""}`);
                  }}
                />
              </div>
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

        <CommentsSection postId={post.id} />

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl md:text-2xl">Você também pode gostar</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {related.map((p) => {
                const r = hydrated ? ratingAverage(ratings, p.id) : { average: 0, count: 0 };
                return (
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
                      <div className="mt-1.5"><StarsDisplay average={r.average} count={r.count} /></div>
                      {p.price && <div className="mt-auto pt-3 text-sm font-semibold">R$ {p.price.toFixed(2)}</div>}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}