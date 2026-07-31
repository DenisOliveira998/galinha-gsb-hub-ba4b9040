import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { useStore, formatDate } from "@/lib/mock-store";

export const Route = createFileRoute("/blog/")({
  component: Blog,
});

function Blog() {
  const posts = useStore((s) => s.blog).filter((p) => p.published);
  return (
    <SiteLayout>
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-6 text-left md:px-8 md:py-9">
          <h1 className="font-display text-2xl md:text-3xl">Blog</h1>
          <p className="mt-1.5 max-w-2xl text-xs opacity-85 md:text-sm">Dicas de manejo, novidades do plantel e conteúdo sobre a raça Sertanejo Balão.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-3 py-6 md:px-8 md:py-9">
        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
            {posts.map((p) => (
              <Link
                key={p.id}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group flex h-full flex-col items-start overflow-hidden rounded-2xl bg-card text-left shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)] md:rounded-3xl"
              >
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="flex w-full flex-1 flex-col items-start p-3.5 text-left md:p-4">
                  <div className="text-[10px] text-muted-foreground md:text-xs">{formatDate(p.createdAt)}</div>
                  <h2 className="mt-1 line-clamp-2 text-left font-display text-sm md:text-base">{p.title}</h2>
                  <p className="mt-1 line-clamp-3 text-left text-xs text-muted-foreground md:text-sm">{p.excerpt}</p>
                  <div className="mt-auto pt-3 text-xs font-semibold text-primary md:text-sm">Ler mais →</div>
                </div>
              </Link>
            ))}
          </div>
          <aside className="hidden lg:block">
            <div
              role="complementary"
              aria-label="Espaço publicitário — formato vertical"
              className="sticky top-24 flex min-h-[600px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center"
            >
              <div className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
                Espaço publicitário
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Formato vertical (skyscraper) disponível para parceiros.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}