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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setSession = useShop((s) => s.setSession);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        const result = await registerCustomer({ data: { name, email, password } });
        if (!result.ok) { setError(result.error ?? "Falha ao criar conta."); return; }
        setSession(result.customerId!, name, email);
      } else {
        const result = await loginCustomerFn({ data: { email, password } });
        if (!result.ok) { setError(result.error ?? "E-mail ou senha inválidos."); return; }
        setSession(result.customerId!, result.name!, email);
      }
      toast.success(mode === "login" ? "Bem-vindo de volta!" : "Conta criada com sucesso!");
      navigate({ to: "/conta" });
    } catch {
      setError("Erro ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "mt-1 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-md px-4 py-16 md:py-24">
        <div className="rounded-3xl bg-card p-8 shadow-[var(--shadow-card)]">
          <div className="flex gap-2 rounded-full bg-muted p-1 text-sm font-semibold">
            <button onClick={() => setMode("login")} className={`flex-1 rounded-full px-4 py-2 transition ${mode === "login" ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"}`}>Entrar</button>
            <button onClick={() => setMode("register")} className={`flex-1 rounded-full px-4 py-2 transition ${mode === "register" ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"}`}>Criar conta</button>
          </div>
          <h1 className="mt-6 font-display text-2xl">{mode === "login" ? "Entrar na sua conta" : "Criar uma conta"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Acesse para acompanhar seus pedidos." : "É rápido — os dados ficam salvos apenas no seu navegador."}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "register" && (
              <label className="block"><span className={labelCls}>Nome</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
              </label>
            )}
            <label className="block"><span className={labelCls}>E-mail</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} />
            </label>
            <label className="block"><span className={labelCls}>Senha</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4} className={inputCls} />
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
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
