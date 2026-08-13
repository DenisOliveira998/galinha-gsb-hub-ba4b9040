import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { usePostsQuery } from "@/lib/hooks/use-posts";
import { useBlogPostsQuery } from "@/lib/hooks/use-blog";
import { FileText, Newspaper, Plus, ShoppingBag, Users } from "lucide-react";
import { listOrders, listCustomers } from "@/lib/orders";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    const [orders, customers] = await Promise.allSettled([listOrders(), listCustomers()]);
    return {
      orders: orders.status === "fulfilled" ? orders.value : [],
      customers: customers.status === "fulfilled" ? customers.value : [],
    };
  },
  component: Dashboard,
});

function Dashboard() {
  const { orders, customers } = Route.useLoaderData();
  const { data: posts = [] } = usePostsQuery();
  const { data: blog = [] } = useBlogPostsQuery();
  const published = posts.filter((p) => p.status === "PUBLISHED").length;
  const pending = orders.filter((o) => o.status === "PENDING").length;

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Anúncios publicados" value={published} icon={FileText} />
        <Stat label="Posts do blog" value={blog.length} icon={Newspaper} />
        <Stat label="Pedidos pendentes" value={pending} icon={ShoppingBag} color="text-amber-500" />
        <Stat label="Clientes cadastrados" value={customers.length} icon={Users} color="text-primary" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickLink to="/admin/posts"    label="Anúncios"   sub="Gerenciar catálogo" />
        <QuickLink to="/admin/blog"     label="Blog"       sub="Gerenciar posts" />
        <QuickLink to="/admin/pedidos"  label="Pedidos"    sub={`${pending} pendente${pending !== 1 ? "s" : ""}`} highlight={pending > 0} />
        <QuickLink to="/admin/clientes" label="Clientes"   sub={`${customers.length} cadastrado${customers.length !== 1 ? "s" : ""}`} />
      </div>
      <div className="mt-8 rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg">Últimos anúncios</h3>
          <Link to="/admin/posts" className="text-sm text-primary">Ver todos</Link>
        </div>
        <div className="divide-y">
          {posts.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.status}</div>
              </div>
              <Link to="/admin/posts/$id" params={{ id: p.id }} className="text-xs text-primary hover:underline">Editar</Link>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">Nenhum anúncio cadastrado ainda.</p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value, icon: Icon, color = "text-foreground" }: { label: string; value: number; icon: typeof FileText; color?: string }) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <div className={`mt-2 font-display text-3xl ${color}`}>{value}</div>
    </div>
  );
}

function QuickLink({ to, label, sub, highlight = false }: { to: string; label: string; sub: string; highlight?: boolean }) {
  return (
    <Link to={to} className={`flex items-center justify-between rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition ${highlight ? "ring-2 ring-amber-400" : ""}`}>
      <div>
        <div className="text-sm text-muted-foreground">{sub}</div>
        <div className="font-display text-xl">{label}</div>
      </div>
      <Plus className="h-5 w-5 text-primary" />
    </Link>
  );
}
