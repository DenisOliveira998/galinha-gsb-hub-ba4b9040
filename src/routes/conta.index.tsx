import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { LogOut, Package, User, Save, KeyRound, ChevronRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { useHydrated } from "@/hooks/use-hydrated";
import { useShop } from "@/lib/shop-store";
import { getCustomerProfile, updateCustomerProfile, syncBetterAuthUser, changeCustomerPassword } from "@/lib/customers";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/conta/")({
  head: () => ({ meta: [{ title: "Minha conta — Galinha GSB" }] }),
  component: Account,
});

const inputCls = "mt-1 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50";
const labelCls = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl bg-card p-6 shadow-[var(--shadow-card)] md:p-8 ${className}`}>
      {children}
    </section>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
function Account() {
  const hydrated             = useHydrated();
  const currentCustomerId    = useShop((s) => s.currentCustomerId);
  const orders               = useShop((s) => s.orders);
  const logoutCustomer       = useShop((s) => s.logoutCustomer);
  const setSession           = useShop((s) => s.setSession);
  const customers            = useShop((s) => s.customers);
  const navigate             = useNavigate();

  const me = customers.find((c) => c.id === currentCustomerId);

  // Sessão Better Auth (para login via Google/OTP)
  const { data: baSession }  = authClient.useSession();

  // Sincroniza sessão Better Auth → Zustand (após redirect do Google ou OTP)
  const synced = useRef(false);
  useEffect(() => {
    if (!hydrated || synced.current) return;
    if (!baSession?.user) return;
    if (currentCustomerId) { synced.current = true; return; } // já tem sessão

    synced.current = true;
    const { id, name, email } = baSession.user;
    syncBetterAuthUser({ data: { userId: id, name: name ?? "", email } })
      .then((r) => {
        if (r.ok) setSession(r.customerId!, r.name!, email);
      })
      .catch(console.error);
  }, [hydrated, baSession, currentCustomerId, setSession]);

  // Perfil carregado do TiDB
  const [profile, setProfile]       = useState<{
    name: string; email: string; phone: string; cpf: string;
    address: string; city: string; state: string; zip: string;
  } | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [saving, setSaving]               = useState(false);
  const [saveError, setSaveError]         = useState("");

  // Card ativo (mobile: só um de cada vez)
  const [activeCard, setActiveCard] = useState<"orders" | "data" | "security" | null>(null);

  // Carrega perfil do TiDB
  const id = currentCustomerId;
  useEffect(() => {
    if (!id || profileLoaded) return;
    setProfileLoaded(true);
    getCustomerProfile({ data: { id } }).then((p) => {
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
    }).catch(console.error);
  }, [id, profileLoaded, me]);

  const myOrders = orders.filter((o) => o.customer.email === (profile?.email || me?.email));

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
          name:    profile.name.trim(),
          phone:   profile.phone.trim()   || undefined,
          cpf:     profile.cpf.trim()     || undefined,
          address: profile.address.trim() || undefined,
          city:    profile.city.trim()    || undefined,
          state:   profile.state.trim()   || undefined,
          zip:     profile.zip.trim()     || undefined,
        },
      });
      if (!result.ok) { setSaveError(result.error ?? "Erro ao salvar."); return; }
      toast.success("Perfil atualizado!");
    } catch {
      setSaveError("Erro ao conectar ao servidor.");
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof NonNullable<typeof profile>, placeholder = "") => {
    if (!profile) return null;
    return (
      <div>
        <label className={labelCls}>{label}</label>
        <input
          value={(profile as Record<string, string>)[key] ?? ""}
          onChange={(e) => setProfile((p) => p ? { ...p, [key]: e.target.value } : p)}
          placeholder={placeholder}
          className={inputCls}
          disabled={saving}
        />
      </div>
    );
  };

  const handleLogout = () => {
    logoutCustomer();
    // Encerra também sessão Better Auth (se existir)
    authClient.signOut().catch(() => {});
    toast.success("Sessão encerrada.");
    navigate({ to: "/" });
  };

  // Guards
  if (!hydrated) return <SiteLayout><div className="mx-auto max-w-3xl px-4 py-16" /></SiteLayout>;

  // Aguarda sincronização Better Auth antes de redirecionar
  const hasBaSession = !!baSession?.user;
  if (!currentCustomerId && !hasBaSession) return <Navigate to="/conta/login" />;
  if (!currentCustomerId && hasBaSession) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-muted-foreground">
          Entrando na sua conta...
        </div>
      </SiteLayout>
    );
  }

  const displayName  = profile?.name  || me?.name  || "Cliente";
  const displayEmail = profile?.email || me?.email || "";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">

        {/* Cabeçalho */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Minha conta</p>
            <h1 className="mt-1 font-display text-3xl md:text-4xl">Olá, {displayName.split(" ")[0]}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{displayEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted transition"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>

        {/* Grid de cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <CardButton
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Meus Pedidos"
            desc={myOrders.length > 0 ? `${myOrders.length} pedido(s)` : "Nenhum pedido"}
            active={activeCard === "orders"}
            onClick={() => setActiveCard(activeCard === "orders" ? null : "orders")}
          />
          <CardButton
            icon={<User className="h-5 w-5" />}
            title="Meus Dados"
            desc="Endereço e contato"
            active={activeCard === "data"}
            onClick={() => setActiveCard(activeCard === "data" ? null : "data")}
          />
          <CardButton
            icon={<KeyRound className="h-5 w-5" />}
            title="Segurança"
            desc="E-mail e senha"
            active={activeCard === "security"}
            onClick={() => setActiveCard(activeCard === "security" ? null : "security")}
          />
        </div>

        {/* ── Meus Pedidos ────────────────────────────────────────────────── */}
        {activeCard === "orders" && (
          <Card>
            <h2 className="flex items-center gap-2 font-display text-xl">
              <ShoppingBag className="h-5 w-5 text-primary" /> Meus Pedidos
            </h2>
            {myOrders.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-muted p-8 text-center text-sm text-muted-foreground">
                Você ainda não fez nenhum pedido.{" "}
                <Link to="/catalogo" className="text-primary hover:underline">Ver catálogo</Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {myOrders.map((o) => (
                  <li key={o.id} className="flex items-center justify-between rounded-2xl bg-muted/50 p-4">
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
          </Card>
        )}

        {/* ── Meus Dados ──────────────────────────────────────────────────── */}
        {activeCard === "data" && (
          <Card>
            <h2 className="flex items-center gap-2 font-display text-xl">
              <User className="h-5 w-5 text-primary" /> Meus Dados
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Esses dados são usados para pré-preencher o checkout automaticamente.
            </p>
            {!profile ? (
              <div className="mt-4 text-sm text-muted-foreground">Carregando...</div>
            ) : (
              <form onSubmit={handleSave} className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">{field("Nome completo", "name", "Seu nome completo")}</div>
                {field("CPF", "cpf", "000.000.000-00")}
                {field("Telefone / WhatsApp", "phone", "(00) 00000-0000")}
                <div className="md:col-span-2">{field("Endereço", "address", "Rua, número, complemento")}</div>
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
          </Card>
        )}

        {/* ── Segurança ────────────────────────────────────────────────────── */}
        {activeCard === "security" && (
          <Card>
            <h2 className="flex items-center gap-2 font-display text-xl">
              <KeyRound className="h-5 w-5 text-primary" /> Segurança
            </h2>
            {hasBaSession && baSession?.user ? (
              <div className="mt-4 rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
                Você entrou pelo <strong>Google</strong> ou código por e-mail. Suas credenciais são gerenciadas pelo provedor.
                Para trocar o e-mail, acesse as configurações da sua conta Google.
              </div>
            ) : (
              <PasswordChangeForm email={displayEmail} customerId={currentCustomerId!} />
            )}
          </Card>
        )}
      </div>
    </SiteLayout>
  );
}

// ─── Card de navegação ────────────────────────────────────────────────────────
function CardButton({
  icon, title, desc, active, onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-3xl border p-5 text-left transition hover:shadow-md ${
        active
          ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
          : "bg-card shadow-[var(--shadow-card)] hover:border-primary/30"
      }`}
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground truncate">{desc}</div>
      </div>
      <ChevronRight className={`h-4 w-4 shrink-0 transition ${active ? "rotate-90 text-primary" : "text-muted-foreground"}`} />
    </button>
  );
}

