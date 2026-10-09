import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { BrandTheme } from "@/components/site/brand-theme";
import { AdsenseScript } from "@/components/site/ad-slot";
import { THEME_INIT_SCRIPT } from "@/hooks/use-theme";
import { getSettings } from "@/lib/settings";
import { brandTokens, DEFAULT_BRAND_COLOR } from "@/lib/brand-color";
import { SITE_URL, absUrl } from "@/lib/seo";
import { GA_MEASUREMENT_ID, consentInitScript } from "@/lib/analytics";
import { AnalyticsTracker } from "@/components/site/analytics-tracker";

/** Gera o script inline que aplica tokens da cor da marca antes de qualquer pintura. */
function makeBrandScript(brandColor: string): string {
  const tokens = brandTokens(brandColor);
  return `(function(){var s=document.documentElement.style;${
    Object.entries(tokens)
      .map(([k, v]) => `s.setProperty(${JSON.stringify(k)},${JSON.stringify(v)})`)
      .join(";")
  }})()`;
}

const DEFAULT_DESCRIPTION = "Portal Galinha GSB, especializado na Galinha Sertaneja Balão. Encontre notícias, conteúdos sobre criação e manejo, além de ovos férteis, pintinhos, galinhas e reprodutores GSB.";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado do nosso lado. Tente recarregar ou volte ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async () => {
    const settings = await getSettings().catch(() => null);
    return {
      siteDescription: settings?.siteDescription || DEFAULT_DESCRIPTION,
      ogImage: settings?.ogImage || "/logo.png",
      brandColor: settings?.brandColor || DEFAULT_BRAND_COLOR,
      adsensePublisherId: settings?.adsensePublisherId?.trim() || "",
    };
  },
  head: ({ loaderData }) => {
    const desc = loaderData?.siteDescription || DEFAULT_DESCRIPTION;
    const ogImg = absUrl(loaderData?.ogImage || "/logo.png");
    const brandScript = makeBrandScript(loaderData?.brandColor || DEFAULT_BRAND_COLOR);
    const adsenseId = loaderData?.adsensePublisherId || "";
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Galinha GSB | Sertaneja Balão: Guia Completo da Raça" },
        { name: "description", content: desc },
        { name: "author", content: "Galinha GSB" },
        { property: "og:title", content: "Galinha GSB | Sertaneja Balão: Guia Completo da Raça" },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Galinha GSB" },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:image", content: ogImg },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Galinha GSB | Sertaneja Balão: Guia Completo da Raça" },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: ogImg },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.ico" },
        { rel: "icon", href: "/logo.png", type: "image/png", sizes: "any" },
        { rel: "apple-touch-icon", href: "/logo.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
      scripts: [
        // Google Analytics 4: carregado pelo script de consentimento no RootShell
        // (ver src/lib/analytics.ts), para rodar depois do consentimento padrão.
        ...(adsenseId
          ? [
              {
                src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseId)}`,
                async: true,
                crossOrigin: "anonymous" as const,
              },
            ]
          : []),
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // useRouterState é isomórfico e disponível no shellComponent.
  // No SSR o loader já rodou, então matches[0].loaderData já tem brandColor.
  const state = useRouterState();
  const loaderData = state.matches[0]?.loaderData as { brandColor?: string } | undefined;
  // Script da cor da marca ANTES de <HeadContent> (que contém o <link stylesheet>)
  // → garante que os tokens CSS são aplicados antes do CSS padrão pintar a tela.
  const brandScript = makeBrandScript(loaderData?.brandColor ?? DEFAULT_BRAND_COLOR);

  // Canonical + og:url sempre no domínio principal (.com.br), sem query string,
  // para o Google não tratar .com, .vercel.app ou ?filtros como páginas duplicadas.
  // Páginas de erro/404 não recebem canonical.
  const pathname = state.location.pathname.replace(/\/+$/, "") || "/";
  const canonical = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
  // URL inexistente só casa com a rota raiz (matches.length === 1).
  const isOk =
    state.matches.length > 1 &&
    !state.matches.some((m) => m.status === "notFound" || m.status === "error");

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: brandScript }} />
        {/* Consent Mode do Google: precisa rodar antes do gtag.js e do AdSense */}
        {GA_MEASUREMENT_ID && <script dangerouslySetInnerHTML={{ __html: consentInitScript(GA_MEASUREMENT_ID) }} />}
        <HeadContent />
        {isOk && <link rel="canonical" href={canonical} />}
        {isOk && <meta property="og:url" content={canonical} />}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <BrandTheme />
      <AdsenseScript />
      <AnalyticsTracker />
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
