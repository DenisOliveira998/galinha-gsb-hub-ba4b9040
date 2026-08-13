import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listFavorites, toggleFavorite } from "@/lib/favorites";

// Chave única por visitante anônimo — mesma do ownerKey em ratings.
function getOwnerKey(): string {
  if (typeof window === "undefined") return "ssr";
  let key = localStorage.getItem("ownerKey");
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem("ownerKey", key);
  }
  return key;
}

export function useFavoritesQuery() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: () => listFavorites({ data: { ownerKey: getOwnerKey() } }),
    staleTime: 30_000,
  });
}

export function useToggleFavoriteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      toggleFavorite({ data: { postId, ownerKey: getOwnerKey() } }),
    // Optimistic update: inverte localmente antes da resposta do servidor
    onMutate: async (postId) => {
      await qc.cancelQueries({ queryKey: ["favorites"] });
      const prev = qc.getQueryData<string[]>(["favorites"]) ?? [];
      const next = prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId];
      qc.setQueryData(["favorites"], next);
      return { prev };
    },
    onError: (_err, _postId, ctx) => {
      if (ctx?.prev) qc.setQueryData(["favorites"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}
