import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut, Package, User, Save } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { useHydrated } from "@/hooks/use-hydrated";
import { useShop } from "@/lib/shop-store";
import { getCustomerProfile, updateCustomerProfile } from "@/lib/customers";

export const Route = createFileRoute("/conta/")({
  loader: async ({ context }) => {
    // ID vem do Zustand (client-side), perfil completo do TiDB
    return { profile: null as Awaited<ReturnType<typeof getCustomerProfile>> | null };
  },
  component: Account,
});

const inputCls = "mt-1 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50";
const labelCls = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

function Account() {
  const hydrated = useHydrated();
  const currentCustomerId = useShop((s) => s.currentCustomerId);
  const customers = useShop((s) => s.customers);
  const orders = useShop((s) => s.orders);
  const logoutCustomer = useShop((s) => s.logoutCustomer);
  const navigate = useNavigate();

  const [profile, setProfile] = useState<{
    name: string; email: string; phone: string; cpf: string;
    address: string; city: string; state: string; zip: string;
  } | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Carrega perfil do TiDB quando hydratado
  const me = customers.find((c) => c.id === currentCustomerId);
  if (hydrated && currentCustomerId && !profileLoaded) {
    setProfileLoaded(true);
    getCustomerProfile({ data: { id: currentCustomerId } }).then((p) => {
      setProfile({
        name:    p?.name    ?? me?.name    ?? "",
        email:   p?.email   ?? me?.email   ?? "",
        phone:   p?.phone   ?? "",
        cpf:     p?.cpf     ?? "",
        address: p?.address ?? "",
        city:    p?.city    ?? "",
        state:   p?.state   ?? "",
        zip:     p?.zip     ?? "",
      });
    });
  }

  const myOrders = orders.filter((o) => o.customer.email === me?.email);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !currentCustomerId) return;
    if (!profile.name.trim()) { setSaveError("Nome é obrigatório."); return; }
    setSaveError("");
    setSaving(true);
    try {
      const result = await updateCustomerProfile({
        data: {
          id: currentCustomerId,
          name: profile.name.trim(),
          phone: profile.phone.trim() || undefined,
          cpf: profile.cpf.trim() || undefined,
          address: profile.address.trim() || undefined,
          city: profile.city.trim() || undefined,
          state: profile.state.trim() || undefined,
          zip: profile.zip.trim() || undefined,
        },
      });
      if (!result.ok) { setSaveError(result.error ?? "Erro ao salvar."); return; }
      toast.success("Perfil atualizado com sucesso!");
    } catch {
      setSaveError("Erro ao conectar ao servidor.");
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof typeof profile, placeholder = "") => {
    if (!profile) return null;
    return (
      <div>
        <label className={labelCls}>{label}</label>
        <input
          value={(profile as any)[key]}
          onChange={(e) => setProfile((p) => p ? { ...p, [key]: e.target.value } : p)}
          placeholder={placeholder}
          className={inputCls}
          disabled={saving}
        />
      </div>
    );
  };

  if (!hydrated) return <SiteLayout><div className="mx-auto max-w-3xl px-4 py-16" /></SiteLayout>;
  if (!currentCustomerId) return <Navigate to="/conta/login" />;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16 space-y-8">

        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl">Olá, {profile?.name || me?.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{profile?.email || me?.email}</p>
          </div>
          <button
            onClick={() => { logoutCustomer(); toast.success("Sessão encerrada."); navigate({ to: "/" }); }}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>

        {/* Perfil editável */}
        <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
          <h2 className="flex items-center gap-2 font-display text-xl">
            <User className="h-5 w-5 text-primary" /> Meus dados
          </h2>
          {!profile ? (
            <div className="mt-4 text-sm text-muted-foreground">Carregando...</div>
          ) : (
            <form onSubmit={handleSave} className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                {field("Nome completo", "name", "Seu nome completo")}
              </div>
              {field("CPF", "cpf", "000.000.000-00")}
              {field("Telefone / WhatsApp", "phone", "(00) 00000-0000")}
              <div className="md:col-span-2">
                {field("Endereço", "address", "Rua, número, complemento")}
              </div>
              {field("Cidade", "city", "Sua cidade")}
              {field("Estado", "state", "UF")}
              {field("CEP", "zip", "00000-000")}

              {saveError && <p className="md:col-span-2 text-sm text-destructive">{saveError}</p>}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105 disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Meus pedidos */}
        <section>
          <h2 className="font-display text-xl">Meus pedidos</h2>
          {myOrders.length === 0 ? (
            <div className="mt-4 rounded-3xl bg-muted p-8 text-center text-sm text-muted-foreground">
              Você ainda não fez nenhum pedido.{" "}
              <Link to="/catalogo" className="text-primary hover:underline">Ver catálogo</Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {myOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Package className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold">Pedido #{o.id.slice(0, 6)}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleString("pt-BR")} · {o.items.length} item(s)
                      </div>
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
