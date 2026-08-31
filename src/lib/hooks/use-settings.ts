import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings } from "@/lib/settings";
import type { SiteSettings } from "@/lib/mock-store";

export const SETTINGS_QUERY_KEY = ["settings"] as const;

/** Fallback seguro para usar enquanto o fetch de settings ainda não resolveu. */
export const EMPTY_SETTINGS: SiteSettings = {
  whatsapp: "",
  whatsappLink: "",
  instagram: "",
  youtube: "",
  address: "",
  email: "",
  aboutText: "",
  brandColor: "",
  siteDescription: "",
  adsensePublisherId: "",
  adsenseSlotHomeBanner: "",
  adsenseSlotHomeRectangle: "",
  adsenseSlotBlog: "",
  badgeImage: "/badge.png",
  ogImage: "/logo.png",
  heroEyebrow: "Raça tradicional brasileira",
  heroTitle: "Conheça a importância da raça GSB",
  heroSubtitle: "Ovos férteis, galinhas e reprodutores da linhagem Sertanejo Balão — criados com dedicação, procedência garantida e suporte ao criador.",
};

/** Lê as configurações reais do banco (TiDB). Substitui useStore(s => s.settings). */
export function useSettingsQuery() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: () => getSettings(),
    // Configurações mudam pouco — evita refetch agressivo.
    staleTime: 30_000,
  });
}

/** Aplica alterações nas configurações. Substitui useStore(s => s.updateSettings). */
export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<SiteSettings>) => updateSettings({ data: patch }),
    onSuccess: (updated) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, updated);
    },
  });
}
