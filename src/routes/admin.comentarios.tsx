import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, MessageSquare, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { listAllComments, deleteComment } from "@/lib/comments";

export const Route = createFileRoute("/admin/comentarios")({
  loader: async () => {
    const comments = await listAllComments();
    return { comments };
  },
  component: Comentarios,
});

type Comment = Awaited<ReturnType<typeof listAllComments>>[number];

function formatDate(d: string | Date) {
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Comentarios() {
  const { comments: initial } = Route.useLoaderData();
  const [comments, setComments] = useState<Comment[]>(initial);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = search.trim()
    ? comments.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.text.toLowerCase().includes(search.toLowerCase()) ||
        c.post.title.toLowerCase().includes(search.toLowerCase()),
      )
    : comments;

  const remove = async (id: string) => {
    setDeleting(id);
    try {
      await deleteComment({ data: { id } });
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Comentário removido");
    } catch {
      toast.error("Erro ao remover comentário");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminShell title="Comentários">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {comments.length} {comments.length === 1 ? "comentário" : "comentários"} no total
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, texto ou anúncio…"
              className="rounded-xl border bg-background py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring w-72"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-muted p-10 text-center text-sm text-muted-foreground">
            {search ? "Nenhum comentário encontrado." : "Ainda não há comentários."}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((c) => (
              <div key={c.id} className="group flex gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-semibold">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
                    <Link
                      to="/catalogo/$slug"
                      params={{ slug: c.post.slug }}
                      target="_blank"
                      className="ml-auto flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      {c.post.title} <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{c.text}</p>
                </div>
                <button
                  type="button"
                  aria-label="Remover comentário"
                  onClick={() => remove(c.id)}
                  disabled={deleting === c.id}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-destructive/40 text-destructive opacity-0 transition hover:bg-destructive/10 group-hover:opacity-100 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
