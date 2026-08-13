import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Chrome, KeyRound, ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { useShop } from "@/lib/shop-store";
import { registerCustomer, loginCustomer as loginCustomerFn, syncBetterAuthUser } from "@/lib/customers";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/conta/login")({
  component: CustomerAuth,
});

// ─── Estilos ──────────────────────────────────────────────────────────────────

const inputBase = "mt-1 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const inputErr  = "mt-1 w-full rounded-2xl border border-destructive bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-destructive";
const labelCls  = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

// ─── Componente principal ─────────────────────────────────────────────────────

function CustomerAuth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");

  // Estado — e-mail + senha
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors]     = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  const [loading, setLoading]   = useState(false);

  // Estado — OTP
  const [otpEmail, setOtpEmail]   = useState("");
  const [otp, setOtp]             = useState("");
  const [otpSent, setOtpSent]     = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError]   = useState("");

  const setSession  = useShop((s) => s.setSession);
  const navigate    = useNavigate();

  // ── Helper: sync após Better Auth ─────────────────────────────────────────
  const syncAndGo = async (userId: string, userName: string, userEmail: string) => {
    const result = await syncBetterAuthUser({ data: { userId, name: userName, email: userEmail } });
    if (result.ok) {
      setSession(result.customerId!, result.name!, userEmail);
      toast.success("Bem-vindo de volta!");
      navigate({ to: "/conta" });
    } else {
      toast.error(result.error ?? "Erro ao sincronizar conta.");
    }
  };

  // ── Google OAuth ───────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/conta",
      });
      if (result?.error) {
        toast.error(`Erro Google: ${result.error.message ?? result.error.status ?? "desconhecido"}`);
      }
      // Se ok → Better Auth redireciona automaticamente para o Google
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao conectar com Google.");
    } finally {
      setLoading(false);
    }
  };

  // ── Email OTP — enviar código ──────────────────────────────────────────────
  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrimmed = otpEmail.trim().toLowerCase();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed);
    if (!emailOk) { setOtpError("E-mail inválido."); return; }
    setOtpError("");
    setOtpLoading(true);
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({ email: emailTrimmed, type: "sign-in" });
      if (result.error) {
        const detail = result.error.message || (result.error as any).code || (result.error as any).statusText || JSON.stringify(result.error);
        setOtpError(`Erro (${(result.error as any).status ?? "?"}): ${detail}`);
        return;
      }
      setOtpSent(true);
      toast.success("Código enviado! Verifique seu e-mail.");
    } catch (err) {
      setOtpError(err instanceof Error ? `${err.name}: ${err.message}` : JSON.stringify(err));
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Email OTP — verificar código ───────────────────────────────────────────
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.replace(/\D/g, "").length !== 6) { setOtpError("O código deve ter 6 dígitos."); return; }
    setOtpError("");
    setOtpLoading(true);
    try {
      const result = await authClient.signIn.emailOtp({ email: otpEmail.trim().toLowerCase(), otp: otp.trim() });
      if (result.error) { setOtpError(result.error.message ?? "Código inválido."); return; }
      if (result.data?.user) {
        const u = result.data.user;
        await syncAndGo(u.id, u.name, u.email);
      }
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Erro ao verificar código.");
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Email + Senha ──────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const next: typeof errors = {};
    if (mode === "register" && !name.trim()) next.name = "Campo obrigatório.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "E-mail inválido.";
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
          setErrors(msg.toLowerCase().includes("e-mail") || msg.toLowerCase().includes("email") ? { email: msg } : { general: msg });
          return;
        }
        setSession(result.customerId!, name.trim(), email.trim().toLowerCase());
      } else {
        const result = await loginCustomerFn({ data: { email: email.trim().toLowerCase(), password } });
        if (!result.ok) {
          const msg = result.error ?? "E-mail ou senha inválidos.";
          setErrors(msg.toLowerCase().includes("senha") ? { password: msg } : { email: msg });
          return;
        }
        setSession(result.customerId!, result.name!, email.trim().toLowerCase());
      }
      toast.success(mode === "login" ? "Bem-vindo de volta!" : "Conta criada com sucesso!");
      navigate({ to: "/conta" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      setErrors({ general: `Erro: ${msg}` });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-md px-4 py-16 md:py-24">
        <div className="rounded-3xl bg-card p-8 shadow-[var(--shadow-card)]">

          {/* Toggle Entrar / Criar conta */}
          <div className="flex gap-2 rounded-full bg-muted p-1 text-sm font-semibold">
            <button
              onClick={() => { setMode("login"); setErrors({}); setAuthMethod("password"); }}
              className={`flex-1 rounded-full px-4 py-2 transition ${mode === "login" ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"}`}
            >Entrar</button>
            <button
              onClick={() => { setMode("register"); setErrors({}); setAuthMethod("password"); }}
              className={`flex-1 rounded-full px-4 py-2 transition ${mode === "register" ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"}`}
            >Criar conta</button>
          </div>

          <h1 className="mt-6 font-display text-2xl">
            {mode === "login" ? "Entrar na sua conta" : "Criar uma conta"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Acesse para acompanhar seus pedidos." : "Preencha os dados abaixo para criar sua conta."}
          </p>

          {/* Métodos rápidos */}
          <div className="mt-6 space-y-2">
            {/* Entrar com Google */}
            <button
              onClick={loginWithGoogle}
              disabled={loading}
              className="flex w-full items-center gap-3 rounded-2xl border bg-background px-4 py-3 text-sm font-semibold hover:bg-muted transition disabled:opacity-60"
            >
              <GoogleIcon />
              Entrar com Google
            </button>

            {/* Código por e-mail */}
            <button
              onClick={() => setAuthMethod(authMethod === "otp" ? "password" : "otp")}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${authMethod === "otp" ? "border-primary bg-primary/5 text-primary" : "bg-background hover:bg-muted"}`}
            >
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              Código por e-mail
            </button>
          </div>

          {/* Formulário OTP */}
          {authMethod === "otp" && (
            <div className="mt-4">
              {!otpSent ? (
                <form onSubmit={sendOtp} className="space-y-3">
                  <div>
                    <label className={labelCls}>Seu e-mail</label>
                    <input
                      type="email"
                      value={otpEmail}
                      onChange={(e) => { setOtpEmail(e.target.value); setOtpError(""); }}
                      placeholder="seu@email.com"
                      className={otpError ? inputErr : inputBase}
                    />
                    {otpError && <p className="mt-1 text-xs text-destructive">{otpError}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105 disabled:opacity-60"
                  >
                    {otpLoading ? "Enviando..." : "Enviar código"}
                  </button>
                </form>
              ) : (
                <form onSubmit={verifyOtp} className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Código enviado para <strong>{otpEmail}</strong>.
                  </p>
                  <div>
                    <label className={labelCls}>Código de 6 dígitos</label>
                    <input
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }}
                      placeholder="000000"
                      className={`${otpError ? inputErr : inputBase} text-center text-xl tracking-[0.5em] font-bold`}
                      maxLength={6}
                      inputMode="numeric"
                    />
                    {otpError && <p className="mt-1 text-xs text-destructive">{otpError}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105 disabled:opacity-60"
                  >
                    {otpLoading ? "Verificando..." : "Entrar com código"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(""); setOtpError(""); }}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3 w-3" /> Trocar e-mail
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Divisor */}
          {authMethod === "password" && (
            <>
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 border-t" />
                <span className="text-xs text-muted-foreground font-medium">ou com e-mail e senha</span>
                <div className="flex-1 border-t" />
              </div>

              {/* Formulário e-mail + senha */}
              <form onSubmit={submit} className="space-y-4">
                {mode === "register" && (
                  <div>
                    <label className={labelCls}>Nome</label>
                    <input
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                      placeholder="Seu nome"
                      className={errors.name ? inputErr : inputBase}
                    />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                  </div>
                )}

                <div>
                  <label className={labelCls}>E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                    placeholder="seu@email.com"
                    className={errors.email ? inputErr : inputBase}
                  />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                </div>

                <div>
                  <label className={labelCls}>Senha</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                    placeholder="Mínimo 6 caracteres"
                    className={errors.password ? inputErr : inputBase}
                  />
                  {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
                </div>

                {errors.general && <p className="text-sm text-destructive">{errors.general}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105 disabled:opacity-60"
                >
                  {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
                </button>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">← Voltar ao site</Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}

// Ícone do Google (SVG inline — sem CDN externo)
function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
