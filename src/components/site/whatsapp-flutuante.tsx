import { whatsappHref, type SiteSettings } from "@/lib/mock-store";
import { useSettingsQuery, EMPTY_SETTINGS } from "@/lib/hooks/use-settings";
import { trackEvent } from "@/lib/analytics";

/**
 * Botão redondo do WhatsApp fixo no canto inferior direito (da landing).
 * No celular ele sobe enquanto o aviso de cookies está aberto, para não
 * ficar por cima dos botões do aviso (ver cookie-banner e styles.css).
 */
export function WhatsappFlutuante() {
  const { data: settings } = useSettingsQuery();
  const s = (settings ?? EMPTY_SETTINGS) as SiteSettings;
  if (!(s.whatsappLink || s.whatsapp)) return null;
  return (
    <a
      href={whatsappHref(s, "Olá! Vim pelo site e gostaria de mais informações.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      title="Conversar no WhatsApp"
      onClick={() => trackEvent("contact_click", { method: "whatsapp", link_location: "botao_flutuante" })}
      className="zap-flutuante fixed bottom-[18px] right-[18px] z-[45] grid h-[60px] w-[60px] place-items-center rounded-full bg-[#1fa855] text-white shadow-[0_14px_34px_-10px_rgba(31,168,85,0.9)] transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-rotate-6 hover:scale-[1.08] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1fa855]/40"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[30px] w-[30px]">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 13.8c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.2z" />
      </svg>
    </a>
  );
}
