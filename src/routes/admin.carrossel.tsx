import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUp, Images, Repeat, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { MediaPickerDialog } from "@/components/admin/media-picker";
import { useCategories, useStore, type Category } from "@/lib/mock-store";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/carrossel")({
  component: MediaAdmin,
});

type Target = { kind: "hero"; index: number } | { kind: "category"; category: Category; index: number };

function MediaAdmin() {
  const slides = useStore((s) => s.heroSlides);
  const categoryImages = useStore((s) => s.categoryImages);
  const library = useStore((s) => s.mediaLibrary);
  const updateSlide = useStore((s) => s.updateHeroSlide);
  const deleteSlide = useStore((s) => s.deleteHeroSlide);
  const moveSlide = useStore((s) => s.moveHeroSlide);
  const addHeroSlides = useStore((s) => s.addHeroSlides);
  const addCategoryImages = useStore((s) => s.addCategoryImages);
  const updateCategoryImage = useStore((s) => s.updateCategoryImage);
  const deleteCategoryImage = useStore((s) => s.deleteCategoryImage);
  const moveCategoryImage = useStore((s) => s.moveCategoryImage);
  const deleteMedia = useStore((s) => s.deleteMedia);

  /** Slot que está aguardando uma imagem do estoque. */
  const [picking, setPicking] = useState<Target | null>(null);
  /** Textos dos slides editados, aplicados apenas no botão "Aplicar alterações". */
  const [drafts, setDrafts] = useState<Record<string, Partial<{ title: string; subtitle: string; ctaLabel: string; ctaTo: string }>>>({});
  const [confirming, setConfirming] = useState(false);
  const [removingSlide, setRemovingSlide] = useState<string | null>(null);

  const setDraft = (id: string, patch: Record<string, string>) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
  const val = (id: string, key: "title" | "subtitle" | "ctaLabel" | "ctaTo", fallback: string) =>
    (drafts[id]?.[key] as string | undefined) ?? fallback;

  const pending = slides.filter((s) => {
    const d = drafts[s.id];
    if (!d) return false;
    return (["title", "subtitle", "ctaLabel", "ctaTo"] as const).some(
      (k) => d[k] !== undefined && d[k] !== s[k],
    );
  });

  const applyChanges = () => {
    pending.forEach((s) => updateSlide(s.id, drafts[s.id]!));
    setDrafts({});
    setConfirming(false);
    toast.success("Alterações aplicadas no site");
  };

  const applyFromLibrary = (image: string) => {
    if (!picking) return;
    if (picking.kind === "hero") {
      const slide = slides[picking.index];
      if (slide) updateSlide(slide.id, { image });
    } else {
      updateCategoryImage(picking.category, picking.index, image);
    }
    setPicking(null);
  };

  const categoryList = useCategories();
  const categories = categoryList.map((c) => c.id);
  const labelOf = (id: string) => categoryList.find((c) => c.id === id)?.label ?? id;

  return (
    <AdminShell title="Mídia do Site">
      <div className="max-w-4xl space-y-8">
        <p className="text-sm text-muted-foreground">
          Central de imagens do site. Tudo o que você alterar aqui aparece imediatamente nas páginas públicas.
        </p>

        <MediaPickerDialog
          open={picking !== null}
          onClose={() => setPicking(null)}
          onSelect={applyFromLibrary}
        />

        {/* ------------------------------------------------ Carrossel */}
        <section className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-lg">Carrossel</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Imagens do destaque na home. Envie várias de uma vez.
          </p>
          <div className="mt-3">
            <ImageDropzone
              multiple
              label="Clique para escolher ou arraste várias imagens aqui"
              onFiles={(urls) => addHeroSlides(urls)}
            />
          </div>
          <div className="mt-2">
            <ImageDropzone variant="plus" multiple label="Adicionar imagem" onFiles={(urls) => addHeroSlides(urls)} />
          </div>

          <div className="mt-4 space-y-4">
            {slides.map((s, i) => (
              <div key={s.id} className="rounded-xl border p-3">
                <div className="flex flex-wrap gap-4">
                  <div className="shrink-0">
                    <div className="mb-1 text-xs font-semibold text-muted-foreground">Imagem {i + 1}</div>
                    <img src={s.image} alt={s.title} className="h-24 w-36 rounded-xl object-cover" />
                  </div>
                  <div className="min-w-[220px] flex-1 space-y-2">
                    <input value={val(s.id, "title", s.title)} onChange={(e) => setDraft(s.id, { title: e.target.value })} placeholder="Título" className="ci" />
                    <input value={val(s.id, "subtitle", s.subtitle)} onChange={(e) => setDraft(s.id, { subtitle: e.target.value })} placeholder="Subtítulo" className="ci" />
                    <div className="grid grid-cols-2 gap-2">
                      <input value={val(s.id, "ctaLabel", s.ctaLabel)} onChange={(e) => setDraft(s.id, { ctaLabel: e.target.value })} placeholder="Texto do botão" className="ci" />
                      <select value={val(s.id, "ctaTo", s.ctaTo)} onChange={(e) => setDraft(s.id, { ctaTo: e.target.value })} className="ci">
                        <option value="/catalogo">/catalogo</option>
                        <option value="/blog">/blog</option>
                        <option value="/sobre">/sobre</option>
                        <option value="/contato">/contato</option>
                      </select>
                    </div>
                    <div className="pt-1">
                      <ImageDropzone
                        multiple={false}
                        label="Trocar esta imagem"
                        onFiles={(urls) => urls[0] && updateSlide(s.id, { image: urls[0] })}
                      />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button type="button" title="Mover para cima" aria-label="Mover para cima" disabled={i === 0} onClick={() => moveSlide(s.id, -1)} className="rounded-lg border p-2 disabled:opacity-40">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button type="button" title="Mover para baixo" aria-label="Mover para baixo" disabled={i === slides.length - 1} onClick={() => moveSlide(s.id, 1)} className="rounded-lg border p-2 disabled:opacity-40">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button type="button" title="Usar imagem do estoque" aria-label="Usar imagem do estoque" onClick={() => setPicking({ kind: "hero", index: i })} className="rounded-lg border p-2">
                      <Repeat className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Remover"
                      aria-label="Remover imagem"
                      onClick={() => setRemovingSlide(s.id)}
                      className="rounded-lg border border-destructive/40 p-2 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
              <button
                type="button"
                disabled={!pending.length}
                onClick={() => setConfirming(true)}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                Aplicar alterações
              </button>
              <button type="button" onClick={() => setDrafts({})} className="rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted">
                Descartar
              </button>
              <span className="text-xs text-muted-foreground">
                {pending.length ? `${pending.length} slide(s) alterado(s)` : "Nenhuma alteração pendente nos textos"}
              </span>
            </div>

            <ConfirmDialog
              open={confirming}
              title="Aplicar alterações no carrossel?"
              description="Os textos abaixo passam a aparecer imediatamente na home."
              onCancel={() => setConfirming(false)}
              onConfirm={applyChanges}
            >
              <ul className="space-y-2">
                {pending.map((s, i) => (
                  <li key={s.id}>
                    <span className="font-semibold">Imagem {slides.indexOf(s) + 1}</span>
                    <div className="text-xs text-muted-foreground">
                      {val(s.id, "title", s.title)} — {val(s.id, "subtitle", s.subtitle)}
                    </div>
                  </li>
                ))}
              </ul>
            </ConfirmDialog>

            <ConfirmDialog
              open={removingSlide !== null}
              destructive
              title="Remover esta imagem do carrossel?"
              confirmLabel="Remover"
              onCancel={() => setRemovingSlide(null)}
              onConfirm={() => {
                if (removingSlide) deleteSlide(removingSlide);
                setRemovingSlide(null);
              }}
            />

            {slides.length === 0 && (
              <p className="rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">Nenhuma imagem no carrossel.</p>
            )}
          </div>
        </section>

        {/* ------------------------------------------------ Categorias */}
        {categories.map((cat) => {
          const list = categoryImages?.[cat] ?? [];
          return (
            <section key={cat} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
              <h2 className="font-display text-lg">{labelOf(cat)}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Imagens usadas no card desta categoria. A primeira imagem é a exibida na home.
              </p>
              <div className="mt-3">
                <ImageDropzone
                  multiple
                  label="Clique para escolher ou arraste várias imagens aqui"
                  onFiles={(urls) => addCategoryImages(cat, urls)}
                />
              </div>
              <div className="mt-2">
                <ImageDropzone variant="plus" multiple label="Adicionar imagem" onFiles={(urls) => addCategoryImages(cat, urls)} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {list.map((img, i) => (
                  <div key={`${cat}-${i}`} className="flex gap-3 rounded-xl border p-3">
                    <div>
                      <div className="mb-1 text-xs font-semibold text-muted-foreground">Imagem {i + 1}</div>
                      <img src={img} alt={`${labelOf(cat)} ${i + 1}`} className="h-20 w-28 rounded-lg object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex gap-1">
                        <button type="button" title="Mover para cima" aria-label="Mover para cima" disabled={i === 0} onClick={() => moveCategoryImage(cat, i, -1)} className="rounded-lg border p-2 disabled:opacity-40">
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button type="button" title="Mover para baixo" aria-label="Mover para baixo" disabled={i === list.length - 1} onClick={() => moveCategoryImage(cat, i, 1)} className="rounded-lg border p-2 disabled:opacity-40">
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button type="button" title="Usar imagem do estoque" aria-label="Usar imagem do estoque" onClick={() => setPicking({ kind: "category", category: cat, index: i })} className="rounded-lg border p-2">
                          <Repeat className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Remover"
                          aria-label="Remover imagem"
                          onClick={() => { if (confirm("Remover esta imagem da categoria?")) deleteCategoryImage(cat, i); }}
                          className="rounded-lg border border-destructive/40 p-2 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <ImageDropzone
                        multiple={false}
                        label="Trocar"
                        onFiles={(urls) => urls[0] && updateCategoryImage(cat, i, urls[0])}
                      />
                    </div>
                  </div>
                ))}
                {list.length === 0 && (
                  <p className="rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground sm:col-span-2">
                    Nenhuma imagem nesta categoria.
                  </p>
                )}
              </div>
            </section>
          );
        })}

        {/* ------------------------------------------------ Estoque */}
        <section className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="flex items-center gap-2 font-display text-lg">
            <Images className="h-4 w-4" /> Estoque de imagens
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Todas as imagens já enviadas ao site. Use o botão <strong>Usar imagem do estoque</strong> em qualquer espaço para escolher uma delas em um popup.
          </p>
          <div className="mt-3">
            <ImageDropzone
              multiple
              label="Adicionar imagens ao estoque"
              onFiles={(urls) => useStore.getState().addMedia(urls)}
            />
          </div>
          <div className="mt-2">
            <ImageDropzone variant="plus" multiple label="Adicionar imagem" onFiles={(urls) => useStore.getState().addMedia(urls)} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {library.map((img) => (
              <div key={img} className="overflow-hidden rounded-xl border">
                <img src={img} alt="Imagem do estoque" className="h-24 w-full object-cover" />
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-[11px] text-muted-foreground">Estoque</span>
                  <button
                    type="button"
                    title="Remover do estoque"
                    aria-label="Remover do estoque"
                    onClick={() => { if (confirm("Remover esta imagem do estoque?")) deleteMedia(img); }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {library.length === 0 && (
              <p className="col-span-full rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">
                Nenhuma imagem no estoque ainda.
              </p>
            )}
          </div>
        </section>

        <style>{`.ci{width:100%;border-radius:.75rem;border:1px solid var(--color-border);background:var(--color-background);padding:.5rem .75rem;font-size:.875rem;outline:none}.ci:focus{box-shadow:0 0 0 2px var(--color-ring)}`}</style>
      </div>
    </AdminShell>
  );
}
