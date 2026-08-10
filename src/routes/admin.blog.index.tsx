import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useBlogPostsQuery, useDeleteBlogPostMutation } from "@/lib/hooks/use-blog";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog/")({
  component: BlogList,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function BlogList() {
  const { data: blog = [], isLoading } = useBlogPostsQuery();
  const deleteMutation = useDeleteBlogPostMutation();

  if (isLoading) {
    return (
      <AdminShell title="Blog">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando posts…
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Blog">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{blog.length} post(s)</p>
        <Link to="/admin/blog/novo" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Novo post
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Publicado</th>
              <th className="px-4 py-3">Data</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {blog.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-medium">{b.title}</td>
                <td className="px-4 py-3">{b.published ? "Sim" : "Não"}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(b.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Link
                      to="/admin/blog/$id"
                      params={{ id: b.id }}
                      title="Editar"
                      aria-label="Editar post"
                      className="rounded-lg p-2 hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Remover definitivamente "${b.title}"? Esta ação não pode ser desfeita.`)) {
                          deleteMutation.mutate(b.id, {
                            onSuccess: () => toast.success("Post removido"),
                            onError: () => toast.error("Erro ao remover post"),
                          });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      title="Remover"
                      aria-label="Remover post"
                      className="rounded-lg p-2 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {blog.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Nenhum post publicado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
