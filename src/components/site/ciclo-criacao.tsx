import { Link } from "@tanstack/react-router";

// "Do ovo à galinha adulta": as 5 fases da criação, cada uma ligada ao
// capítulo do Guia da GSB. É uma sequência real, por isso é numerada.
// Os números vêm do Guia publicado (reprodução, pintinhos, manejo, seleção e sanidade).

const CICLO = [
  {
    to: "/guia/reproducao",
    title: "Incubação",
    fact: "37,5 a 37,8 °C na chocadeira",
    text: "Ovos guardados de 3 a 7 dias antes de incubar, ovoscopia e cuidados até o nascimento.",
  },
  {
    to: "/guia/pintinhos",
    title: "Pintinhos",
    fact: "32 a 35 °C na 1ª semana",
    text: "A temperatura cai semana a semana. O comportamento dos pintinhos é o melhor termômetro.",
  },
  {
    to: "/guia/alimentacao",
    title: "Recria e manejo",
    fact: "Até 100 a 120 g de ração por dia",
    text: "Poleiros baixos, ninhos largos e espaço à altura de uma ave que passa dos 6 kg.",
  },
  {
    to: "/guia/selecao",
    title: "Seleção",
    fact: "Três rodadas de avaliação",
    text: "Entre 6 e 8 semanas, entre 12 e 16 semanas e na maturidade, antes de escolher os reprodutores.",
  },
  {
    to: "/guia/sanidade",
    title: "Sanidade",
    fact: "Quarentena mínima de 14 dias",
    text: "Observação diária, vacinação com orientação veterinária e cuidado com aves que chegam.",
  },
];

export function CicloCriacao({ className = "" }: { className?: string }) {
  return (
    <section aria-labelledby="ciclo-titulo" className={className}>
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Guia da GSB</p>
        <h2 id="ciclo-titulo" className="mt-2 font-display text-3xl leading-tight md:text-4xl">
          Do ovo à galinha adulta
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O que muda em cada fase da criação. Cada etapa abre o capítulo do Guia da GSB sobre o assunto.
        </p>
      </div>
      <ol className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
        {CICLO.map((etapa, i) => (
          <li key={etapa.to} className="relative border-t-2 border-primary/25 pt-5">
            <span
              aria-hidden="true"
              className="absolute -top-[13px] left-0 grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            >
              {i + 1}
            </span>
            <h3 className="font-display text-lg md:text-xl">
              <Link to={etapa.to as "/"} className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {etapa.title}
              </Link>
            </h3>
            <p className="mt-2 inline-block rounded-md bg-accent-warm/35 px-2 py-0.5 text-sm font-semibold text-foreground">{etapa.fact}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{etapa.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
