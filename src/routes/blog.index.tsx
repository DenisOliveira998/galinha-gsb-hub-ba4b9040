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
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <h1 className="font-display text-4xl md:text-5xl">Blog</h1>
          <p className="mt-3 max-w-2xl opacity-85">Dicas de manejo, novidades do plantel e conteúdo sobre a raça Sertanejo Balão.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((p) => (
            <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("pt-BR")}</div>
                <h2 className="mt-2 font-display text-2xl">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <div className="mt-4 text-sm font-semibold text-primary">Ler mais →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}