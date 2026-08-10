import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listHeroSlides,
  addHeroSlide,
  addHeroSlidesBulk,
  updateHeroSlide,
  deleteHeroSlide,
  moveHeroSlide,
} from "@/lib/hero-slides";

export const HERO_SLIDES_KEY = ["hero-slides"] as const;

/** Lê todos os slides do carrossel do TiDB. Substitui useStore(s => s.heroSlides). */
export function useHeroSlidesQuery() {
  return useQuery({
    queryKey: HERO_SLIDES_KEY,
    queryFn: () => listHeroSlides(),
    staleTime: 15_000,
  });
}

function useInvalidateSlides() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: HERO_SLIDES_KEY });
}

/** Adiciona um único slide. */
export function useAddHeroSlideMutation() {
  const invalidate = useInvalidateSlides();
  return useMutation({
    mutationFn: (input: Parameters<typeof addHeroSlide>[0]["data"]) =>
      addHeroSlide({ data: input }),
    onSuccess: () => invalidate(),
  });
}

/**
 * Adiciona múltiplos slides de uma vez (upload múltiplo).
 * Substitui useStore(s => s.addHeroSlides).
 */
export function useAddHeroSlidesBulkMutation() {
  const invalidate = useInvalidateSlides();
  return useMutation({
    mutationFn: (images: string[]) => addHeroSlidesBulk({ data: { images } }),
    onSuccess: () => invalidate(),
  });
}

/** Atualiza textos ou imagem de um slide. Substitui useStore(s => s.updateHeroSlide). */
export function useUpdateHeroSlideMutation() {
  const invalidate = useInvalidateSlides();
  return useMutation({
    mutationFn: (input: { id: string; image?: string; title?: string; subtitle?: string; ctaLabel?: string; ctaTo?: string }) =>
      updateHeroSlide({ data: input }),
    onSuccess: () => invalidate(),
  });
}

/** Remove um slide do carrossel. Substitui useStore(s => s.deleteHeroSlide). */
export function useDeleteHeroSlideMutation() {
  const invalidate = useInvalidateSlides();
  return useMutation({
    mutationFn: (id: string) => deleteHeroSlide({ data: { id } }),
    onSuccess: () => invalidate(),
  });
}

/** Move o slide para cima (-1) ou para baixo (1). Substitui useStore(s => s.moveHeroSlide). */
export function useMoveHeroSlideMutation() {
  const invalidate = useInvalidateSlides();
  return useMutation({
    mutationFn: (input: { id: string; dir: -1 | 1 }) => moveHeroSlide({ data: input }),
    onSuccess: () => invalidate(),
  });
}
