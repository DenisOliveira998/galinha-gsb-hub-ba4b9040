import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlogLikeSummary, toggleBlogLike } from "@/lib/blog";

function getOwnerKey(): string {
  if (typeof window === "undefined") return "ssr";
  let key = localStorage.getItem("ownerKey");
  if (!key) { key = crypto.randomUUID(); localStorage.setItem("ownerKey", key); }
  return key;
}

export function useBlogLikeQuery(postId: string) {
  return useQuery({
    queryKey: ["blog-like", postId],
    queryFn: () => getBlogLikeSummary({ data: { postId, ownerKey: getOwnerKey() } }),
    staleTime: 30_000,
  });
}

export function useToggleBlogLikeMutation(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => toggleBlogLike({ data: { postId, ownerKey: getOwnerKey() } }),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["blog-like", postId] });
      const prev = qc.getQueryData<{ count: number; liked: boolean }>(["blog-like", postId]);
      if (prev) {
        qc.setQueryData(["blog-like", postId], {
          count: prev.liked ? prev.count - 1 : prev.count + 1,
          liked: !prev.liked,
        });
      }
      return { prev };
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["blog-like", postId], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["blog-like", postId] }),
  });
}
