import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listMediaLibrary,
  addMedia,
  deleteMedia,
  addCategoryImages,
  deleteCategoryImage,
  updateCategoryImage,
  moveCategoryImage,
} from "@/lib/media-library";

export const MEDIA_LIBRARY_KEY = ["media-library"] as const;

/** Lê todas as imagens do estoque. Substitui useStore(s => s.mediaLibrary). */
export function useMediaLibraryQuery() {
  return useQuery({
    queryKey: MEDIA_LIBRARY_KEY,
    queryFn: () => listMediaLibrary(),
    staleTime: 15_000,
  });
}

function useInvalidateMedia() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: MEDIA_LIBRARY_KEY });
}

/** Adiciona imagens ao estoque. Substitui useStore(s => s.addMedia). */
export function useAddMediaMutation() {
  const invalidate = useInvalidateMedia();
  return useMutation({
    mutationFn: (images: string[]) => addMedia({ data: { images } }),
    onSuccess: () => invalidate(),
  });
}

/** Remove uma imagem do estoque. Substitui useStore(s => s.deleteMedia). */
export function useDeleteMediaMutation() {
  const invalidate = useInvalidateMedia();
  return useMutation({
    mutationFn: (url: string) => deleteMedia({ data: { url } }),
    onSuccess: () => invalidate(),
  });
}

/** Adiciona imagens a uma categoria. Substitui useStore(s => s.addCategoryImages). */
export function useAddCategoryImagesMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { categoryId: string; images: string[] }) =>
      addCategoryImages({ data: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: MEDIA_LIBRARY_KEY });
    },
  });
}

/** Remove uma imagem de uma categoria pelo ID. Substitui useStore(s => s.deleteCategoryImage). */
export function useDeleteCategoryImageMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategoryImage({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

/** Atualiza a URL de uma imagem de categoria pelo ID. */
export function useUpdateCategoryImageMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; url: string }) =>
      updateCategoryImage({ data: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

/** Move uma imagem de categoria para cima (-1) ou para baixo (1). */
export function useMoveCategoryImageMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; dir: -1 | 1 }) => moveCategoryImage({ data: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}
