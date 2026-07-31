import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { formatDate, useStore } from "@/lib/mock-store";
import { useHydrated } from "@/hooks/use-hydrated";

/** Comentários do anúncio — mockados na store compartilhada. */
export function CommentsSection({ postId }: { postId: string }) {
  const hydrated = useHydrated();
  const comments = useStore((s) => s.comments);
  const addComment = useStore((s) => s.addComment);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const list = hydrated
    ? (comments ?? [])
        .filter((c) => c.postId === postId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    : [];

  return (
    <section className="mt-12 rounded-3xl bg-card p-5 text-left shadow-[var(--shadow-soft)] md:p-7">
      <h2 className="flex items-center gap-2 font-display text-xl">
        <MessageSquare className="h-5 w-5 text-primary" /> Comentários
        <span className="text-sm font-normal text-muted-foreground">({list.length})</span>
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          addComment(postId, name.slice(0, 60), text.slice(0, 800));
          setText("");
          toast.success("Comentário publicado");
        }}
        className="mt-4 space-y-3"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          placeholder="Seu nome (opcional)"
          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
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
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105"
        >
          Comentar
        </button>
      </form>

      <ul className="mt-6 space-y-3">
        {list.map((c) => (
          <li key={c.id} className="rounded-2xl bg-muted/60 p-4 text-left">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-semibold">{c.name}</span>
              <span className="text-[11px] text-muted-foreground">{formatDate(c.createdAt)}</span>
            </div>
            <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{c.text}</p>
          </li>
        ))}
        {list.length === 0 && (
          <li className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
            Ainda não há comentários. Seja o primeiro!
          </li>
        )}
      </ul>
    </section>
  );
}