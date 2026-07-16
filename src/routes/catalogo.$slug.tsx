import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Zap } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { useStore, CATEGORY_LABELS } from "@/lib/mock-store";
import { useShop } from "@/lib/shop-store";

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
  const settings = useStore((s) => s.settings);
  const addToCart = useShop((s) => s.addToCart);
  const navigate = useNavigate();
  if (!post) throw notFound();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <Link to="/catalogo" className="text-sm text-muted-foreground hover:text-foreground">← Voltar ao catálogo</Link>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
            <img src={post.images[0]} alt={post.title} className="aspect-square w-full object-cover" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">{CATEGORY_LABELS[post.category]}</div>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">{post.title}</h1>
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
              <a href={`https://wa.me/?text=Olá! Tenho interesse em: ${post.title}`} className="rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted">
                Falar no WhatsApp
              </a>
              <Link to="/contato" className="rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted">Ver contato ({settings.whatsapp})</Link>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}