import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { useStore, CATEGORY_LABELS, CATEGORY_PLACEHOLDERS, formatDate } from "@/lib/mock-store";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { ShieldCheck, HeartHandshake, Truck, Feather, Egg, Award, Sprout } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { posts, blog } = useStore();
  const destaques = posts.filter((p) => p.status === "PUBLISHED").slice(0, 3);
  const ultimosPosts = blog.filter((p) => p.published).slice(0, 3);

  return (
    <SiteLayout>
      <HeroCarousel />
      <h1 className="sr-only">Galinha GSB — Sertanejo Balão: ovos férteis, galinhas e reprodutores</h1>

      {/* 3 diferenciais */}
      <section className="relative mx-auto mt-5 max-w-7xl px-3 md:mt-6 md:px-8">
        <div className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0">
          {[
            { icon: ShieldCheck, title: "Procedência garantida", desc: "Linhagem pura, seleção rigorosa e histórico do plantel." },
            { icon: HeartHandshake, title: "Suporte ao criador", desc: "Orientação sobre manejo, nutrição e saúde das aves." },
            { icon: Truck, title: "Entrega segura", desc: "Embalagem apropriada para ovos e transporte cuidadoso de aves." },
          ].map((f) => (
            <div key={f.title} className="w-[72%] shrink-0 snap-start rounded-2xl bg-card p-3.5 text-left shadow-[var(--shadow-soft)] md:w-auto md:rounded-3xl md:p-5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary md:h-11 md:w-11 md:rounded-2xl">
                <f.icon className="h-4.5 w-4.5 md:h-5 md:w-5" />
              </div>
              <h3 className="mt-2.5 line-clamp-1 font-display text-sm font-semibold md:mt-3 md:text-base">{f.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground md:text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias em destaque */}
      <section className="mx-auto mt-8 max-w-7xl px-3 md:mt-12 md:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl md:text-2xl">Nosso catálogo</h2>
            <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">Escolha a categoria e conheça as aves disponíveis.</p>
          </div>
          <Link to="/catalogo" className="hidden text-sm font-semibold text-primary hover:underline md:inline">Ver todos →</Link>
        </div>
        <div className="-mx-3 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-5 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0">
          {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map((key, i) => {
            const bg = ["bg-primary text-primary-foreground", "bg-accent text-accent-foreground", "bg-accent-warm text-accent-warm-foreground", "bg-primary-deep text-primary-foreground"][i];
            return (
              <Link
                key={key}
                to="/catalogo"
                className={`group relative h-[120px] w-[60%] shrink-0 snap-start overflow-hidden rounded-2xl p-3.5 text-left shadow-[var(--shadow-card)] md:h-[150px] md:w-auto md:rounded-3xl md:p-5 ${bg}`}
              >
                <img src={CATEGORY_PLACEHOLDERS[key]} alt={CATEGORY_LABELS[key]} className="absolute inset-0 h-full w-full object-cover opacity-25 transition group-hover:scale-105" />
                <div className="relative flex h-full flex-col">
                  <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Categoria</div>
                  <div className="mt-1 line-clamp-2 font-display text-base md:text-xl">{CATEGORY_LABELS[key]}</div>
                  <div className="mt-auto text-xs opacity-90">Explorar →</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Espaço publicitário — formato horizontal (banner largo) */}
      <section className="mx-auto mt-8 max-w-7xl px-3 md:mt-12 md:px-8">
        <div
          role="complementary"
          aria-label="Espaço publicitário — formato banner"
          className="flex min-h-[80px] items-center justify-center rounded-2xl border-2 border-dashed border-accent/50 bg-accent/5 px-4 py-5 text-center md:min-h-[110px] md:rounded-3xl"
        >
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-accent">
              Espaço publicitário · Banner horizontal
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Formato retangular largo disponível para parceiros.
            </p>
          </div>
        </div>
      </section>

      {/* Destaques do catálogo */}
      {destaques.length > 0 && (
        <section className="mx-auto mt-8 max-w-7xl px-3 md:mt-12 md:px-8">
          <h2 className="font-display text-xl md:text-2xl">Últimos anúncios</h2>
          <div className="-mx-3 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 md:mt-5 md:grid-cols-3 md:gap-4">
            {destaques.map((p) => (
              <Link key={p.id} to="/catalogo/$slug" params={{ slug: p.slug }} className="group flex h-full w-[68%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-card text-left shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)] sm:w-auto md:rounded-3xl">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-3.5 text-left md:p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{CATEGORY_LABELS[p.category]}</div>
                  <h3 className="mt-1 line-clamp-2 font-display text-sm md:text-base">{p.title}</h3>
                  {p.price && <div className="mt-auto pt-2 text-sm font-semibold">R$ {p.price.toFixed(2)}</div>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Espaço publicitário — slot mockado, pronto para integração futura */}
      {ultimosPosts.length > 0 && (
        <section className="mx-auto mt-8 max-w-7xl px-3 md:mt-12 md:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-xl md:text-2xl">Do nosso blog</h2>
              <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">Dicas de manejo e novidades do plantel.</p>
            </div>
            <Link to="/blog" className="hidden text-sm font-semibold text-primary hover:underline md:inline">Ver todos →</Link>
          </div>
          <div className="-mx-3 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 md:mt-5 md:grid-cols-3 md:gap-4">
            {ultimosPosts.map((p) => (
              <Link
                key={p.id}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group flex h-full w-[68%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-card text-left shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)] sm:w-auto md:rounded-3xl"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-3.5 text-left md:p-4">
                  <div className="text-[10px] text-muted-foreground">{formatDate(p.createdAt)}</div>
                  <h3 className="mt-1 line-clamp-2 font-display text-sm md:text-base">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground md:text-sm">{p.excerpt}</p>
                  <div className="mt-auto pt-3 text-xs font-semibold text-primary md:text-sm">Ler mais →</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-8 max-w-7xl px-3 md:mt-12 md:px-8">
        <div
          role="complementary"
          aria-label="Espaço publicitário"
          className="grid min-h-[100px] place-items-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-6 text-center md:min-h-[140px] md:rounded-3xl"
        >
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
              Espaço publicitário
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground md:text-sm">
              Anuncie aqui — fale conosco para reservar este espaço.
            </p>
          </div>
        </div>
      </section>

      {/* Por que escolher a GSB */}
      <section className="mx-auto mt-8 max-w-7xl px-3 pb-10 md:mt-12 md:px-8 md:pb-14">
        <h2 className="font-display text-xl md:text-2xl">Por que escolher a Galinha GSB</h2>
        <div className="mt-4 grid grid-cols-3 gap-4 md:mt-6 md:grid-cols-5 md:gap-5">
          {[
            { icon: Feather, label: "Linhagem tradicional" },
            { icon: Egg, label: "Alta taxa de eclosão" },
            { icon: Award, label: "Aves selecionadas" },
            { icon: Sprout, label: "Manejo natural" },
            { icon: HeartHandshake, label: "Atendimento próximo" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary md:h-14 md:w-14 md:rounded-2xl">
                <s.icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="mt-2 text-[11px] font-medium md:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
