import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { StarsDisplay } from "@/components/site/star-rating";
import { AdSlot } from "@/components/site/ad-slot";
import { BlogLikeButton } from "@/components/site/blog-like-button";
import { useHydrated } from "@/hooks/use-hydrated";
import { ShieldCheck, HeartHandshake, Truck, Feather, Egg, Award, Sprout, UserCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { listPosts } from "@/lib/posts";
import { listBlogPosts } from "@/lib/blog";
import { listHeroSlides } from "@/lib/hero-slides";
import { listCategories } from "@/lib/categories";
import { useSettingsQuery } from "@/lib/hooks/use-settings";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [postsRes, blogRes, heroSlidesRes, categoriesRes] = await Promise.allSettled([
      listPosts(),
      listBlogPosts(),
      listHeroSlides(),
      listCategories(),
    ]);
    return {
      posts: postsRes.status === "fulfilled" ? postsRes.value : [],
      blog: blogRes.status === "fulfilled" ? blogRes.value : [],
      heroSlides: heroSlidesRes.status === "fulfilled" ? heroSlidesRes.value : [],
      categories: categoriesRes.status === "fulfilled" ? categoriesRes.value : [],
    };
  },
  component: Home,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function getCategoryLabel(categories: Array<{ id: string; label: string }>, id: string) {
  return categories.find((c) => c.id === id)?.label ?? id;
}

type Post = { id: string; slug: string; title: string; images: string[]; price?: number | null; category: string; status: string };
type BlogPost = { id: string; slug: string; title: string; coverImage: string; createdAt: string; likeCount: number; author?: { name: string; avatar: string | null } | null };

function AnuncioCard({ p, categories, slider }: { p: Post; categories: Array<{ id: string; label: string }>; slider?: boolean }) {
  const cls = slider ? "relative w-36 shrink-0 snap-start md:w-44" : "relative";
  return (
    <div className={cls}>
      <Link
        to="/catalogo/$slug"
        params={{ slug: p.slug }}
        className="group flex h-full w-full flex-col overflow-hidden rounded-xl bg-card shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]"
      >
        <div className="aspect-square overflow-hidden">
          <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
        </div>
        <div className="flex flex-col p-2 text-left">
          <div className="line-clamp-1 text-[9px] font-semibold uppercase tracking-wider text-primary">{getCategoryLabel(categories, p.category)}</div>
          <h3 className="mt-0.5 line-clamp-2 font-display text-xs leading-snug">{p.title}</h3>
          {p.price && <div className="mt-1 text-xs font-semibold text-foreground">R$ {p.price.toFixed(2)}</div>}
        </div>
      </Link>
    </div>
  );
}

function BlogCard({ p, hydrated, slider }: { p: BlogPost; hydrated: boolean; slider?: boolean }) {
  const cls = slider ? "group flex w-36 shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-card shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)] md:w-44" : "group flex flex-col overflow-hidden rounded-xl bg-card shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]";
  return (
    <Link to="/blog/$slug" params={{ slug: p.slug }} className={cls}>
      <div className="aspect-square overflow-hidden">
        <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-2 text-left">
        <div className="text-[10px] text-muted-foreground">{hydrated ? formatDate(p.createdAt) : ""}</div>
        <h3 className="mt-0.5 line-clamp-2 font-display text-xs leading-snug">{p.title}</h3>
        <div className="mt-auto flex items-center justify-between pt-1.5">
          {p.author ? (
            <div className="flex min-w-0 items-center gap-1">
              {p.author.avatar ? (
                <img src={p.author.avatar} alt={p.author.name} className="h-3.5 w-3.5 shrink-0 rounded-full object-cover" />
              ) : (
                <UserCircle2 className="h-3 w-3 shrink-0 text-muted-foreground" />
              )}
              <span className="truncate text-[10px] text-muted-foreground">{p.author.name}</span>
            </div>
          ) : (
            <span className="text-[10px] font-semibold text-primary">Ler →</span>
          )}
          <BlogLikeButton postId={p.id} initialCount={p.likeCount} />
        </div>
      </div>
    </Link>
  );
}

