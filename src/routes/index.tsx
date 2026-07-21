import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { useStore, CATEGORY_LABELS, CATEGORY_PLACEHOLDERS } from "@/lib/mock-store";
import { ShieldCheck, HeartHandshake, Truck, Feather, Egg, Award, Sprout } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { posts, settings } = useStore();
  const destaques = posts.filter((p) => p.status === "PUBLISHED").slice(0, 3);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative bg-primary-deep text-primary-foreground">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 [background-image:radial-gradient(circle_at_20%_20%,var(--color-primary-glow),transparent_40%),radial-gradient(circle_at_80%_60%,var(--color-accent),transparent_45%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pt-10 pb-16 md:grid-cols-2 md:gap-10 md:px-8 md:pt-24 md:pb-32">
          <div>
            <span className="inline-flex rounded-full bg-primary-glow/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-primary-glow/40 md:text-xs">
              Raça tradicional brasileira
            </span>
            <h1 className="mt-3 font-display text-3xl leading-tight md:mt-5 md:text-6xl">
              Conheça a importância da raça <span className="text-accent-warm">GSB</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm opacity-85 md:mt-5 md:text-lg">
              Ovos férteis, pintinhos, matrizes e reprodutores da linhagem Sertanejo Balão — criados com dedicação, procedência garantida e suporte ao criador.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 md:mt-8 md:gap-3">
              <Link
                to="/catalogo"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-soft)] transition hover:brightness-105 md:px-6 md:py-3"
              >
                Ver catálogo
              </Link>
              <Link
                to="/sobre"
                className="rounded-full border border-primary-foreground/25 bg-primary-foreground/5 px-5 py-2.5 text-sm font-semibold transition hover:bg-primary-foreground/10 md:px-6 md:py-3"
              >
                Sobre a raça
              </Link>
            </div>
          </div>
          <div className="relative pb-6 md:pb-0">
            <div className="overflow-hidden rounded-[2rem] ring-4 ring-primary-glow/30 shadow-[var(--shadow-card)]">
              <img src={settings.heroImage} alt="Galinha Sertanejo Balão" className="aspect-[4/3] w-full object-cover md:aspect-[4/5]" />
            </div>
            <div className="absolute -bottom-2 -left-2 rounded-2xl bg-accent-warm px-3 py-2 text-accent-warm-foreground shadow-[var(--shadow-card)] md:-bottom-6 md:-left-6 md:px-5 md:py-4">
              <div className="font-display text-lg font-semibold md:text-2xl">+10 anos</div>
              <div className="text-[10px] md:text-xs">de tradição no plantel</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 diferenciais */}
      <section className="relative mx-auto mt-8 max-w-7xl px-4 md:-mt-10 md:px-8">
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {[
            { icon: ShieldCheck, title: "Procedência garantida", desc: "Linhagem pura, seleção rigorosa e histórico do plantel." },
            { icon: HeartHandshake, title: "Suporte ao criador", desc: "Orientação sobre manejo, nutrição e saúde das aves." },
            { icon: Truck, title: "Entrega segura", desc: "Embalagem apropriada para ovos e transporte cuidadoso de aves." },
          ].map((f) => (
            <div key={f.title} className="rounded-3xl bg-card p-4 shadow-[var(--shadow-soft)] md:p-6">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary md:h-12 md:w-12">
                <f.icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <h3 className="mt-3 font-display text-base font-semibold md:mt-4 md:text-lg">{f.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias em destaque */}
      <section className="mx-auto mt-12 max-w-7xl px-4 md:mt-20 md:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl md:text-4xl">Nosso catálogo</h2>
            <p className="mt-1 text-sm text-muted-foreground md:mt-2 md:text-base">Escolha a categoria e conheça as aves disponíveis.</p>
          </div>
          <Link to="/catalogo" className="hidden text-sm font-semibold text-primary hover:underline md:inline">Ver todos →</Link>
        </div>
        <div className="mt-5 grid gap-3 grid-cols-2 md:mt-8 md:grid-cols-4 md:gap-4">
          {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map((key, i) => {
            const bg = ["bg-primary text-primary-foreground", "bg-accent text-accent-foreground", "bg-accent-warm text-accent-warm-foreground", "bg-primary-deep text-primary-foreground"][i];
            return (
              <Link
                key={key}
                to="/catalogo"
                className={`group relative overflow-hidden rounded-3xl p-4 shadow-[var(--shadow-card)] md:p-6 ${bg}`}
              >
                <img src={CATEGORY_PLACEHOLDERS[key]} alt={CATEGORY_LABELS[key]} className="absolute inset-0 h-full w-full object-cover opacity-25 transition group-hover:scale-105" />
                <div className="relative">
                  <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80 md:text-xs">Categoria</div>
                  <div className="mt-1 font-display text-lg md:mt-2 md:text-2xl">{CATEGORY_LABELS[key]}</div>
                  <div className="mt-8 text-xs opacity-90 md:mt-16 md:text-sm">Explorar →</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Espaço publicitário — formato horizontal (banner largo) */}
      <section className="mx-auto mt-12 max-w-7xl px-4 md:mt-20 md:px-8">
        <div
          role="complementary"
          aria-label="Espaço publicitário — formato banner"
          className="flex min-h-[100px] items-center justify-center rounded-3xl border-2 border-dashed border-accent/50 bg-accent/5 px-6 py-6 text-center md:min-h-[140px]"
        >
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-accent md:text-xs">
              Espaço publicitário · Banner horizontal
            </div>
            <p className="mt-1 text-xs text-muted-foreground md:mt-2 md:text-sm">
              Formato retangular largo disponível para parceiros.
            </p>
          </div>
        </div>
      </section>

      {/* Destaques do catálogo */}
      {destaques.length > 0 && (
        <section className="mx-auto mt-12 max-w-7xl px-4 md:mt-20 md:px-8">
          <h2 className="font-display text-2xl md:text-4xl">Últimos anúncios</h2>
          <div className="mt-5 grid gap-4 md:mt-8 md:grid-cols-3 md:gap-6">
            {destaques.map((p) => (
              <Link key={p.id} to="/catalogo/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="p-4 md:p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-primary md:text-xs">{CATEGORY_LABELS[p.category]}</div>
                  <h3 className="mt-1 font-display text-base md:mt-2 md:text-lg">{p.title}</h3>
                  {p.price && <div className="mt-1 text-sm font-semibold md:mt-2 md:text-base">R$ {p.price.toFixed(2)}</div>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Espaço publicitário — slot mockado, pronto para integração futura */}
      <section className="mx-auto mt-12 max-w-7xl px-4 md:mt-20 md:px-8">
        <div
          role="complementary"
          aria-label="Espaço publicitário"
          className="grid min-h-[140px] place-items-center rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-8 text-center md:min-h-[180px]"
        >
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-primary/70 md:text-xs">
              Espaço publicitário
            </div>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Anuncie aqui — fale conosco para reservar este espaço.
            </p>
          </div>
        </div>
      </section>

      {/* Por que escolher a GSB */}
      <section className="mx-auto mt-12 max-w-7xl px-4 md:mt-24 md:px-8">
        <h2 className="font-display text-2xl md:text-4xl">Por que escolher a Galinha GSB</h2>
        <div className="mt-6 grid grid-cols-2 gap-6 md:mt-10 md:grid-cols-5 md:gap-8">
          {[
            { icon: Feather, label: "Linhagem tradicional" },
            { icon: Egg, label: "Alta taxa de eclosão" },
            { icon: Award, label: "Aves selecionadas" },
            { icon: Sprout, label: "Manejo natural" },
            { icon: HeartHandshake, label: "Atendimento próximo" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary md:h-16 md:w-16">
                <s.icon className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <div className="mt-2 text-xs font-medium md:mt-3 md:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
