import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  moveCategory,
} from "@/lib/categories";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

/** Lê as categorias reais do banco (TiDB). Substitui useCategories(). */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => listCategories(),
    staleTime: 30_000,
  });
}

function useInvalidateCategories() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
}

export function useAddCategoryMutation() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (input: { label: string; image?: string }) => createCategory({ data: input }),
    onSuccess: () => invalidate(),
  });
}

export function useUpdateCategoryMutation() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (input: { id: string; label?: string; image?: string }) =>
      updateCategory({ data: input }),
    onSuccess: () => invalidate(),
  });
}

export function useDeleteCategoryMutation() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (id: string) => deleteCategory({ data: { id } }),
    onSuccess: (result) => {
      if (result.ok) invalidate();
    },
  });
}

export function useMoveCategoryMutation() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (input: { id: string; dir: -1 | 1 }) => moveCategory({ data: input }),
    onSuccess: () => invalidate(),
  });
}
