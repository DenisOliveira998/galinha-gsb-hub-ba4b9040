import { Link } from "@tanstack/react-router";
import { useStore, whatsappHref } from "@/lib/mock-store";
import { Egg, Instagram, Mail, MessageCircle } from "lucide-react";

export function SiteFooter() {
  const s = useStore((x) => x.settings);
  return (
    <footer className="mt-24 bg-primary-deep text-primary-foreground">
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs opacity-70 md:px-8">
          <span>© {new Date().getFullYear()} Galinha GSB — Todos os direitos reservados.</span>
          <Link to="/admin/login" className="hover:opacity-100">Admin</Link>
        </div>
      </div>
    </footer>
  );
}