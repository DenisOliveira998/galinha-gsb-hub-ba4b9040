import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { GA_MEASUREMENT_ID, trackEvent, trackPageView } from "@/lib/analytics";

/**
 * Mede as trocas de página (o site é SPA) e os cliques de contato.
 *
 * Plano de medição (eventos):
 *   generate_lead  — clique em link do WhatsApp (principal conversão: pedido/contato)
 *                    params: method="whatsapp", link_location=<página>
 *   contact_click  — clique em Instagram, e-mail ou telefone
 *                    params: method="instagram"|"email"|"phone", link_location
 * Downloads (PDF do Guia) e cliques externos já são medidos pela
 * "Medição otimizada" do GA4 — não duplicar aqui.
 */
export function AnalyticsTracker() {
  const router = useRouter();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    // 1ª página (carregada pelo servidor): o <title> já está certo.
    trackPageView(window.location.pathname, document.title);
    // Navegações seguintes: "onRendered" dispara depois de a nova página
    // renderizar; o pequeno atraso garante que o HeadContent já trocou o <title>.
    let timer: number | undefined;
    const unsubscribe = router.subscribe("onRendered", (e) => {
      if (!e.pathChanged) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => trackPageView(e.toLocation.pathname, document.title), 150);
    });
    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.href;
      const link_location = window.location.pathname;
      if (/wa\.me|whatsapp\.com/i.test(href)) {
        trackEvent("generate_lead", { method: "whatsapp", link_location });
      } else if (/instagram\.com/i.test(href)) {
        trackEvent("contact_click", { method: "instagram", link_location });
      } else if (href.startsWith("mailto:")) {
        trackEvent("contact_click", { method: "email", link_location });
      } else if (href.startsWith("tel:")) {
        trackEvent("contact_click", { method: "phone", link_location });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
