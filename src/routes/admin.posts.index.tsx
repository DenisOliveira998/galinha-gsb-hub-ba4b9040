import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useStore, useCategoryLabel } from "@/lib/mock-store";
import { Plus, Trash2, Pencil } from "lucide-react";

export const Route = createFileRoute("/admin/posts/")({
  component: PostsList,
});

function PostsList() {
  const posts = useStore((s) => s.posts);
  const del = useStore((s) => s.deletePost);
  const catLabel = useCategoryLabel();
  return (
    <AdminShell title="Anúncios">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{posts.length} anúncio(s)</p>
        <Link to="/admin/posts/novo" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> Novo anúncio</Link>
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
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${p.status === "PUBLISHED" ? "bg-primary/10 text-primary" : p.status === "SOLD" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Link to="/admin/posts/$id" params={{ id: p.id }} title="Editar" aria-label="Editar anúncio" className="rounded-lg p-2 hover:bg-muted"><Pencil className="h-4 w-4" /></Link>
                    <button onClick={() => { if (confirm(`Remover definitivamente "${p.title}"? Esta ação não pode ser desfeita.`)) del(p.id); }} title="Remover" aria-label="Remover anúncio" className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}