import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/mock-store";
import { useHydrated } from "@/hooks/use-hydrated";

/** Botão de favoritar (coração) ligado à store compartilhada. */
export function FavoriteButton({
  postId,
  title,
  className = "",
  withLabel = false,
}: {
  postId: string;
  title?: string;
  className?: string;
  withLabel?: boolean;
}) {
  const hydrated = useHydrated();
  const favorites = useStore((s) => s.favorites);
  const toggle = useStore((s) => s.toggleFavorite);
  const active = hydrated && (favorites ?? []).includes(postId);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(postId);
    toast.success(active ? "Removido dos favoritos" : "Salvo nos favoritos", {
      description: title,
    });
  };

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={handle}
        aria-pressed={active}
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition hover:bg-muted ${active ? "border-destructive/40 text-destructive" : ""} ${className}`}
      >
        <Heart className={`h-4 w-4 ${active ? "fill-destructive" : ""}`} />
        {active ? "Nos favoritos" : "Favoritar"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      title={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={`grid h-9 w-9 place-items-center rounded-full bg-card/90 shadow-[var(--shadow-soft)] backdrop-blur-sm transition hover:scale-105 ${className}`}
    >
      <Heart className={`h-4 w-4 ${active ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
    </button>
  );
}