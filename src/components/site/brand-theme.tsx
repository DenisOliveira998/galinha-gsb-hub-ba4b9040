import { useEffect } from "react";
import { useStore } from "@/lib/mock-store";
import { applyBrandColor, DEFAULT_BRAND_COLOR } from "@/lib/brand-color";

/** Aplica a cor principal configurada no admin em todo o site. */
export function BrandTheme() {
  const brandColor = useStore((s) => s.settings.brandColor);
  useEffect(() => {
    applyBrandColor(brandColor || DEFAULT_BRAND_COLOR);
  }, [brandColor]);
  return null;
}
