import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listComments, addComment, deleteComment } from "@/lib/comments";

export function useCommentsQuery(postId: string) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => listComments({ data: { postId } }),
    staleTime: 30_000,
  });
}

export function useAddCommentMutation(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, text }: { name: string; text: string }) =>
      addComment({ data: { postId, name, text } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", postId] }),
  });
}

export function useDeleteCommentMutation(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteComment({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", postId] }),
  });
}
