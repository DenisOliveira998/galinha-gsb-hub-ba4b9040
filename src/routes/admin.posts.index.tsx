import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { usePostsQuery, useDeletePostMutation } from "@/lib/hooks/use-posts";
import { useCategoriesQuery } from "@/lib/hooks/use-categories";
import { useCommentsQuery, useDeleteCommentMutation } from "@/lib/hooks/use-comments";
import { ChevronDown, ChevronUp, Loader2, MessageSquare, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/posts/")({
  component: PostsList,
});

function formatDate(d: string | Date) {
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function CommentsPanel({ postId }: { postId: string }) {
  const { data: comments = [], isLoading } = useCommentsQuery(postId);
  const deleteMutation = useDeleteCommentMutation(postId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> Carregando comentários…
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <p className="px-4 py-3 text-xs text-muted-foreground">Nenhum comentário ainda.</p>
    );
  }

  return (
    <ul className="divide-y border-t">
      {comments.map((c) => (
        <li key={c.id} className="group flex items-start gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-xs font-semibold">{c.name}</span>
              <span className="text-[11px] text-muted-foreground">{formatDate(c.createdAt)}</span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground whitespace-pre-line">{c.text}</p>
          </div>
          <button
            type="button"
            aria-label="Remover comentário"
            onClick={() =>
              deleteMutation.mutate(c.id, {
                onSuccess: () => toast.success("Comentário removido"),
                onError: () => toast.error("Erro ao remover"),
              })
            }
            disabled={deleteMutation.isPending}
            className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-destructive/40 text-destructive opacity-0 transition hover:bg-destructive/10 group-hover:opacity-100 disabled:opacity-40"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function PostsList() {
  const { data: posts = [], isLoading } = usePostsQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const deleteMutation = useDeletePostMutation();
  const [openComments, setOpenComments] = useState<string | null>(null);

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
              <>
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
                      <button
                        type="button"
                        title="Comentários"
                        aria-label="Ver comentários"
                        onClick={() => setOpenComments(openComments === p.id ? null : p.id)}
                        className={`rounded-lg p-2 transition hover:bg-muted ${openComments === p.id ? "bg-muted text-primary" : ""}`}
                      >
                        {openComments === p.id ? <ChevronUp className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                      </button>
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
                {openComments === p.id && (
                  <tr key={`${p.id}-comments`}>
                    <td colSpan={5} className="bg-muted/30 px-0 py-0">
                      <div className="px-4 pb-1 pt-2">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Comentários — {p.title}
                        </p>
                      </div>
                      <CommentsPanel postId={p.id} />
                    </td>
                  </tr>
                )}
              </>
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
