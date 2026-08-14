import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { usePostsQuery, useDeletePostMutation } from "@/lib/hooks/use-posts";
import { useCategoriesQuery } from "@/lib/hooks/use-categories";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/posts/")({
  component: PostsList,
});

function PostsList() {
  const { data: posts = [], isLoading } = usePostsQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const deleteMutation = useDeletePostMutation();

  const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  if (isLoading) {
    return (
      <AdminShell title="Anúncios">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando anúncios…
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Anúncios">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{posts.length} anúncio(s)</p>
        <Link to="/admin/posts/novo" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Novo anúncio
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{catLabel(p.category)}</td>
                <td className="px-4 py-3">{p.price ? `R$ ${p.price.toFixed(2)}` : "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${p.status === "PUBLISHED" ? "bg-primary/10 text-primary" : p.status === "SOLD" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Link
                      to="/admin/posts/$id"
                      params={{ id: p.id }}
                      title="Editar"
                      aria-label="Editar anúncio"
                      className="rounded-lg p-2 hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Remover definitivamente "${p.title}"? Esta ação não pode ser desfeita.`)) {
                          deleteMutation.mutate(p.id, {
                            onSuccess: () => toast.success("Anúncio removido"),
                            onError: () => toast.error("Erro ao remover anúncio"),
                          });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      title="Remover"
                      aria-label="Remover anúncio"
                      className="rounded-lg p-2 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Nenhum anúncio cadastrado ainda. Clique em "Novo anúncio" para começar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
