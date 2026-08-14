import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { usePostsQuery, useUpdatePostMutation } from "@/lib/hooks/use-posts";
import { useCommentsQuery, useDeleteCommentMutation } from "@/lib/hooks/use-comments";
import { ChevronDown, ChevronUp, Loader2, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/posts/$id")({
  component: EditPost,
});

function formatDate(d: string | Date) {
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function CommentsSection({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const { data: comments = [], isLoading } = useCommentsQuery(postId);
  const deleteMutation = useDeleteCommentMutation(postId);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]">
      {/* Header / toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition"
      >
        <div className="flex items-center gap-2 font-semibold">
          <MessageSquare className="h-4 w-4 text-primary" />
          Comentários
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {isLoading ? "…" : comments.length}
          </span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {/* Painel */}
      {open && (
        <div className="border-t">
          {isLoading ? (
            <div className="flex items-center gap-2 px-5 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
            </div>
          ) : comments.length === 0 ? (
            <p className="px-5 py-4 text-sm text-muted-foreground">Nenhum comentário ainda.</p>
          ) : (
            <ul className="divide-y">
              {comments.map((c) => (
                <li key={c.id} className="group flex items-start gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-sm font-semibold">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 whitespace-pre-line text-sm text-muted-foreground">{c.text}</p>
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
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function EditPost() {
  const { id } = Route.useParams();
  const { data: posts = [], isLoading } = usePostsQuery();
  const updateMutation = useUpdatePostMutation();
  const router = useRouter();

  if (isLoading) {
    return (
      <AdminShell title="Editar">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando anúncio…
        </div>
      </AdminShell>
    );
  }

  const post = posts.find((p) => p.id === id);
  if (!post) {
    return <AdminShell title="Editar"><p className="text-sm text-muted-foreground">Anúncio não encontrado.</p></AdminShell>;
  }

  return (
    <AdminShell title={`Editar: ${post.title}`}>
      <PostForm
        initial={post}
        loading={updateMutation.isPending}
        onSubmit={(v) => {
          if (updateMutation.isPending) return;
          updateMutation.mutate(
            { id, ...v },
            {
              onSuccess: () => {
                toast.success("Anúncio atualizado com sucesso");
                router.navigate({ to: "/admin/posts" });
              },
              onError: () => toast.error("Erro ao atualizar anúncio. Tente novamente."),
            },
          );
        }}
      />
      <CommentsSection postId={id} />
    </AdminShell>
  );
}
