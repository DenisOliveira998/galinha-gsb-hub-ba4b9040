import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { useStore } from "@/lib/mock-store";

export const Route = createFileRoute("/admin/carrossel")({
  component: CarouselAdmin,
});

function CarouselAdmin() {
  const slides = useStore((s) => s.heroSlides);
  const addSlide = useStore((s) => s.addHeroSlide);
  const updateSlide = useStore((s) => s.updateHeroSlide);
  const deleteSlide = useStore((s) => s.deleteHeroSlide);
  const moveSlide = useStore((s) => s.moveHeroSlide);
  const [newImage, setNewImage] = useState("");

  return (
    <AdminShell title="Carrossel da home">
      <div className="max-w-3xl space-y-6">
        <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-display text-lg">Adicionar imagem</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Clique ou arraste uma imagem. As alterações aparecem imediatamente na home.
          </p>
          <div className="mt-3">
            <ImageDropzone multiple={false} onFiles={(urls) => setNewImage(urls[0] ?? "")} />
          </div>
          {newImage && (
            <img src={newImage} alt="Pré-visualização" className="mt-3 h-28 w-44 rounded-xl object-cover" />
          )}
          <button
            type="button"
            disabled={!newImage}
            onClick={() => {
              addSlide({ image: newImage, title: "Novo destaque", subtitle: "", ctaLabel: "Ver catálogo", ctaTo: "/catalogo" });
              setNewImage("");
            }}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Adicionar ao carrossel
          </button>
        </div>

        <div className="space-y-4">
          {slides.map((s, i) => (
            <div key={s.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className="flex gap-4">
                <img src={s.image} alt={s.title} className="h-24 w-36 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    value={s.title}
                    onChange={(e) => updateSlide(s.id, { title: e.target.value })}
                    placeholder="Título"
                    className="ci"
                  />
                  <input
                    value={s.subtitle}
                    onChange={(e) => updateSlide(s.id, { subtitle: e.target.value })}
                    placeholder="Subtítulo"
                    className="ci"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={s.ctaLabel}
                      onChange={(e) => updateSlide(s.id, { ctaLabel: e.target.value })}
                      placeholder="Texto do botão"
                      className="ci"
                    />
                    <select
                      value={s.ctaTo}
                      onChange={(e) => updateSlide(s.id, { ctaTo: e.target.value })}
                      className="ci"
                    >
                      <option value="/catalogo">/catalogo</option>
                      <option value="/blog">/blog</option>
                      <option value="/sobre">/sobre</option>
                      <option value="/contato">/contato</option>
                    </select>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button type="button" title="Mover para cima" aria-label="Mover para cima" disabled={i === 0} onClick={() => moveSlide(s.id, -1)} className="rounded-lg border p-2 disabled:opacity-40">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" title="Mover para baixo" aria-label="Mover para baixo" disabled={i === slides.length - 1} onClick={() => moveSlide(s.id, 1)} className="rounded-lg border p-2 disabled:opacity-40">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Remover"
                    aria-label="Remover imagem"
                    onClick={() => { if (confirm("Remover esta imagem do carrossel?")) deleteSlide(s.id); }}
                    className="rounded-lg border border-destructive/40 p-2 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {slides.length === 0 && (
            <p className="rounded-2xl bg-muted p-6 text-center text-sm text-muted-foreground">Nenhuma imagem no carrossel.</p>
          )}
        </div>
        <style>{`.ci{width:100%;border-radius:.75rem;border:1px solid var(--color-border);background:var(--color-background);padding:.5rem .75rem;font-size:.875rem;outline:none}.ci:focus{box-shadow:0 0 0 2px var(--color-ring)}`}</style>
      </div>
    </AdminShell>
  );
}
