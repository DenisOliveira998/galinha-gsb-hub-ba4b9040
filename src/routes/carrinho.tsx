import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { useHydrated } from "@/hooks/use-hydrated";
import { buildOrderMessage, cartTotal, useShop } from "@/lib/shop-store";
import { useStore, whatsappHref } from "@/lib/mock-store";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Carrinho — Galinha GSB" }, { name: "robots", content: "noindex" }] }),
  component: CartPage,
});

function CartPage() {
  const hydrated = useHydrated();
  const cart = useShop((s) => s.cart);
  const updateQuantity = useShop((s) => s.updateQuantity);
  const removeFromCart = useShop((s) => s.removeFromCart);
  const total = cartTotal(cart);
  const settings = useStore((s) => s.settings);
  const whatsappUrl = whatsappHref(settings, buildOrderMessage(cart));

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
        <h1 className="font-display text-3xl md:text-4xl">Seu carrinho</h1>
        {hydrated && cart.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-muted p-12 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 opacity-40" />
            <p className="mt-3 text-muted-foreground">Seu carrinho está vazio.</p>
            <Link to="/catalogo" className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Ver catálogo</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.postId} className="flex gap-4 rounded-3xl bg-card p-4 shadow-[var(--shadow-soft)]">
                  <img src={item.image} alt={item.title} className="h-24 w-24 flex-none rounded-2xl object-cover" />
                  <div className="flex-1">
                    <Link to="/catalogo/$slug" params={{ slug: item.slug }} className="font-semibold hover:text-primary">{item.title}</Link>
                    <div className="mt-1 text-sm text-primary">R$ {item.price.toFixed(2)}</div>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.postId, item.quantity - 1)} className="grid h-8 w-8 place-items-center rounded-full border hover:bg-muted" aria-label="Diminuir"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="min-w-[2rem] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.postId, item.quantity + 1)} className="grid h-8 w-8 place-items-center rounded-full border hover:bg-muted" aria-label="Aumentar"><Plus className="h-3.5 w-3.5" /></button>
                      <button onClick={() => removeFromCart(item.postId)} className="ml-auto inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Remover</button>
                    </div>
                  </div>
                  <div className="hidden text-right font-semibold sm:block">R$ {(item.price * item.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>
            <aside className="h-fit rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-lg">Resumo</h2>
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>R$ {total.toFixed(2)}</span></div>
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground"><span>Frete</span><span>a combinar</span></div>
              <div className="mt-4 flex items-center justify-between border-t pt-4 font-display text-xl"><span>Total</span><span className="text-primary">R$ {total.toFixed(2)}</span></div>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105"><MessageCircle className="h-4 w-4" /> Entrar em contato</a>
              <Link to="/catalogo" className="mt-2 block rounded-full border px-6 py-3 text-center text-sm font-semibold hover:bg-muted">Continuar comprando</Link>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
