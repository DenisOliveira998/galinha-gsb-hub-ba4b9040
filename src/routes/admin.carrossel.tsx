import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUp, Images, Repeat, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { CATEGORY_LABELS, useStore, type Category } from "@/lib/mock-store";

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

  const categories = Object.keys(CATEGORY_LABELS) as Category[];

  return (
    <AdminShell title="Mídia do Site">
      <div className="max-w-4xl space-y-8">
        <p className="text-sm text-muted-foreground">
          Central de imagens do site. Tudo o que você alterar aqui aparece imediatamente nas páginas públicas.
        </p>

        {picking && (
          <div className="rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm">
            Selecione uma imagem no <strong>Estoque de imagens</strong> para aplicar neste espaço.{" "}
            <button type="button" onClick={() => setPicking(null)} className="font-semibold underline">
              Cancelar
            </button>
          </div>
        )}

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

          <div className="mt-4 space-y-4">
            {slides.map((s, i) => (
              <div key={s.id} className="rounded-xl border p-3">
                <div className="flex flex-wrap gap-4">
                  <div className="shrink-0">
                    <div className="mb-1 text-xs font-semibold text-muted-foreground">Imagem {i + 1}</div>
                    <img src={s.image} alt={s.title} className="h-24 w-36 rounded-xl object-cover" />
                  </div>
                  <div className="min-w-[220px] flex-1 space-y-2">
                    <input value={s.title} onChange={(e) => updateSlide(s.id, { title: e.target.value })} placeholder="Título" className="ci" />
                    <input value={s.subtitle} onChange={(e) => updateSlide(s.id, { subtitle: e.target.value })} placeholder="Subtítulo" className="ci" />
                    <div className="grid grid-cols-2 gap-2">
                      <input value={s.ctaLabel} onChange={(e) => updateSlide(s.id, { ctaLabel: e.target.value })} placeholder="Texto do botão" className="ci" />
                      <select value={s.ctaTo} onChange={(e) => updateSlide(s.id, { ctaTo: e.target.value })} className="ci">
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
              <p className="rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">Nenhuma imagem no carrossel.</p>
            )}
          </div>
        </section>

        {/* ------------------------------------------------ Categorias */}
        {categories.map((cat) => {
          const list = categoryImages?.[cat] ?? [];
          return (
            <section key={cat} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
              <h2 className="font-display text-lg">{CATEGORY_LABELS[cat]}</h2>
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
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {list.map((img, i) => (
                  <div key={`${cat}-${i}`} className="flex gap-3 rounded-xl border p-3">
                    <div>
                      <div className="mb-1 text-xs font-semibold text-muted-foreground">Imagem {i + 1}</div>
                      <img src={img} alt={`${CATEGORY_LABELS[cat]} ${i + 1}`} className="h-20 w-28 rounded-lg object-cover" />
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
            Todas as imagens já enviadas ao site. Clique em <strong>Usar imagem do estoque</strong> em um tópico e depois escolha uma imagem aqui.
          </p>
          <div className="mt-3">
            <ImageDropzone
              multiple
              label="Adicionar imagens ao estoque"
              onFiles={(urls) => useStore.getState().addMedia(urls)}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {library.map((img) => (
              <div key={img} className="overflow-hidden rounded-xl border">
                <button
                  type="button"
                  onClick={() => applyFromLibrary(img)}
                  disabled={!picking}
                  className="block w-full disabled:cursor-default"
                  title={picking ? "Aplicar esta imagem" : "Selecione um espaço para aplicar"}
                >
                  <img src={img} alt="Imagem do estoque" className={`h-24 w-full object-cover transition ${picking ? "hover:opacity-80" : ""}`} />
                </button>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-[11px] text-muted-foreground">{picking ? "Clique para usar" : "Estoque"}</span>
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
