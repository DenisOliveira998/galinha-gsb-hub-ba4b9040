import { useEffect } from "react";
import { useSettingsQuery } from "@/lib/hooks/use-settings";
import { applyBrandColor, DEFAULT_BRAND_COLOR } from "@/lib/brand-color";

/**
 * Aplica a cor principal configurada no admin em todo o site.
 * Isolado e tolerante a falhas: nunca derruba a árvore de renderização
 * nem interfere no tema claro/escuro.
 */
export function BrandTheme() {
  const { data: settings } = useSettingsQuery();
  useEffect(() => {
    try {
      applyBrandColor(settings?.brandColor || DEFAULT_BRAND_COLOR);
    } catch (err) {
      console.error("Falha ao aplicar a cor da marca", err);
    }
  }, [settings?.brandColor]);
  return null;
}
