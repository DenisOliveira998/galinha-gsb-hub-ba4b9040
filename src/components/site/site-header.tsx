import { Link } from "@tanstack/react-router";
import { Egg } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-primary-deep text-primary-foreground shadow-[var(--shadow-soft)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-glow/20 ring-1 ring-primary-glow/40">
            <Egg className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">Galinha GSB</div>
            <div className="text-xs opacity-70">Sertanejo Balão</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/" className="opacity-80 hover:opacity-100" activeOptions={{ exact: true }} activeProps={{ className: "opacity-100 font-semibold" }}>Início</Link>
          <Link to="/catalogo" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Catálogo</Link>
          <Link to="/sobre" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Sobre</Link>
          <Link to="/blog" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Blog</Link>
          <Link to="/contato" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Contato</Link>
        </nav>
        <Link
          to="/contato"
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-soft)] transition hover:brightness-105"
        >
          Fale conosco
        </Link>
      </div>
    </header>
  );
}