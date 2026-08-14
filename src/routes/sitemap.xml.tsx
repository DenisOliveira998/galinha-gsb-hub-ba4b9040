import { createFileRoute } from "@tanstack/react-router";
import { listPosts } from "@/lib/posts";
import { listBlogPosts } from "@/lib/blog";

const BASE = "https://galinhagsb.com.br";

export const Route = createFileRoute("/sitemap.xml")({
  loader: async () => {
    const [posts, blogs] = await Promise.allSettled([listPosts(), listBlogPosts()]);
    const postSlugs = posts.status === "fulfilled"
      ? posts.value.filter((p) => p.status === "PUBLISHED").map((p) => p.slug)
      : [];
    const blogSlugs = blogs.status === "fulfilled"
      ? blogs.value.filter((b) => b.published).map((b) => b.slug)
      : [];
    return { postSlugs, blogSlugs };
  },
  headers: () => ({ "content-type": "application/xml; charset=utf-8" }),
  component: Sitemap,
});

function Sitemap() {
  const { postSlugs, blogSlugs } = Route.useLoaderData();
  const staticRoutes = ["/", "/catalogo", "/blog", "/sobre", "/contato", "/favoritos"];
  const now = new Date().toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map((r) => `  <url><loc>${BASE}${r}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq></url>`).join("\n")}
${postSlugs.map((s) => `  <url><loc>${BASE}/catalogo/${s}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq></url>`).join("\n")}
${blogSlugs.map((s) => `  <url><loc>${BASE}/blog/${s}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq></url>`).join("\n")}
</urlset>`;

  return <div dangerouslySetInnerHTML={{ __html: xml }} />;
}
