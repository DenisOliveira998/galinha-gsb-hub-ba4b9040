import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { CONSENT_KEY as KEY, updateConsent } from "@/lib/analytics";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* armazenamento indisponível */
    }
  }, []);

  if (!show) return null;

  // Aceitar → data ISO (compatível com o valor antigo); Recusar → "denied".
  // A escolha atualiza o Consent Mode do Google (Analytics e AdSense) na hora.
  const choose = (accepted: boolean) => {
    try {
      localStorage.setItem(KEY, accepted ? new Date().toISOString() : "denied");
    } catch {
      /* ignora */
    }
    updateConsent(accepted);
    setShow(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] ring-1 ring-border">
      <div className="flex flex-wrap items-center gap-3 text-left">
        <Cookie className="h-5 w-5 shrink-0 text-primary" />
        <p className="min-w-[14rem] flex-1 text-xs text-muted-foreground md:text-sm">
          Usamos cookies para melhorar sua experiência, lembrar preferências e medir a audiência
          (Google Analytics) e exibir anúncios (inclusive do Google AdSense). Saiba mais em{" "}
          <Link to="/cookies" className="font-semibold text-primary hover:underline">Aviso de Cookies</Link> e{" "}
          <Link to="/privacidade" className="font-semibold text-primary hover:underline">Política de Privacidade</Link>.
        </p>
        <div className="flex gap-2">
          <Link to="/cookies" className="rounded-full border px-4 py-2 text-xs font-semibold hover:bg-muted">Saiba mais</Link>
          <button type="button" onClick={() => choose(false)} className="rounded-full border px-4 py-2 text-xs font-semibold hover:bg-muted">
            Recusar
          </button>
          <button type="button" onClick={() => choose(true)} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
