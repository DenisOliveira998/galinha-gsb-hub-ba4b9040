import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { useShop } from "@/lib/shop-store";
import { registerCustomer, loginCustomer as loginCustomerFn } from "@/lib/customers";

export const Route = createFileRoute("/conta/login")({
  component: CustomerAuth,
});

function CustomerAuth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const setSession = useShop((s) => s.setSession);
  const navigate = useNavigate();

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (mode === "register" && !name.trim()) next.name = "Campo obrigatório.";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) next.email = "E-mail inválido.";
    if (password.length < 6) next.password = "A senha deve ter pelo menos 6 caracteres.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setErrors({});
    setLoading(true);
    try {
      if (mode === "register") {
        const result = await registerCustomer({ data: { name: name.trim(), email: email.trim().toLowerCase(), password } });
        if (!result.ok) {
          const msg = result.error ?? "Falha ao criar conta.";
          if (msg.toLowerCase().includes("e-mail") || msg.toLowerCase().includes("email")) {
            setErrors({ email: msg });
          } else {
            setErrors({ general: msg });
          }
          return;
        }
        setSession(result.customerId!, name.trim(), email.trim().toLowerCase());
      } else {
        const result = await loginCustomerFn({ data: { email: email.trim().toLowerCase(), password } });
        if (!result.ok) {
          const msg = result.error ?? "E-mail ou senha inválidos.";
          if (msg.toLowerCase().includes("senha")) {
            setErrors({ password: msg });
          } else {
            setErrors({ email: msg });
          }
          return;
        }
        setSession(result.customerId!, result.name!, email.trim().toLowerCase());
      }
      toast.success(mode === "login" ? "Bem-vindo de volta!" : "Conta criada com sucesso!");
      navigate({ to: "/conta" });
    } catch {
      setErrors({ general: "Erro ao conectar ao servidor. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "mt-1 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const inputErr  = "mt-1 w-full rounded-2xl border border-destructive bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-destructive";
  const labelCls  = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-md px-4 py-16 md:py-24">
        <div className="rounded-3xl bg-card p-8 shadow-[var(--shadow-card)]">
          <div className="flex gap-2 rounded-full bg-muted p-1 text-sm font-semibold">
            <button onClick={() => { setMode("login"); setErrors({}); }} className={`flex-1 rounded-full px-4 py-2 transition ${mode === "login" ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"}`}>Entrar</button>
            <button onClick={() => { setMode("register"); setErrors({}); }} className={`flex-1 rounded-full px-4 py-2 transition ${mode === "register" ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"}`}>Criar conta</button>
          </div>
          <h1 className="mt-6 font-display text-2xl">{mode === "login" ? "Entrar na sua conta" : "Criar uma conta"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Acesse para acompanhar seus pedidos." : "Preencha os dados abaixo para criar sua conta."}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "register" && (
              <div>
                <label className={labelCls}>Nome</label>
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
                  className={errors.name ? inputErr : inputBase}
                  placeholder="Seu nome"
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className={labelCls}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
                className={errors.email ? inputErr : inputBase}
                placeholder="seu@email.com"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>

            <div>
              <label className={labelCls}>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
                className={errors.password ? inputErr : inputBase}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>

            {errors.general && <p className="text-sm text-destructive">{errors.general}</p>}

            <button type="submit" disabled={loading} className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105 disabled:opacity-60">
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">← Voltar ao site</Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
