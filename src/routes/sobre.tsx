import { createFileRoute } from "@tanstack/react-router";
import { SobrePage } from "@/components/sobre/SobrePage";
import { SOBRE_REVIEW, sobreContent } from "@/content/sobre";
import { buildSobreJsonLd, buildSobreMeta } from "@/content/sobre/seo";

/**
 * Rota /sobre — substitui a página "Sobre" atual mantendo a mesma URL
 * (não quebra links internos, sitemap nem o canonical já indexado).
 */
export const Route = createFileRoute("/sobre")({
  head: () => {
    const jsonLd = buildSobreJsonLd(sobreContent);
    return {
      // canonical e og:url vêm do __root.tsx (iguais para todas as páginas);
      // repetir aqui gerava dois canonical no HTML.
      meta: buildSobreMeta(sobreContent),
      scripts: jsonLd ? [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }] : [],
    };
  },
  component: SobreRoute,
});

function SobreRoute() {
  return <SobrePage content={sobreContent} review={SOBRE_REVIEW} />;
}
