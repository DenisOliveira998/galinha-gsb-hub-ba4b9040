import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useStore, type SiteSettings } from "@/lib/mock-store";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DEFAULT_BRAND_COLOR, normalizeHex } from "@/lib/brand-color";
import { useState } from "react";
import { toast } from "sonner";
import { PreviewBoundary } from "@/components/admin/preview-boundary";

export const Route = createFileRoute("/admin/settings")({
  component: Settings,
  head: () => ({
    meta: [
      { title: "Configurações do site — Painel Galinha GSB" },
      { name: "description", content: "Contatos, textos e aparência do site Galinha GSB." },
    ],
  }),
});

const LABELS: Record<keyof SiteSettings, string> = {
  whatsapp: "WhatsApp exibido",
  whatsappLink: "Link do WhatsApp",
  instagram: "Instagram",
  email: "E-mail",
  aboutText: "Texto “Sobre”",
  brandColor: "Cor principal do site",
  adsensePublisherId: "ID do publisher AdSense",
  adsenseSlotHomeBanner: "Slot — Banner da Home",
  adsenseSlotHomeRectangle: "Slot — Retângulo da Home",
  adsenseSlotBlog: "Slot — Blog (vertical)",
};

const PRESETS = ["#3F6B52", "#1F4F7A", "#7A2E2E", "#6B4E1F", "#4B2E7A", "#1F1F1F"];

