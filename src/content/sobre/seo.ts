import { isPending } from "./index";
import { SITE_URL } from "./shared";
import type { SobreContent } from "./types";

/**
 * Dados estruturados da página. Regras:
 * - conteúdo de demonstração → nenhum JSON-LD (persona fictícia não entra em dados estruturados);
 * - só entram campos confirmados: nada pendente, nenhuma foto não verificada.
 */
export function buildSobreJsonLd(content: SobreContent): Record<string, unknown> | null {
  if (content.mode === "demo" || content.responsible.isFictional) return null;

  const { responsible, organization, seo } = content;
  const person: Record<string, unknown> = {
    "@type": "Person",
    name: responsible.name,
    jobTitle: responsible.role,
  };
  if (responsible.profileUrl) person.url = responsible.profileUrl;
  if (responsible.photo.verified && responsible.photo.src) person.image = responsible.photo.src;

  const org: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: organization.name,
    url: organization.url,
    logo: organization.logo,
    founder: person,
  };
  const sameAs = organization.sameAs.filter((url) => !isPending(url));
  if (sameAs.length > 0) org.sameAs = sameAs;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${seo.canonical}#webpage`,
        url: seo.canonical,
        name: seo.title,
        description: seo.description,
        inLanguage: "pt-BR",
        about: { "@id": `${SITE_URL}/#organization` },
        breadcrumb: { "@id": `${seo.canonical}#breadcrumb` },
      },
      org,
      {
        "@type": "BreadcrumbList",
        "@id": `${seo.canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Institucional", item: seo.canonical },
        ],
      },
    ],
  };
}

/** Meta tags no formato de `head()` do TanStack Router/Start. */
export function buildSobreMeta(content: SobreContent) {
  const { seo } = content;
  return [
    { title: seo.title },
    { name: "description", content: seo.description },
    { name: "robots", content: seo.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large" },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "pt_BR" },
    { property: "og:site_name", content: content.organization.name },
    { property: "og:title", content: seo.title },
    { property: "og:description", content: seo.description },
    { property: "og:image", content: seo.ogImage },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: seo.title },
    { name: "twitter:description", content: seo.description },
    { name: "twitter:image", content: seo.ogImage },
  ];
}
