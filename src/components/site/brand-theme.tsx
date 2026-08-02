import { useEffect } from "react";
import { useStore } from "@/lib/mock-store";
import { applyBrandColor, DEFAULT_BRAND_COLOR } from "@/lib/brand-color";

/**
 * Aplica a cor principal configurada no admin em todo o site.
 * Isolado e tolerante a falhas: nunca derruba a árvore de renderização
 * nem interfere no tema claro/escuro.
 */
export function BrandTheme() {
  const brandColor = useStore((s) => s.settings?.brandColor);
  useEffect(() => {
    try {
      applyBrandColor(brandColor || DEFAULT_BRAND_COLOR);
    } catch (err) {
      console.error("Falha ao aplicar a cor da marca", err);
    }
  }, [brandColor]);
  return null;
}
