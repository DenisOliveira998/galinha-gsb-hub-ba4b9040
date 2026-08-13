import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRatingSummary, getMyRating, ratePost } from "@/lib/ratings";

// Chave única por visitante anônimo — persistida no localStorage.
export function getOwnerKey(): string {
  if (typeof window === "undefined") return "ssr";
  let key = localStorage.getItem("ownerKey");
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem("ownerKey", key);
  }
  return key;
}

export function useRatingSummaryQuery(postId: string) {
  return useQuery({
    queryKey: ["ratings", "summary", postId],
    queryFn: () => getRatingSummary({ data: { postId } }),
    staleTime: 30_000,
  });
}

export function useMyRatingQuery(postId: string) {
  return useQuery({
    queryKey: ["ratings", "mine", postId],
    queryFn: () => getMyRating({ data: { postId, ownerKey: getOwnerKey() } }),
    staleTime: 60_000,
  });
}

export function useRatePostMutation(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (value: number) =>
      ratePost({ data: { postId, ownerKey: getOwnerKey(), value } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ratings", "summary", postId] });
      qc.invalidateQueries({ queryKey: ["ratings", "mine", postId] });
    },
  });
}
