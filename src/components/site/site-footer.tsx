import { Link } from "@tanstack/react-router";
import { whatsappHref } from "@/lib/mock-store";
import { useSettingsQuery, EMPTY_SETTINGS } from "@/lib/hooks/use-settings";
import { Egg, Instagram, Mail, MessageCircle } from "lucide-react";
import { CookieBanner } from "@/components/site/cookie-banner";

export function SiteFooter() {
  const { data: settings } = useSettingsQuery();
  const s = settings ?? EMPTY_SETTINGS;
  return (
    <footer className="mt-24 bg-primary-deep text-primary-foreground">
      <CookieBanner />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-glow/20 ring-1 ring-primary-glow/40">
              <Egg className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold">Galinha GSB</div>
              <div className="text-xs opacity-70">Sertanejo Balão</div>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-80">
            Criadouro tradicional da raça Sertanejo Balão. Procedência garantida e suporte ao criador.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">Site</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link to="/" className="hover:opacity-100">Início</Link></li>
            <li><Link to="/catalogo" className="hover:opacity-100">Catálogo</Link></li>
            <li><Link to="/sobre" className="hover:opacity-100">Sobre</Link></li>
            <li><Link to="/blog" className="hover:opacity-100">Blog</Link></li>
            <li><Link to="/contato" className="hover:opacity-100">Contato</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">Categorias</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link to="/catalogo">Ovos férteis</Link></li>
            <li><Link to="/catalogo">Pintinhos</Link></li>
            <li><Link to="/catalogo">Reprodutores</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">Contato</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><a href={whatsappHref(s)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-100"><MessageCircle className="h-4 w-4" /> {s.whatsapp}</a></li>
            <li className="flex items-center gap-2"><Instagram className="h-4 w-4" /> {s.instagram}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> {s.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">Legal</h4>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs opacity-90 md:text-sm">
            <li><Link to="/termos" className="hover:opacity-100 hover:underline">Termos de Uso</Link></li>
            <li><Link to="/privacidade" className="hover:opacity-100 hover:underline">Política de Privacidade</Link></li>
            <li><Link to="/cookies" className="hover:opacity-100 hover:underline">Aviso de Cookies / LGPD</Link></li>
            <li><Link to="/afiliados" className="hover:opacity-100 hover:underline">Divulgação de links afiliados</Link></li>
            <li><Link to="/publicidade" className="hover:opacity-100 hover:underline">Anúncios e Google AdSense</Link></li>
          </ul>
          <p className="mt-3 max-w-3xl text-[11px] leading-relaxed opacity-60">
            Este site pode conter links de afiliados, podendo gerar comissão em caso de compra.
            Fornecedores terceirizados, incluindo o Google, utilizam cookies para veicular anúncios
            com base em visitas anteriores do usuário a este e/ou a outros sites.
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs opacity-70 md:px-8">
          <span>© {new Date().getFullYear()} Galinha GSB — Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}