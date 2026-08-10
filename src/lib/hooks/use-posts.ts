import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listPosts, createPost, updatePost, deletePost } from "@/lib/posts";

export const POSTS_QUERY_KEY = ["posts"] as const;

/** Lê todos os anúncios do TiDB. Substitui useStore(s => s.posts). */
export function usePostsQuery() {
  return useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: () => listPosts(),
    staleTime: 15_000,
  });
}

function useInvalidatePosts() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
}

/** Cria um novo anúncio. Substitui useStore(s => s.addPost). */
export function useCreatePostMutation() {
  const invalidate = useInvalidatePosts();
  return useMutation({
    mutationFn: (input: Parameters<typeof createPost>[0]["data"]) =>
      createPost({ data: input }),
    onSuccess: () => invalidate(),
  });
}

/** Atualiza um anúncio existente. Substitui useStore(s => s.updatePost). */
export function useUpdatePostMutation() {
  const invalidate = useInvalidatePosts();
  return useMutation({
    mutationFn: (input: Parameters<typeof updatePost>[0]["data"]) =>
      updatePost({ data: input }),
    onSuccess: () => invalidate(),
  });
}

/** Remove um anúncio pelo id. Substitui useStore(s => s.deletePost). */
export function useDeletePostMutation() {
  const invalidate = useInvalidatePosts();
  return useMutation({
    mutationFn: (id: string) => deletePost({ data: { id } }),
    onSuccess: () => invalidate(),
  });
}
