import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { LogOut, Package, User, Save, KeyRound, ChevronRight, ShoppingBag, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { useHydrated } from "@/hooks/use-hydrated";
import { useShop } from "@/lib/shop-store";
import { getCustomerProfile, updateCustomerProfile, syncBetterAuthUser, changeCustomerPassword } from "@/lib/customers";
import { authClient } from "@/lib/auth-client";

// ─── Utilitários de formatação e validação ────────────────────────────────────

/** Aplica máscara 000.000.000-00 */
function formatCPF(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** Valida CPF pelo algoritmo oficial (dígitos verificadores — Receita Federal) */
function validateCPF(cpf: string): boolean {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return false;
  if (/^(\d)\1+$/.test(d)) return false; // todos iguais (ex: 111.111.111-11)
  const sum = (digits: string, weights: number[]) =>
    weights.reduce((acc, w, i) => acc + parseInt(digits[i]) * w, 0);
  const r1 = sum(d, [10, 9, 8, 7, 6, 5, 4, 3, 2]) % 11;
  if ((r1 < 2 ? 0 : 11 - r1) !== parseInt(d[9])) return false;
  const r2 = sum(d, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]) % 11;
  return (r2 < 2 ? 0 : 11 - r2) === parseInt(d[10]);
}

/** Aplica máscara (00) 0 0000-0000 celular / (00) 0000-0000 fixo */
function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2)  return d.length ? `(${d}` : "";
  if (d.length <= 6)  return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  // 11 dígitos → celular com 9
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}

/** Aplica máscara 00000-000 */
function formatCEP(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
}

/** Busca endereço na API ViaCEP */
async function fetchViaCEP(cep: string) {
  const d = cep.replace(/\D/g, "");
  if (d.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${d}/json/`);
    if (!res.ok) return null;
    const data = await res.json() as Record<string, string>;
    if (data.erro) return null;
    return { address: data.logradouro ?? "", city: data.localidade ?? "", state: data.uf ?? "" };
  } catch {
    return null;
  }
}

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

  // Validação CPF
  const [cpfTouched, setCpfTouched] = useState(false);
  const cpfValid = !profile?.cpf || !cpfTouched || profile.cpf.replace(/\D/g, "").length < 11
    ? null // ainda digitando — sem feedback
    : validateCPF(profile.cpf);

  // CEP
  const [cepLoading, setCepLoading]   = useState(false);
  const [cepError, setCepError]       = useState("");

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

  const handleCepBlur = async () => {
    if (!profile) return;
    const digits = profile.zip.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    setCepError("");
    const result = await fetchViaCEP(profile.zip);
    setCepLoading(false);
    if (!result) { setCepError("CEP não encontrado."); return; }
    setProfile((p) => p ? {
      ...p,
      address: result.address || p.address,
      city:    result.city    || p.city,
      state:   result.state   || p.state,
    } : p);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !currentCustomerId) return;
    if (!profile.name.trim()) { setSaveError("Nome é obrigatório."); return; }
    if (profile.cpf && profile.cpf.replace(/\D/g, "").length === 11 && !validateCPF(profile.cpf)) {
      setSaveError("CPF inválido. Verifique os dígitos e tente novamente.");
      return;
    }
    if (profile.zip && profile.zip.replace(/\D/g, "").length > 0 && profile.zip.replace(/\D/g, "").length !== 8) {
      setSaveError("CEP deve ter 8 dígitos.");
      return;
    }
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

                {/* CPF com máscara e validação */}
                <div>
                  <label className={labelCls}>CPF</label>
                  <div className="relative">
                    <input
                      value={profile.cpf}
                      onChange={(e) => {
                        setProfile((p) => p ? { ...p, cpf: formatCPF(e.target.value) } : p);
                      }}
                      onBlur={() => setCpfTouched(true)}
                      placeholder="000.000.000-00"
                      inputMode="numeric"
                      maxLength={14}
                      disabled={saving}
                      className={`${inputCls} pr-9 ${
                        cpfValid === false ? "border-destructive focus:ring-destructive/40" :
                        cpfValid === true  ? "border-green-500 focus:ring-green-500/30" : ""
                      }`}
                    />
                    {cpfValid === true  && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 pointer-events-none" />}
                    {cpfValid === false && <XCircle      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive pointer-events-none" />}
                  </div>
                  {cpfValid === false && (
                    <p className="mt-1 text-xs text-destructive">CPF inválido — verifique os dígitos.</p>
                  )}
                </div>

                {/* Telefone com máscara */}
                <div>
                  <label className={labelCls}>Telefone / WhatsApp</label>
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => p ? { ...p, phone: formatPhone(e.target.value) } : p)}
                    placeholder="(00) 0 0000-0000"
                    inputMode="numeric"
                    maxLength={16}
                    disabled={saving}
                    className={inputCls}
                  />
                </div>

                {/* CEP com máscara e ViaCEP */}
                <div className="md:col-span-2">
                  <label className={labelCls}>CEP</label>
                  <div className="relative">
                    <input
                      value={profile.zip}
                      onChange={(e) => {
                        const v = formatCEP(e.target.value);
                        setProfile((p) => p ? { ...p, zip: v } : p);
                        setCepError("");
                      }}
                      onBlur={handleCepBlur}
                      placeholder="00000-000"
                      inputMode="numeric"
                      maxLength={9}
                      disabled={saving}
                      className={`${inputCls} pr-9 ${cepError ? "border-destructive focus:ring-destructive/40" : ""}`}
                    />
                    {cepLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground pointer-events-none" />}
                  </div>
                  {cepError && <p className="mt-1 text-xs text-destructive">{cepError}</p>}
                  {!cepError && !cepLoading && profile.zip.replace(/\D/g, "").length === 8 && (
                    <p className="mt-1 text-xs text-muted-foreground">Endereço preenchido automaticamente pelo CEP.</p>
                  )}
                </div>

                <div className="md:col-span-2">{field("Endereço", "address", "Rua, número, complemento")}</div>
                {field("Cidade", "city", "Sua cidade")}
                {field("Estado", "state", "UF")}

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
