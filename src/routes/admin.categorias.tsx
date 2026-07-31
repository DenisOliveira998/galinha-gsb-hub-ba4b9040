import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Images, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { MediaPickerDialog } from "@/components/admin/media-picker";
import { useCategories, useStore } from "@/lib/mock-store";

export const Route = createFileRoute("/admin/categorias")({
  component: CategoriesAdmin,
});

function CategoriesAdmin() {
  const categories = useCategories();
  const posts = useStore((s) => s.posts);
  const addCategory = useStore((s) => s.addCategory);
  const updateCategory = useStore((s) => s.updateCategory);
  const deleteCategory = useStore((s) => s.deleteCategory);
  const moveCategory = useStore((s) => s.moveCategory);

  const [newLabel, setNewLabel] = useState("");
  const [newImage, setNewImage] = useState("");
  /** Slot aguardando imagem do estoque: "new" ou o id da categoria. */
  const [picking, setPicking] = useState<string | null>(null);

  const countOf = (id: string) => posts.filter((p) => p.category === id).length;

  const remove = (id: string, label: string) => {
    const used = countOf(id);
    if (used > 0) {
      toast.error("Categoria em uso", {
        description: `${used} anúncio(s) ainda estão em “${label}”. Recategorize-os antes de remover.`,
      });
      return;
    }
    if (!window.confirm(`Remover a categoria “${label}”?`)) return;
    deleteCategory(id);
    toast.success("Categoria removida");
  };

  return (
    <AdminShell title="Categorias">
      <div className="max-w-3xl space-y-6">
        <p className="text-sm text-muted-foreground">
          As categorias criadas aqui aparecem imediatamente no catálogo, nos cards da home e no
          formulário de anúncios.
        </p>

        <MediaPickerDialog
          open={picking !== null}
          onClose={() => setPicking(null)}
          onSelect={(image) => {
            if (picking === "new") setNewImage(image);
            else if (picking) updateCategory(picking, { image });
            setPicking(null);
          }}
        />

        {/* Nova categoria */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newLabel.trim()) return;
            addCategory(newLabel, newImage || undefined);
            setNewLabel("");
            setNewImage("");
            toast.success("Categoria criada");
          }}
          className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] space-y-3"
        >
          <h2 className="font-display text-lg">Nova categoria</h2>
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Nome da categoria (ex: Codornas)"
            className="ci"
          />
          <div className="flex flex-wrap items-center gap-2">
            <ImageDropzone variant="plus" multiple={false} label="Enviar imagem" onFiles={(u) => u[0] && setNewImage(u[0])} />
            <button type="button" onClick={() => setPicking("new")} className="cbtn">
              <Images className="h-4 w-4" /> Estoque
            </button>
            {newImage && <img src={newImage} alt="" className="h-14 w-20 rounded-lg object-cover" />}
          </div>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Adicionar categoria
          </button>
        </form>

        {/* Lista */}
        <div className="space-y-3">
          {categories.map((c, i) => (
            <div key={c.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className="flex flex-wrap items-center gap-3">
                <img
                  src={c.image || "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=60"}
                  alt=""
                  className="h-16 w-24 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-[12rem] flex-1">
                  <input
                    value={c.label}
                    onChange={(e) => updateCategory(c.id, { label: e.target.value })}
                    className="ci"
                    aria-label="Nome da categoria"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {countOf(c.id)} anúncio(s) nesta categoria
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ImageDropzone variant="plus" multiple={false} label="Trocar imagem" onFiles={(u) => u[0] && updateCategory(c.id, { image: u[0] })} />
                  <button type="button" onClick={() => setPicking(c.id)} className="cbtn">
                    <Images className="h-4 w-4" /> Estoque
                  </button>
                  <button type="button" aria-label="Mover para cima" disabled={i === 0} onClick={() => moveCategory(c.id, -1)} className="rounded-lg border p-2 disabled:opacity-40">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Mover para baixo" disabled={i === categories.length - 1} onClick={() => moveCategory(c.id, 1)} className="rounded-lg border p-2 disabled:opacity-40">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Remover categoria" onClick={() => remove(c.id, c.label)} className="rounded-lg border border-destructive/40 p-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="rounded-2xl bg-muted p-6 text-sm text-muted-foreground">
              Nenhuma categoria cadastrada. Crie a primeira acima.
            </p>
          )}
        </div>

        <style>{`.ci{width:100%;border-radius:1rem;border:1px solid var(--color-border);background:var(--color-background);padding:.65rem 1rem;font-size:.875rem;outline:none}.ci:focus{box-shadow:0 0 0 2px var(--color-ring)}.cbtn{display:inline-flex;align-items:center;gap:.5rem;border-radius:9999px;border:1px solid var(--color-border);padding:.5rem 1rem;font-size:.875rem;font-weight:600}.cbtn:hover{background:var(--color-muted)}`}</style>
      </div>
    </AdminShell>
  );
}
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/categorias')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/categorias"!</div>
}
