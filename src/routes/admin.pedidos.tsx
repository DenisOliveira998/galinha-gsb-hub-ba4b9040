import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Package, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { listOrders, completeOrder } from "@/lib/orders";

export const Route = createFileRoute("/admin/pedidos")({
  loader: async () => {
    const orders = await listOrders();
    return { orders };
  },
  component: Pedidos,
});

type Order = Awaited<ReturnType<typeof listOrders>>[number];
type SortKey = "recente" | "antigo" | "maior_valor" | "menor_valor" | "mais_itens";

function itemCount(o: Order) {
  return (o.items ?? []).reduce((s, i) => s + i.quantity, 0);
}

function Pedidos() {
  const { orders: initial } = Route.useLoaderData();
  const [orders, setOrders] = useState(initial);
  const [sort, setSort] = useState<SortKey>("recente");
  const [completing, setCompleting] = useState<string | null>(null);

  const sorted = [...orders].sort((a, b) => {
    if (sort === "recente") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sort === "antigo")  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sort === "maior_valor") return b.total - a.total;
    if (sort === "menor_valor") return a.total - b.total;
    if (sort === "mais_itens")  return itemCount(b) - itemCount(a);
    return 0;
  });

  const pending   = orders.filter((o) => o.status === "PENDING").length;
  const completed = orders.filter((o) => o.status === "COMPLETED").length;
  const revenue   = orders.reduce((s, o) => s + o.total, 0);

  const handleComplete = async (id: string) => {
    setCompleting(id);
    try {
      await completeOrder({ data: { id } });
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "COMPLETED" } : o));
    } finally {
      setCompleting(null);
    }
  };

  const filters: { key: SortKey; label: string }[] = [
    { key: "recente",     label: "Mais recente" },
    { key: "antigo",      label: "Mais antigo"  },
    { key: "maior_valor", label: "Maior valor"  },
    { key: "menor_valor", label: "Menor valor"  },
    { key: "mais_itens",  label: "Mais itens"   },
  ];

  return (
    <AdminShell title="Pedidos">
      {/* Estatísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total de pedidos" value={orders.length}          icon={ShoppingBag} />
        <Stat label="Pendentes"        value={pending}               icon={Clock}       color="text-amber-500" />
        <Stat label="Concluídos"       value={completed}             icon={Check}       color="text-green-500" />
        <Stat label="Receita total"    value={`R$ ${revenue.toFixed(2)}`} icon={DollarSign} color="text-primary" />
      </div>

      {/* Filtros */}
      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setSort(f.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              sort === f.key
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de pedidos */}
      <div className="mt-4 space-y-3">
        {sorted.length === 0 && (
          <div className="rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
            Nenhum pedido ainda.
          </div>
        )}
        {sorted.map((order) => (
          <div key={order.id} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{order.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    order.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {order.status === "COMPLETED" ? "Concluído" : "Pendente"}
                  </span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{order.email} · {order.phone}</div>
                <div className="mt-0.5 text-sm text-muted-foreground">
                  {order.address}, {order.city}/{order.state} — CEP {order.zip}
                </div>
                {order.notes && (
                  <div className="mt-1 text-xs text-muted-foreground">Obs.: {order.notes}</div>
                )}
              </div>
              <div className="text-right">
                <div className="font-display text-xl text-primary">R$ {order.total.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")} {new Date(order.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>

            {/* Itens */}
            {(order.items ?? []).length > 0 && (
              <ul className="mt-3 divide-y rounded-xl border text-sm">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 px-4 py-2">
                    <span className="line-clamp-1">{item.quantity}× {item.title}</span>
                    <span className="shrink-0 font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}

            {order.status === "PENDING" && (
              <button
                onClick={() => handleComplete(order.id)}
                disabled={completing === order.id}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                {completing === order.id ? "Concluindo…" : "Marcar como concluído"}
              </button>
            )}
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

function Stat({ label, value, icon: Icon, color = "text-foreground" }: {
  label: string; value: number | string; icon: typeof Package; color?: string;
}) {
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
