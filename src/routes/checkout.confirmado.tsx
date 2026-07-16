import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { useHydrated } from "@/hooks/use-hydrated";
import { useShop } from "@/lib/shop-store";

type Search = { id?: string };

export const Route = createFileRoute("/checkout/confirmado")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  head: () => ({ meta: [{ title: "Pedido confirmado — Galinha GSB" }, { name: "robots", content: "noindex" }] }),
  component: Confirmed,
});

function Confirmed() {
  const hydrated = useHydrated();
  const { id } = Route.useSearch();
  const orders = useShop((s) => s.orders);
  const order = orders.find((o) => o.id === id);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-16 text-center md:py-24">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary"><CheckCircle2 className="h-9 w-9" /></span>
        <h1 className="mt-6 font-display text-3xl md:text-4xl">Pedido confirmado!</h1>
        <p className="mt-2 text-muted-foreground">Obrigado pela compra. Entraremos em contato para combinar entrega e pagamento.</p>
        {hydrated && order && (
          <div className="mt-8 rounded-3xl bg-card p-6 text-left shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Pedido</div>
              <div className="font-mono text-sm">#{order.id.slice(0, 8)}</div>
            </div>
            <ul className="mt-4 divide-y">
              {order.items.map((i) => (
                <li key={i.postId} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-muted-foreground">{i.quantity}× {i.title}</span>
                  <span>R$ {(i.price * i.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t pt-4 font-display text-xl"><span>Total</span><span className="text-primary">R$ {order.total.toFixed(2)}</span></div>
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/catalogo" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">Continuar comprando</Link>
          <Link to="/conta" className="rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted">Ver meus pedidos</Link>
        </div>
      </div>
    </SiteLayout>
  );
}
