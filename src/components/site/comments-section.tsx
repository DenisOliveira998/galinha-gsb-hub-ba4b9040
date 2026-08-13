import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useCommentsQuery, useAddCommentMutation, useDeleteCommentMutation } from "@/lib/hooks/use-comments";

function formatDate(iso: string | Date) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function CommentsSection({ postId, isAdmin = false }: { postId: string; isAdmin?: boolean }) {
  const { data: session } = authClient.useSession();
  const loggedIn = !!session?.user;

  const { data: comments = [] } = useCommentsQuery(postId);
  const addMutation = useAddCommentMutation(postId);
  const deleteMutation = useDeleteCommentMutation(postId);

  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addMutation.mutate(
      { name: session?.user?.name || session?.user?.email?.split("@")[0] || "Visitante", text: text.trim() },
      {
        onSuccess: () => {
          setText("");
          toast.success("Comentário publicado");
        },
        onError: () => toast.error("Erro ao publicar comentário. Tente novamente."),
      },
    );
  };

  return (
    <section className="mt-12 rounded-3xl bg-card p-5 text-left shadow-[var(--shadow-soft)] md:p-7">
      <h2 className="flex items-center gap-2 font-display text-xl">
        <MessageSquare className="h-5 w-5 text-primary" /> Comentários
        <span className="text-sm font-normal text-muted-foreground">({comments.length})</span>
      </h2>

      {loggedIn ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={800}
            required
            placeholder="Escreva um comentário sobre este anúncio..."
            className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105 disabled:opacity-60"
          >
            {addMutation.isPending && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            )}
            {addMutation.isPending ? "Enviando…" : "Comentar"}
          </button>
        </form>
      ) : (
        <div className="mt-4 rounded-2xl bg-muted/60 px-5 py-4 text-sm text-muted-foreground">
          <Link to="/conta/login" className="font-semibold text-primary hover:underline">
            Faça login
          </Link>{" "}
          para deixar um comentário.
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="group relative rounded-2xl bg-muted/60 p-4 text-left">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-semibold">{c.name}</span>
                <span className="text-[11px] text-muted-foreground">{formatDate(c.createdAt)}</span>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  aria-label="Remover comentário"
                  onClick={() => {
                    deleteMutation.mutate(c.id, {
                      onSuccess: () => toast.success("Comentário removido"),
                      onError: () => toast.error("Erro ao remover"),
                    });
                  }}
                  disabled={deleteMutation.isPending}
                  className="grid h-7 w-7 place-items-center rounded-full border border-destructive/40 text-destructive opacity-0 transition hover:bg-destructive/10 group-hover:opacity-100 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{c.text}</p>
          </li>
        ))}
        {comments.length === 0 && (
          <li className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
            Ainda não há comentários. Seja o primeiro!
          </li>
        )}
      </ul>
    </section>
  );
}
