import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { useStore } from "@/lib/mock-store";

export const Route = createFileRoute("/blog/")({
  component: Blog,
});

function Blog() {
  const posts = useStore((s) => s.blog).filter((p) => p.published);
  return (
    <SiteLayout>
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <h1 className="font-display text-3xl md:text-4xl">Blog</h1>
          <p className="mt-2 max-w-2xl text-sm opacity-85 md:text-base">Dicas de manejo, novidades do plantel e conteúdo sobre a raça Sertanejo Balão.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_240px]">
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((p) => (
              <Link
                key={p.id}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group flex flex-col overflow-hidden rounded-3xl bg-card text-left shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-5 text-left">
                  <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("pt-BR")}</div>
                  <h2 className="mt-2 line-clamp-2 font-display text-xl">{p.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                  <div className="mt-auto pt-4 text-sm font-semibold text-primary">Ler mais →</div>
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