import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { whatsappHref } from "@/lib/mock-store";
import { useSettingsQuery, EMPTY_SETTINGS } from "@/lib/hooks/use-settings";
import { Instagram, Mail, MapPin, MessageCircle, Youtube } from "lucide-react";
import { CookieBanner } from "@/components/site/cookie-banner";

const linkCls = "opacity-90 hover:opacity-100 hover:underline underline-offset-4";

function FooterColuna({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent-warm">{titulo}</h4>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  );
}

export function SiteFooter() {
  const { data: settings } = useSettingsQuery();
  const s = settings ?? EMPTY_SETTINGS;
  return (
    <footer className="mt-24 bg-primary-deep text-primary-foreground">
      <CookieBanner />
      {/* Rodapé dividido nas mesmas três áreas da faixa do topo (BarraSecoes):
          institucional, blog e Guia, LGPD e legal — mais o contato. */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Galinha GSB" className="h-12 w-12 object-contain drop-shadow" />
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold">Galinha GSB</div>
              <div className="text-xs opacity-70">Sertanejo Balão</div>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-80">
            Portal Galinha GSB, especializado na Galinha Sertaneja Balão. Encontre notícias, conteúdos sobre criação e manejo, além de ovos férteis, pintinhos, galinhas e reprodutores GSB.
          </p>
        </div>
        <FooterColuna titulo="Institucional">
          <li><Link to="/" className={linkCls}>Início</Link></li>
          <li><Link to="/sobre" className={linkCls}>Sobre</Link></li>
          <li><Link to="/catalogo" className={linkCls}>Catálogo</Link></li>
          <li><Link to="/contato" className={linkCls}>Contato</Link></li>
        </FooterColuna>
        <FooterColuna titulo="Blog e Guia">
          <li><Link to="/blog" className={linkCls}>Todos os artigos</Link></li>
          <li><Link to="/guia" className={linkCls}>Guia da GSB</Link></li>
          <li><Link to="/guia/origem" className={linkCls}>Origem da raça</Link></li>
          <li><Link to="/guia/reproducao" className={linkCls}>Reprodução</Link></li>
          <li><Link to="/autor/leonardo-reis" className={linkCls}>Autor: Leonardo Reis</Link></li>
        </FooterColuna>
        <FooterColuna titulo="LGPD e legal">
          <li><Link to="/privacidade" className={linkCls}>Política de Privacidade (LGPD)</Link></li>
          <li><Link to="/termos" className={linkCls}>Termos de Uso</Link></li>
          <li><Link to="/cookies" className={linkCls}>Aviso de Cookies</Link></li>
          <li><Link to="/politica-editorial" className={linkCls}>Política Editorial</Link></li>
          <li><Link to="/publicidade" className={linkCls}>Anúncios e Google AdSense</Link></li>
          <li><Link to="/afiliados" className={linkCls}>Links afiliados</Link></li>
        </FooterColuna>
        <FooterColuna titulo="Contato">
          <li><a href={whatsappHref(s)} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 ${linkCls}`}><MessageCircle className="h-4 w-4" /> {s.whatsapp}</a></li>
          {s.instagram && <li><a href={`https://instagram.com/${s.instagram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 ${linkCls}`}><Instagram className="h-4 w-4" /> {s.instagram}</a></li>}
          {s.youtube && <li><a href={s.youtube} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 ${linkCls}`}><Youtube className="h-4 w-4" /> YouTube</a></li>}
          {s.address && <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /><span>{s.address}</span></li>}
          {s.email && <li><a href={`mailto:${s.email}`} className={`flex items-center gap-2 break-all ${linkCls}`}><Mail className="h-4 w-4 shrink-0" /> {s.email}</a></li>}
        </FooterColuna>
      </div>
      <div className="border-t border-primary-foreground/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-[11px] leading-relaxed opacity-60 md:px-8">
          Este site pode conter links de afiliados, podendo gerar comissão em caso de compra.
          Fornecedores terceirizados, incluindo o Google, utilizam cookies para veicular anúncios
          com base em visitas anteriores do usuário a este e/ou a outros sites.
        </p>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs opacity-70 md:px-8">
          <span>© {new Date().getFullYear()} Galinha GSB — Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}