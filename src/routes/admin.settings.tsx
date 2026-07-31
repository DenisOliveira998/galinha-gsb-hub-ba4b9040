import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useStore } from "@/lib/mock-store";
import { useState } from "react";

export const Route = createFileRoute("/admin/settings")({
  component: Settings,
});

function Settings() {
  const settings = useStore((s) => s.settings);
  const update = useStore((s) => s.updateSettings);
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm({ ...form, [k]: v });

  return (
    <AdminShell title="Configurações">
      <form
        onSubmit={(e) => { e.preventDefault(); update(form); setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        className="max-w-3xl space-y-6"
      >
        <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)] space-y-4">
          <h3 className="font-display text-lg">Contato exibido no site</h3>
          <F label="whatsapp_exibido"><input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="i" placeholder="(00) 00000-0000" /></F>
          <F label="whatsapp_link"><input value={form.whatsappLink} onChange={(e) => set("whatsappLink", e.target.value)} className="i" placeholder="https://wa.me/5511999999999" /><p className="mt-1 text-xs text-muted-foreground">Usado em todos os botões de contato do site (carrinho, catálogo, contato, rodapé).</p></F>
          <F label="instagram"><input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} className="i" placeholder="@instagram_do_criador" /></F>
          <F label="email"><input value={form.email} onChange={(e) => set("email", e.target.value)} className="i" placeholder="email@exemplo.com" /></F>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)] space-y-4">
          <h3 className="font-display text-lg">Conteúdo do site</h3>
          <F label="hero_imagem_url">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input value={form.heroImage} onChange={(e) => set("heroImage", e.target.value)} className="i" placeholder="Deixe vazio para exibir o carrossel" />
              <button type="button" onClick={() => set("heroImage", "")} className="shrink-0 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted">Limpar</button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Com este campo preenchido, o hero mostra essa imagem fixa. Vazio, o hero passa a exibir
              automaticamente o carrossel gerenciado em “Mídia do Site”.
            </p>
          </F>
          <F label="texto_sobre"><textarea value={form.aboutText} onChange={(e) => set("aboutText", e.target.value)} rows={6} className="i" placeholder="Texto da página Sobre" /></F>
        </div>
        <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Salvar alterações</button>
        {saved && <p className="text-sm text-primary">Salvo!</p>}
        <style>{`.i{width:100%;border-radius:1rem;border:1px solid var(--color-border);background:var(--color-background);padding:.75rem 1rem;font-size:.875rem;outline:none}.i:focus{box-shadow:0 0 0 2px var(--color-ring)}`}</style>
      </form>
    </AdminShell>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label><div className="mt-1">{children}</div></div>;
}