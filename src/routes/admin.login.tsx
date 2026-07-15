import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/mock-store";
import { Egg } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Login admin — Galinha GSB" }, { name: "robots", content: "noindex" }] }),
  component: Login,
});

function Login() {
  const login = useStore((s) => s.login);
  const router = useRouter();
  const [email, setEmail] = useState("admin@galinhagsb.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      router.navigate({ to: "/admin" });
    } else {
      setError("Credenciais inválidas.");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-primary-deep p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary"><Egg className="h-5 w-5" /></span>
          <div>
            <div className="font-display text-lg font-semibold">Galinha GSB</div>
            <div className="text-xs text-muted-foreground">Painel administrativo</div>
          </div>
        </div>
        <h1 className="mt-6 font-display text-2xl">Entrar</h1>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">senha</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Entrar</button>
          <p className="text-center text-xs text-muted-foreground">Mock: admin@galinhagsb.com / admin123</p>
        </div>
      </form>
    </div>
  );
}