/** Slider horizontal com setas e arrastar com mouse */
function DragScroller({ children, scrollAmount = 320 }: { children: React.ReactNode; scrollAmount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);
  const moved = useRef(false);

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Seta esquerda */}
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="absolute -left-3 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border bg-card text-foreground shadow-[var(--shadow-card)] transition hover:bg-muted md:-left-5"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-0.5 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none"
        style={{ cursor: "grab" }}
        onMouseDown={(e) => {
          isDragging.current = true;
          moved.current = false;
          startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
          scrollLeft.current = ref.current?.scrollLeft ?? 0;
          if (ref.current) ref.current.style.cursor = "grabbing";
        }}
        onMouseMove={(e) => {
          if (!isDragging.current) return;
          e.preventDefault();
          moved.current = true;
          const x = e.pageX - (ref.current?.offsetLeft ?? 0);
          if (ref.current) ref.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2;
        }}
        onMouseUp={() => {
          isDragging.current = false;
          if (ref.current) ref.current.style.cursor = "grab";
        }}
        onMouseLeave={() => {
          isDragging.current = false;
          if (ref.current) ref.current.style.cursor = "grab";
        }}
        onClickCapture={(e) => {
          if (moved.current) {
            e.preventDefault();
            e.stopPropagation();
            moved.current = false;
          }
        }}
      >
        {children}
      </div>

      {/* Seta direita */}
      <button
        type="button"
        onClick={() => scroll(1)}
        className="absolute -right-3 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border bg-card text-foreground shadow-[var(--shadow-card)] transition hover:bg-muted md:-right-5"
        aria-label="Próximo"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Home() {
  const { posts, blog, heroSlides, categories } = Route.useLoaderData();
  const hydrated = useHydrated();
  const { data: settings } = useSettingsQuery();
  const destaques = posts.filter((p) => p.status === "PUBLISHED").slice(0, 8);
  const ultimosPosts = blog.filter((p) => p.published).slice(0, 8);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-green text-brand-green-foreground">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 [background-image:radial-gradient(circle_at_20%_20%,var(--color-primary-glow),transparent_40%),radial-gradient(circle_at_80%_60%,var(--color-accent),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background/80" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-5 px-4 pb-16 pt-7 md:grid-cols-2 md:gap-8 md:px-8 md:pb-20 md:pt-10">
          <div>
            <span className="inline-flex rounded-full bg-primary-glow/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-primary-glow/40 md:text-xs">
              Raça tradicional brasileira
            </span>
            <h1 className="mt-3 font-display text-2xl leading-tight md:mt-4 md:text-4xl">
              Conheça a importância da raça <span className="text-accent-warm">GSB</span>
            </h1>
            <p className="mt-2.5 max-w-xl text-sm opacity-85 md:mt-3 md:text-base">
              Ovos férteis, galinhas e reprodutores da linhagem Sertanejo Balão — criados com dedicação, procedência garantida e suporte ao criador.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 md:mt-6 md:gap-3">
              <Link
                to="/catalogo"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-soft)] transition hover:brightness-105 md:px-6"
              >
                Ver catálogo
              </Link>
              <Link
                to="/sobre"
                className="rounded-full border border-primary-foreground/25 bg-primary-foreground/5 px-5 py-2.5 text-sm font-semibold transition hover:bg-primary-foreground/10 md:px-6"
              >
                Sobre a raça
              </Link>
            </div>
          </div>
          <div className="relative pb-6 md:pb-0">
            <HeroCarousel slides={heroSlides} />
            {(settings?.badgeImage ?? "/badge.png") && (
              <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 w-32 md:w-40 aspect-video overflow-hidden rounded-2xl bg-accent-warm shadow-[var(--shadow-card)]">
                <img src={settings?.badgeImage ?? "/badge.png"} alt="Distintivo do plantel" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full text-background md:h-14"
        >
          <path fill="currentColor" d="M0,50 C240,95 480,10 720,38 C960,66 1200,96 1440,52 L1440,90 L0,90 Z" />
        </svg>
      </section>

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
          {categories.map((c, i) => {
            const bg = ["bg-primary text-primary-foreground", "bg-accent text-accent-foreground", "bg-accent-warm text-accent-warm-foreground", "bg-primary-deep text-primary-foreground"][i % 4];
            const coverUrl = c.images[0]?.url ?? c.image ?? "";
            return (
              <Link
                key={c.id}
                to="/catalogo"
                search={{ cat: c.id }}
                className={`group relative h-[120px] w-[60%] shrink-0 snap-start overflow-hidden rounded-2xl p-3.5 text-left shadow-[var(--shadow-card)] md:h-[150px] md:w-auto md:rounded-3xl md:p-5 ${bg}`}
              >
                {coverUrl && (
                  <img src={coverUrl} alt={c.label} className="absolute inset-0 h-full w-full object-cover opacity-25 transition group-hover:scale-105" />
                )}
                <div className="relative flex h-full flex-col">
                  <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Categoria</div>
                  <div className="mt-1 line-clamp-2 font-display text-base md:text-xl">{c.label}</div>
                  <div className="mt-auto text-xs opacity-90">Explorar →</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Espaço publicitário */}
      <section className="mx-auto mt-8 max-w-7xl px-3 md:mt-12 md:px-8">
        <AdSlot
          slot="homeBanner"
          label="Espaço publicitário — formato banner"
          placeholder={
            <div className="flex min-h-[80px] items-center justify-center rounded-2xl border-2 border-dashed border-accent/50 bg-accent/5 px-4 py-5 text-center md:min-h-[110px] md:rounded-3xl">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-accent">Espaço publicitário · Banner horizontal</div>
                <p className="mt-1 text-xs text-muted-foreground">Formato retangular largo disponível para parceiros.</p>
              </div>
            </div>
          }
        />
      </section>

      {/* Últimos anúncios */}
      {destaques.length > 0 && (
        <section className="mx-auto mt-8 max-w-7xl px-6 md:mt-12 md:px-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-xl md:text-2xl">Últimos anúncios</h2>
            <Link to="/catalogo" className="text-sm font-semibold text-primary hover:underline">Ver todos →</Link>
          </div>
          <div className="mt-4 md:mt-5">
            {destaques.length > 4 ? (
              <DragScroller>
                {destaques.map((p) => <AnuncioCard key={p.id} p={p} categories={categories} slider />)}
              </DragScroller>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                {destaques.map((p) => <AnuncioCard key={p.id} p={p} categories={categories} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Blog */}
      {ultimosPosts.length > 0 && (
        <section className="mx-auto mt-8 max-w-7xl px-6 md:mt-12 md:px-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-xl md:text-2xl">Do nosso blog</h2>
              <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">Dicas de manejo e novidades do plantel.</p>
            </div>
            <Link to="/blog" className="text-sm font-semibold text-primary hover:underline">Ver todos →</Link>
          </div>
          <div className="mt-4 md:mt-5">
            {ultimosPosts.length > 4 ? (
              <DragScroller>
                {ultimosPosts.map((p) => <BlogCard key={p.id} p={p} hydrated={hydrated} slider />)}
              </DragScroller>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                {ultimosPosts.map((p) => <BlogCard key={p.id} p={p} hydrated={hydrated} />)}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mx-auto mt-8 max-w-7xl px-3 md:mt-12 md:px-8">
        <AdSlot
          slot="homeRectangle"
          label="Espaço publicitário"
          placeholder={
            <div className="grid min-h-[100px] place-items-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-6 text-center md:min-h-[140px] md:rounded-3xl">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">Espaço publicitário</div>
                <p className="mt-1.5 text-xs text-muted-foreground md:text-sm">Anuncie aqui — fale conosco para reservar este espaço.</p>
              </div>
            </div>
          }
        />
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