function Settings() {
  const settings = useStore((s) => s.settings);
  const update = useStore((s) => s.updateSettings);
  const safeSettings: SiteSettings = {
    whatsapp: settings?.whatsapp ?? "",
    whatsappLink: settings?.whatsappLink ?? "",
    instagram: settings?.instagram ?? "",
    email: settings?.email ?? "",
    aboutText: settings?.aboutText ?? "",
    brandColor: settings?.brandColor ?? DEFAULT_BRAND_COLOR,
    adsensePublisherId: settings?.adsensePublisherId ?? "",
    adsenseSlotHomeBanner: settings?.adsenseSlotHomeBanner ?? "",
    adsenseSlotHomeRectangle: settings?.adsenseSlotHomeRectangle ?? "",
    adsenseSlotBlog: settings?.adsenseSlotBlog ?? "",
  };
  const [form, setForm] = useState<SiteSettings>(safeSettings);
  const [confirming, setConfirming] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm({ ...form, [k]: v });

  const color = normalizeHex(form.brandColor) ?? DEFAULT_BRAND_COLOR;
  const hexValid = normalizeHex(form.brandColor) !== null;
  const changes = (Object.keys(LABELS) as Array<keyof SiteSettings>).filter(
    (k) => (form[k] ?? "") !== (safeSettings[k] ?? ""),
  );

  const apply = () => {
    update({ ...form, brandColor: normalizeHex(form.brandColor) ?? DEFAULT_BRAND_COLOR });
    setConfirming(false);
    toast.success("Alterações aplicadas no site");
  };

  return (
    <AdminShell title="Configurações">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!changes.length) {
            toast.info("Nenhuma alteração para aplicar");
            return;
          }
          if (!hexValid) {
            toast.error("Cor inválida. Use o formato #RRGGBB (ex: #2D5A3D).");
            return;
          }
          setConfirming(true);
        }}
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
          <div>
            <h3 className="font-display text-lg">Aparência</h3>
            <p className="text-xs text-muted-foreground">
              A cor escolhida substitui o verde da marca em todo o site: cabeçalho, hero, botões
              principais, destaques e rodapé.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="color"
              aria-label="Seletor de cor principal"
              value={color}
              onChange={(e) => set("brandColor", e.target.value)}
              className="swatch h-24 w-32 cursor-pointer rounded-2xl"
            />
            <div className="min-w-[12rem] flex-1 space-y-2">
              <F label="cor_hexadecimal">
                <input
                  value={form.brandColor}
                  onChange={(e) => set("brandColor", e.target.value)}
                  onBlur={() => {
                    const n = normalizeHex(form.brandColor);
                    if (n) set("brandColor", n.toUpperCase());
                  }}
                  aria-invalid={!hexValid}
                  maxLength={7}
                  className="i font-mono uppercase"
                  placeholder="#2D5A3D"
                />
                {hexValid ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Aceita #RRGGBB ou a forma curta #RGB (expandida automaticamente).
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-destructive">
                    Código hexadecimal inválido. Use #RRGGBB (ex: #2D5A3D) ou #RGB (ex: #2A5).
                  </p>
                )}
              </F>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-label={`Usar cor ${p}`}
                    onClick={() => set("brandColor", p)}
                    className="h-8 w-8 rounded-full border"
                    style={{ background: p }}
                  />
                ))}
                <button type="button" onClick={() => set("brandColor", DEFAULT_BRAND_COLOR)} className="rounded-full border px-3 py-1 text-xs font-semibold hover:bg-muted">
                  Restaurar padrão
                </button>
              </div>
            </div>
            <PreviewBoundary label="Não foi possível exibir a cor selecionada.">
              <div className="w-full rounded-2xl p-4 text-sm text-primary-foreground" style={{ backgroundColor: color }}>
                Pré-visualização da cor principal
              </div>
            </PreviewBoundary>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)] space-y-4">
          <h3 className="font-display text-lg">Conteúdo do site</h3>
          <p className="text-xs text-muted-foreground">
            As imagens do hero são gerenciadas em “Mídia do Site” → Carrossel.
          </p>
          <F label="texto_sobre"><textarea value={form.aboutText} onChange={(e) => set("aboutText", e.target.value)} rows={6} className="i" placeholder="Texto da página Sobre" /></F>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)] space-y-4">
          <div>
            <h3 className="font-display text-lg">Google AdSense</h3>
            <p className="text-xs text-muted-foreground">
              Enquanto o ID do publisher e o slot correspondente estiverem vazios, o site
              continua exibindo os espaços publicitários mockados. Ao preencher, o bloco real
              do AdSense é carregado automaticamente — sem mexer em código.
            </p>
          </div>
          <F label="id_publisher"><input value={form.adsensePublisherId} onChange={(e) => set("adsensePublisherId", e.target.value.trim())} className="i font-mono" placeholder="ca-pub-XXXXXXXXXXXXXXXX" /></F>
          <F label="slot_banner_home"><input value={form.adsenseSlotHomeBanner} onChange={(e) => set("adsenseSlotHomeBanner", e.target.value.trim())} className="i font-mono" placeholder="1234567890" /><p className="mt-1 text-xs text-muted-foreground">Banner horizontal, acima de “Últimos anúncios”.</p></F>
          <F label="slot_retangulo_home"><input value={form.adsenseSlotHomeRectangle} onChange={(e) => set("adsenseSlotHomeRectangle", e.target.value.trim())} className="i font-mono" placeholder="1234567890" /><p className="mt-1 text-xs text-muted-foreground">Bloco antes de “Por que escolher a Galinha GSB”.</p></F>
          <F label="slot_blog"><input value={form.adsenseSlotBlog} onChange={(e) => set("adsenseSlotBlog", e.target.value.trim())} className="i font-mono" placeholder="1234567890" /><p className="mt-1 text-xs text-muted-foreground">Formato vertical na listagem e dentro das postagens do blog.</p></F>
        </div>

        <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
          <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50" disabled={!changes.length || !hexValid}>
            Aplicar alterações
          </button>
          <button type="button" onClick={() => setForm(safeSettings)} className="rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted">
            Descartar
          </button>
          <span className="text-xs text-muted-foreground">
            {changes.length ? `${changes.length} alteração(ões) pendente(s)` : "Nenhuma alteração pendente"}
          </span>
        </div>

        <ConfirmDialog
          open={confirming}
          title="Aplicar alterações no site?"
          description="As mudanças abaixo passam a valer imediatamente nas páginas públicas."
          confirmLabel="Confirmar"
          onCancel={() => setConfirming(false)}
          onConfirm={apply}
        >
          <ul className="space-y-2">
            {changes.map((k) => (
              <li key={k}>
                <span className="font-semibold">{LABELS[k]}</span>
                <div className="text-xs text-muted-foreground line-through">{String(safeSettings[k] || "—").slice(0, 120)}</div>
                <div className="text-xs">{String(form[k] || "—").slice(0, 120)}</div>
              </li>
            ))}
          </ul>
        </ConfirmDialog>
        <style>{`.i{width:100%;border-radius:1rem;border:1px solid var(--color-border);background:var(--color-background);padding:.75rem 1rem;font-size:.875rem;outline:none}.i:focus{box-shadow:0 0 0 2px var(--color-ring)}
.swatch{-webkit-appearance:none;appearance:none;border:none;padding:0;background:none;overflow:hidden}
.swatch::-webkit-color-swatch-wrapper{padding:0;border:none}
.swatch::-webkit-color-swatch{border:none;border-radius:1rem}
.swatch::-moz-color-swatch{border:none;border-radius:1rem}`}</style>
      </form>
    </AdminShell>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label><div className="mt-1">{children}</div></div>;
}
