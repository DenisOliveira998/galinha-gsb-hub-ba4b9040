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
      <section className="relative overflow-hidden bg-primary-deep text-primary-foreground">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,var(--color-primary-glow),transparent_40%),radial-gradient(circle_at_80%_60%,var(--color-accent),transparent_45%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div>
            <span className="inline-flex rounded-full bg-primary-glow/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-primary-glow/40">
              Raça tradicional brasileira
            </span>
            <h1 className="mt-5 font-display text-4xl leading-tight md:text-6xl">
              Conheça a importância da raça <span className="text-accent-warm">GSB</span>
            </h1>
            <p className="mt-5 max-w-xl text-base opacity-85 md:text-lg">
              Ovos férteis, pintinhos, matrizes e reprodutores da linhagem Sertanejo Balão — criados com dedicação, procedência garantida e suporte ao criador.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-soft)] transition hover:brightness-105"
              >
                Ver catálogo
              </Link>
              <Link
                to="/sobre"
                className="rounded-full border border-primary-foreground/25 bg-primary-foreground/5 px-6 py-3 text-sm font-semibold transition hover:bg-primary-foreground/10"
              >
                Sobre a raça
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] ring-4 ring-primary-glow/30 shadow-[var(--shadow-card)]">
              <img src={settings.heroImage} alt="Galinha Sertanejo Balão" className="aspect-[4/5] w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-accent-warm px-5 py-4 text-accent-warm-foreground shadow-[var(--shadow-card)] md:block">
              <div className="font-display text-2xl font-semibold">+10 anos</div>
              <div className="text-xs">de tradição no plantel</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 diferenciais */}
      <section className="mx-auto -mt-10 max-w-7xl px-4 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Procedência garantida", desc: "Linhagem pura, seleção rigorosa e histórico do plantel." },
            { icon: HeartHandshake, title: "Suporte ao criador", desc: "Orientação sobre manejo, nutrição e saúde das aves." },
            { icon: Truck, title: "Entrega segura", desc: "Embalagem apropriada para ovos e transporte cuidadoso de aves." },
          ].map((f) => (
            <div key={f.title} className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias em destaque */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Nosso catálogo</h2>
            <p className="mt-2 text-muted-foreground">Escolha a categoria e conheça as aves disponíveis.</p>
          </div>
          <Link to="/catalogo" className="hidden text-sm font-semibold text-primary hover:underline md:inline">Ver todos →</Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map((key, i) => {
            const bg = ["bg-primary text-primary-foreground", "bg-accent text-accent-foreground", "bg-accent-warm text-accent-warm-foreground", "bg-primary-deep text-primary-foreground"][i];
            return (
              <Link
                key={key}
                to="/catalogo"
                className={`group relative overflow-hidden rounded-3xl p-6 shadow-[var(--shadow-card)] ${bg}`}
              >
                <img src={CATEGORY_PLACEHOLDERS[key]} alt={CATEGORY_LABELS[key]} className="absolute inset-0 h-full w-full object-cover opacity-25 transition group-hover:scale-105" />
                <div className="relative">
                  <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Categoria</div>
                  <div className="mt-2 font-display text-2xl">{CATEGORY_LABELS[key]}</div>
                  <div className="mt-16 text-sm opacity-90">Explorar →</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Banner CTA */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="overflow-hidden rounded-[2.5rem] bg-[image:var(--gradient-hero)] p-10 text-primary-foreground shadow-[var(--shadow-card)] md:p-14">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl">Leve para casa uma peça da nossa tradição</h2>
              <p className="mt-3 max-w-xl opacity-85">
                Fale conosco pelo WhatsApp e receba orientação personalizada para escolher os melhores exemplares para o seu plantel.
              </p>
            </div>
            <Link to="/contato" className="justify-self-start rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-soft)] md:justify-self-end">
              Falar no WhatsApp
            </Link>
          </div>
        </div>
      </section>

      {/* Destaques do catálogo */}
      {destaques.length > 0 && (
        <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
          <h2 className="font-display text-3xl md:text-4xl">Últimos anúncios</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {destaques.map((p) => (
              <Link key={p.id} to="/catalogo/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">{CATEGORY_LABELS[p.category]}</div>
                  <h3 className="mt-2 font-display text-lg">{p.title}</h3>
                  {p.price && <div className="mt-2 font-semibold">R$ {p.price.toFixed(2)}</div>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Por que escolher a GSB */}
      <section className="mx-auto mt-24 max-w-7xl px-4 md:px-8">
        <h2 className="font-display text-3xl md:text-4xl">Por que escolher a Galinha GSB</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-5">
          {[
            { icon: Feather, label: "Linhagem tradicional" },
            { icon: Egg, label: "Alta taxa de eclosão" },
            { icon: Award, label: "Aves selecionadas" },
            { icon: Sprout, label: "Manejo natural" },
            { icon: HeartHandshake, label: "Atendimento próximo" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                <s.icon className="h-7 w-7" />
              </div>
              <div className="mt-3 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
