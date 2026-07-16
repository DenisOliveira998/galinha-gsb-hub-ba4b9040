import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { LogOut, Package } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { useHydrated } from "@/hooks/use-hydrated";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/conta/")({ component: Account });

function Account() {
  const hydrated = useHydrated();
  const currentCustomerId = useShop((s) => s.currentCustomerId);
  const customers = useShop((s) => s.customers);
  const orders = useShop((s) => s.orders);
  const logoutCustomer = useShop((s) => s.logoutCustomer);
  const navigate = useNavigate();

  if (!hydrated) return <SiteLayout><div className="mx-auto max-w-3xl px-4 py-16" /></SiteLayout>;
  if (!currentCustomerId) return <Navigate to="/conta/login" />;
  const me = customers.find((c) => c.id === currentCustomerId);
  const myOrders = orders.filter((o) => o.customer.email === me?.email);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl">Olá, {me?.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{me?.email}</p>
          </div>
          <button onClick={() => { logoutCustomer(); toast.success("Sessão encerrada."); navigate({ to: "/" }); }} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
        <section className="mt-10">
          <h2 className="font-display text-xl">Meus pedidos</h2>
          {myOrders.length === 0 ? (
            <div className="mt-4 rounded-3xl bg-muted p-8 text-center text-sm text-muted-foreground">
              Você ainda não fez nenhum pedido. <Link to="/catalogo" className="text-primary hover:underline">Ver catálogo</Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {myOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Package className="h-5 w-5" /></span>
                    <div>
                      <div className="text-sm font-semibold">Pedido #{o.id.slice(0, 6)}</div>
                      <div className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString("pt-BR")} · {o.items.length} item(s)</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-primary">R$ {o.total.toFixed(2)}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </SiteLayout>
  );
}
