// Google Analytics 4 (gtag.js) com Consent Mode v2.
//
// • Antes do aceite no banner de cookies, tudo começa "denied": o GA envia só
//   sinais anônimos, sem gravar cookies (o Google modela esses acessos).
// • Ao clicar em "Aceitar", o consentimento vira "granted" (analytics + anúncios).
// • Ao clicar em "Recusar", fica "denied" e a escolha é lembrada.
// • O painel /admin nunca é medido.
//
// O ID de medição (G-XXXXXXXXXX) não é segredo: aparece no HTML de qualquer
// site que usa GA. Pode vir da Vercel (VITE_GA_MEASUREMENT_ID) ou do valor abaixo.

export const GA_MEASUREMENT_ID: string =
  ((import.meta.env?.VITE_GA_MEASUREMENT_ID as string | undefined) || "").trim() || "G-PP22N9N3H6";

/** Chave do banner de cookies. Valor = data ISO (aceitou) ou "denied" (recusou). */
export const CONSENT_KEY = "gsb-cookie-consent";

type Gtag = (...args: unknown[]) => void;
const gtag: Gtag = (...args) => {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: Gtag };
  w.gtag?.(...args);
};

const GRANTED = { analytics_storage: "granted", ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" };
const DENIED = { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };

/**
 * Script inline que roda no <head>: define o consentimento padrão (negado),
 * aplica a escolha salva de visitas anteriores (para não perder o primeiro
 * page_view de quem já aceitou) e SÓ DEPOIS injeta o gtag.js. O gtag.js não
 * pode ir como <script async src> no head: o React 19 move scripts async para
 * o topo do <head>, antes do consentimento padrão.
 */
export function consentInitScript(id: string): string {
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',${JSON.stringify({ ...DENIED, wait_for_update: 500 })});
try{var c=localStorage.getItem(${JSON.stringify(CONSENT_KEY)});if(c&&c!=='denied'){gtag('consent','update',${JSON.stringify(GRANTED)});}}catch(e){}
gtag('js',new Date());
gtag('config',${JSON.stringify(id)},{send_page_view:false});
(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(${JSON.stringify(id)});document.head.appendChild(s);})();`;
}

/** Atualiza o consentimento quando o visitante clica no banner. */
export function updateConsent(accepted: boolean) {
  gtag("consent", "update", accepted ? GRANTED : DENIED);
}

const isPrivatePath = (path: string) => path === "/admin" || path.startsWith("/admin/");

/** page_view manual (o site é SPA: a troca de página não recarrega o gtag). */
export function trackPageView(path: string, title: string) {
  if (!GA_MEASUREMENT_ID || isPrivatePath(path)) return;
  gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: title,
  });
}

/** Evento customizado. Nunca enviar dados pessoais (nome, e-mail, telefone). */
export function trackEvent(name: string, params: Record<string, string | number | undefined> = {}) {
  if (!GA_MEASUREMENT_ID || isPrivatePath(window.location.pathname)) return;
  gtag("event", name, params);
}
