import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/blog";

export const BLOG_QUERY_KEY = ["blog"] as const;

/** Lê todos os posts do blog do TiDB. Substitui useStore(s => s.blog). */
export function useBlogPostsQuery() {
  return useQuery({
    queryKey: BLOG_QUERY_KEY,
    queryFn: () => listBlogPosts(),
    staleTime: 15_000,
  });
}

function useInvalidateBlog() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: BLOG_QUERY_KEY });
}

/** Cria um novo post do blog. Substitui useStore(s => s.addBlog). */
export function useCreateBlogPostMutation() {
  const invalidate = useInvalidateBlog();
  return useMutation({
    mutationFn: (input: Parameters<typeof createBlogPost>[0]["data"]) =>
      createBlogPost({ data: input }),
    onSuccess: () => invalidate(),
  });
}

/** Atualiza um post do blog. Substitui useStore(s => s.updateBlog). */
export function useUpdateBlogPostMutation() {
  const invalidate = useInvalidateBlog();
  return useMutation({
    mutationFn: (input: Parameters<typeof updateBlogPost>[0]["data"]) =>
      updateBlogPost({ data: input }),
    onSuccess: () => invalidate(),
  });
}

/** Remove um post do blog pelo id. Substitui useStore(s => s.deleteBlog). */
export function useDeleteBlogPostMutation() {
  const invalidate = useInvalidateBlog();
  return useMutation({
    mutationFn: (id: string) => deleteBlogPost({ data: { id } }),
    onSuccess: () => invalidate(),
  });
}
