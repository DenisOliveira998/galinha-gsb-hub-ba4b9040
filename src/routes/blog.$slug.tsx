import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { useStore, formatDate } from "@/lib/mock-store";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Post não encontrado</h1>
        <Link to="/blog" className="mt-6 inline-block text-primary hover:underline">← Voltar ao blog</Link>
      </div>
    </SiteLayout>
  ),
});

function BlogDetail() {
  const { slug } = Route.useParams();
  const post = useStore((s) => s.blog.find((p) => p.slug === slug));
  if (!post) throw notFound();
  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-12 md:px-8">
        <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">← Voltar ao blog</Link>
        <div className="mt-6 overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
          <img src={post.coverImage} alt={post.title} className="aspect-[16/9] w-full object-cover" />
        </div>
        <div className="mt-8 text-xs text-muted-foreground">{formatDate(post.createdAt)}</div>
        <h1 className="mt-2 font-display text-4xl">{post.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        <div className="prose prose-lg mt-8 whitespace-pre-line text-foreground/90">{post.content}</div>
      </article>
    </SiteLayout>
  );
}