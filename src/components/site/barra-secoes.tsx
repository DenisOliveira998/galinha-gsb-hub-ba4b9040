import { Link, useRouterState } from "@tanstack/react-router";

// Faixa fina acima do cabeçalho que divide o site em três áreas: quem somos
// (institucional), conteúdo (blog e Guia) e políticas (LGPD e legal). Deixa
// claro para o visitante — e para o revisor do AdSense — onde está cada coisa.
// A aba da área atual fica em destaque.

const LEGAL = ["/privacidade", "/termos", "/cookies", "/politica-editorial", "/publicidade", "/afiliados"];
const CONTEUDO = ["/blog", "/guia", "/autor"];

type Secao = "institucional" | "conteudo" | "legal";

export function secaoDoCaminho(pathname: string): Secao {
  const comeca = (lista: string[]) => lista.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (comeca(LEGAL)) return "legal";
  if (comeca(CONTEUDO)) return "conteudo";
  return "institucional";
}

const ABAS: { id: Secao; to: string; curto: string; longo: string }[] = [
  { id: "institucional", to: "/", curto: "Institucional", longo: "Institucional" },
  { id: "conteudo", to: "/blog", curto: "Blog e Guia", longo: "Blog e Guia" },
  { id: "legal", to: "/privacidade", curto: "LGPD", longo: "LGPD e Privacidade" },
];

export function BarraSecoes() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const atual = secaoDoCaminho(pathname);
  return (
    <div className="bg-[color-mix(in_oklab,var(--brand-green)_78%,black)] text-brand-green-foreground">
      <nav aria-label="Áreas do site" className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-1.5 md:px-8">
        {ABAS.map((a) => {
          const ativa = a.id === atual;
          return (
            <Link
              key={a.id}
              to={a.to as "/"}
              aria-current={ativa ? "true" : undefined}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-warm ${
                ativa ? "bg-accent text-accent-foreground" : "opacity-75 hover:bg-brand-green-foreground/10 hover:opacity-100"
              }`}
            >
              <span className="sm:hidden">{a.curto}</span>
              <span className="hidden sm:inline">{a.longo}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
