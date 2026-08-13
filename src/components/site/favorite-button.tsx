import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useFavoritesQuery, useToggleFavoriteMutation } from "@/lib/hooks/use-favorites";
import { useHydrated } from "@/hooks/use-hydrated";

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
  const { data: favorites = [] } = useFavoritesQuery();
  const toggleMutation = useToggleFavoriteMutation();
  const active = hydrated && favorites.includes(postId);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMutation.mutate(postId, {
      onSuccess: (result) => {
        toast.success(result.favorited ? "Salvo nos favoritos" : "Removido dos favoritos", {
          description: title,
        });
      },
    });
  };

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={handle}
        disabled={toggleMutation.isPending}
        aria-pressed={active}
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition hover:bg-muted disabled:opacity-60 ${active ? "border-destructive/40 text-destructive" : ""} ${className}`}
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
      disabled={toggleMutation.isPending}
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      title={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={`grid h-9 w-9 place-items-center rounded-full bg-card/90 shadow-[var(--shadow-soft)] backdrop-blur-sm transition hover:scale-105 disabled:opacity-60 ${className}`}
    >
      <Heart className={`h-4 w-4 ${active ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
    </button>
  );
}
