import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Images, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { MediaPickerDialog } from "@/components/admin/media-picker";
import {
  useCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useMoveCategoryMutation,
} from "@/lib/hooks/use-categories";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

export const Route = createFileRoute("/admin/categorias")({
  component: CategoriesAdmin,
});

function CategoriesAdmin() {
  const { data: categories = [], isLoading } = useCategoriesQuery();
  const addCategoryMutation = useAddCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();
  const moveCategoryMutation = useMoveCategoryMutation();

  const [newLabel, setNewLabel] = useState("");
  const [newImage, setNewImage] = useState("");
  /** Slot aguardando imagem do estoque: "new" ou o id da categoria. */
  const [picking, setPicking] = useState<string | null>(null);
  /** Edições pendentes por categoria — aplicadas somente no botão "Aplicar alterações". */
  const [drafts, setDrafts] = useState<Record<string, { label?: string; image?: string }>>({});
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState<{ id: string; label: string } | null>(null);

  const draftLabel = (id: string, fallback: string) => drafts[id]?.label ?? fallback;
  const draftImage = (id: string, fallback: string) => drafts[id]?.image ?? fallback;
  const setDraft = (id: string, patch: { label?: string; image?: string }) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const pending = categories.filter((c) => {
    const d = drafts[c.id];
    if (!d) return false;
    return (d.label !== undefined && d.label !== c.label) || (d.image !== undefined && d.image !== c.image);
  });

  const applyChanges = async () => {
    try {
      await Promise.all(
        pending.map((c) => {
          const d = drafts[c.id]!;
          const patch: { id: string; label?: string; image?: string } = { id: c.id };
          if (d.label !== undefined && d.label !== c.label) patch.label = d.label.trim() || c.label;
          if (d.image !== undefined && d.image !== c.image) patch.image = d.image;
          return updateCategoryMutation.mutateAsync(patch);
        }),
      );
      setDrafts({});
      setConfirming(false);
      toast.success("Alterações aplicadas");
    } catch {
      toast.error("Não foi possível salvar. Tente novamente.");
    }
  };

  const countOf = (id: string) => categories.find((c) => c.id === id)?.postCount ?? 0;

  const askRemove = (id: string, label: string) => {
    const used = countOf(id);
    if (used > 0) {
      toast.error("Categoria em uso", {
        description: `${used} anúncio(s) ainda estão em “${label}”. Recategorize-os antes de remover.`,
      });
      return;
    }
    setRemoving({ id, label });
  };

  if (isLoading) {
    return (
      <AdminShell title="Categorias">
        <p className="text-sm text-muted-foreground">Carregando categorias…</p>
      </AdminShell>
    );
  }

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
            else if (picking) setDraft(picking, { image });
            setPicking(null);
          }}
        />

        {/* Nova categoria */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newLabel.trim()) return;
            addCategoryMutation.mutate(
              { label: newLabel, image: newImage || undefined },
              {
                onSuccess: () => {
                  setNewLabel("");
                  setNewImage("");
                  toast.success("Categoria criada");
                },
                onError: () => toast.error("Não foi possível criar a categoria."),
              },
            );
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
          <button
            type="submit"
            disabled={addCategoryMutation.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {addCategoryMutation.isPending
              ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              : <Plus className="h-4 w-4" />}
            {addCategoryMutation.isPending ? "Criando…" : "Adicionar categoria"}
          </button>
        </form>

        {/* Lista */}
        <div className="space-y-3">
          {categories.map((c, i) => (
            <div key={c.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className="flex flex-wrap items-center gap-3">
                <img
                  src={draftImage(c.id, c.image ?? "") || "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=60"}
                  alt=""
                  className="h-16 w-24 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-[12rem] flex-1">
                  <input
                    value={draftLabel(c.id, c.label)}
                    onChange={(e) => setDraft(c.id, { label: e.target.value })}
                    className="ci"
                    aria-label="Nome da categoria"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {countOf(c.id)} anúncio(s) nesta categoria
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ImageDropzone variant="plus" multiple={false} label="Trocar imagem" onFiles={(u) => u[0] && setDraft(c.id, { image: u[0] })} />
                  <button type="button" onClick={() => setPicking(c.id)} className="cbtn">
                    <Images className="h-4 w-4" /> Estoque
                  </button>
                  <button type="button" aria-label="Mover para cima" disabled={i === 0} onClick={() => moveCategoryMutation.mutate({ id: c.id, dir: -1 })} className="rounded-lg border p-2 disabled:opacity-40">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Mover para baixo" disabled={i === categories.length - 1} onClick={() => moveCategoryMutation.mutate({ id: c.id, dir: 1 })} className="rounded-lg border p-2 disabled:opacity-40">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Remover categoria" onClick={() => askRemove(c.id, c.label)} className="rounded-lg border border-destructive/40 p-2 text-destructive">
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

        <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
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
            {pending.length ? `${pending.length} categoria(s) alterada(s)` : "Nenhuma alteração pendente"}
          </span>
        </div>

        <ConfirmDialog
          open={confirming}
          title="Aplicar alterações nas categorias?"
          description="As mudanças passam a valer imediatamente no catálogo, na home e nos anúncios."
          onCancel={() => setConfirming(false)}
          onConfirm={applyChanges}
        >
          <ul className="space-y-2">
            {pending.map((c) => (
              <li key={c.id}>
                <span className="font-semibold">{c.label}</span>
                {drafts[c.id]?.label !== undefined && drafts[c.id]!.label !== c.label && (
                  <div className="text-xs text-muted-foreground">Novo nome: {drafts[c.id]!.label}</div>
                )}
                {drafts[c.id]?.image !== undefined && drafts[c.id]!.image !== c.image && (
                  <div className="text-xs text-muted-foreground">Nova imagem selecionada</div>
                )}
              </li>
            ))}
          </ul>
        </ConfirmDialog>

        <ConfirmDialog
          open={removing !== null}
          destructive
          title="Remover categoria?"
          description={removing ? `A categoria “${removing.label}” deixará de aparecer no site.` : undefined}
          confirmLabel="Remover"
          onCancel={() => setRemoving(null)}
          onConfirm={() => {
            if (!removing) return;
            deleteCategoryMutation.mutate(removing.id, {
              onSuccess: (result) => {
                setRemoving(null);
                if (result.ok) {
                  toast.success("Categoria removida");
                } else {
                  toast.error("Categoria em uso", { description: result.error });
                }
              },
              onError: () => {
                setRemoving(null);
                toast.error("Não foi possível remover a categoria.");
              },
            });
          }}
        />

        <style>{`.ci{width:100%;border-radius:1rem;border:1px solid var(--color-border);background:var(--color-background);padding:.65rem 1rem;font-size:.875rem;outline:none}.ci:focus{box-shadow:0 0 0 2px var(--color-ring)}.cbtn{display:inline-flex;align-items:center;gap:.5rem;border-radius:9999px;border:1px solid var(--color-border);padding:.5rem 1rem;font-size:.875rem;font-weight:600}.cbtn:hover{background:var(--color-muted)}`}</style>
      </div>
    </AdminShell>
  );
}