// ─── Formulário troca de senha (só para contas email+senha) ───────────────────
function PasswordChangeForm({ email, customerId }: { email: string; customerId: string }) {
  const [current, setCurrent]   = useState("");
  const [next, setNext]         = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 6) { setError("A nova senha deve ter pelo menos 6 caracteres."); return; }
    if (next !== confirm) { setError("As senhas não coincidem."); return; }
    setError("");
    setLoading(true);
    try {
      const result = await changeCustomerPassword({
        data: { id: customerId, currentPassword: current, newPassword: next },
      });
      if (!result.ok) { setError(result.error ?? "Erro ao alterar senha."); return; }
      setSuccess(true);
      toast.success("Senha alterada com sucesso!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao alterar senha.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mt-4 rounded-2xl bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-700 dark:text-green-400">
        Senha alterada com sucesso!
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-4">
      <div>
        <label className={labelCls}>E-mail da conta</label>
        <input value={email} disabled className={`${inputCls} opacity-60`} />
      </div>
      <div>
        <label className={labelCls}>Senha atual</label>
        <input type="password" value={current} onChange={(e) => { setCurrent(e.target.value); setError(""); }} className={inputCls} placeholder="••••••••" />
      </div>
      <div>
        <label className={labelCls}>Nova senha</label>
        <input type="password" value={next} onChange={(e) => { setNext(e.target.value); setError(""); }} className={inputCls} placeholder="Mínimo 6 caracteres" />
      </div>
      <div>
        <label className={labelCls}>Confirmar nova senha</label>
        <input type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} className={inputCls} placeholder="Repita a senha" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105 disabled:opacity-60"
      >
        {loading ? "Alterando..." : "Alterar senha"}
      </button>
    </form>
  );
}
