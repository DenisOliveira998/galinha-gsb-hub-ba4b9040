import { useEffect, useRef } from "react";
import { useSettingsQuery, EMPTY_SETTINGS } from "@/lib/hooks/use-settings";

type SlotKey = "homeBanner" | "homeRectangle" | "blog";

const ENV_PUBLISHER_ID: string =
  (import.meta.env?.VITE_ADSENSE_PUBLISHER_ID as string | undefined)?.trim() || "";

/** ID do publisher: admin (Configurações) tem prioridade, senão variável de ambiente. */
export function useAdsensePublisherId(): string {
  const { data: settings = EMPTY_SETTINGS } = useSettingsQuery();
  return (settings.adsensePublisherId || "").trim() || ENV_PUBLISHER_ID;
}

function useSlotId(slot: SlotKey): string {
  const { data: settings = EMPTY_SETTINGS } = useSettingsQuery();
  if (slot === "homeBanner") return settings.adsenseSlotHomeBanner ?? "";
  if (slot === "homeRectangle") return settings.adsenseSlotHomeRectangle ?? "";
  return settings.adsenseSlotBlog ?? "";
}

interface AdSlotProps {
  slot: SlotKey;
  label: string;
  /** Texto do placeholder mockado enquanto o AdSense não estiver configurado. */
  placeholder: React.ReactNode;
  className?: string;
  format?: string;
  /** Layout vertical (skyscraper) não deve usar full-width responsive. */
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  /** Slot específico do post — sobrescreve o slot global quando preenchido. */
  customSlotId?: string;
}

export function AdSlot({
  slot,
  label,
  placeholder,
  className,
  format = "auto",
  fullWidthResponsive = true,
  style,
  customSlotId,
}: AdSlotProps) {
  const client = useAdsensePublisherId();
  const globalSlotId = (useSlotId(slot) || "").trim();
  const slotId = (customSlotId || "").trim() || globalSlotId;
  const ref = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);
  const active = Boolean(client && slotId);

  useEffect(() => {
    if (!active || pushed.current || !ref.current) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      /* AdSense indisponível — mantém a página funcionando normalmente */
    }
  }, [active]);

  // Sem publisher/slot configurado: não exibe nada (sem placeholder visível ao público).
  if (!active) return null;

  return (
    <div role="complementary" aria-label={label} className={className}>
      <ins
        ref={ref}
        className="adsbygoogle block w-full"
        style={{ display: "block", ...style }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}

/** Injeta o script oficial do AdSense apenas quando há publisher configurado. */
export function AdsenseScript() {
  const client = useAdsensePublisherId();
  useEffect(() => {
    if (!client) return;
    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    if (document.querySelector(`script[data-adsense="1"]`)) return;
    const el = document.createElement("script");
    el.async = true;
    el.src = src;
    el.crossOrigin = "anonymous";
    el.dataset.adsense = "1";
    document.head.appendChild(el);
  }, [client]);
  return null;
}
