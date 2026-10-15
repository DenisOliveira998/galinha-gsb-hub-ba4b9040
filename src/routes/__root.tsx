import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { AdsenseScript } from "@/components/site/ad-slot";
import { THEME_INIT_SCRIPT } from "@/hooks/use-theme";
import { getSettings } from "@/lib/settings";
import { SETTINGS_QUERY_KEY } from "@/lib/hooks/use-settings";
import { DEFAULT_BRAND_COLOR } from "@/lib/brand-color";
import { SITE_URL, absUrl } from "@/lib/seo";
import { GA_MEASUREMENT_ID, consentInitScript } from "@/lib/analytics";
import { AnalyticsTracker } from "@/components/site/analytics-tracker";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero, btn } from "@/components/site/page-kit";

const DEFAULT_DESCRIPTION = "Portal Galinha GSB, especializado na Galinha Sertaneja Balão. Encontre notícias, conteúdos sobre criação e manejo, além de ovos férteis, pintinhos, galinhas e reprodutores GSB.";

function NotFoundComponent() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Erro 404"
        title="Página não encontrada"
        intro="O endereço pode ter mudado ou a página foi removida. Use os atalhos abaixo para continuar."
      >
        <Link to="/" className={`${btn.accent} focus-visible:ring-accent-warm`}>
          Voltar ao início
        </Link>
        <Link to="/guia" className={btn.outlineOnDark}>
          Guia da GSB
        </Link>
        <Link to="/catalogo" className={btn.outlineOnDark}>
          Catálogo
        </Link>
      </PageHero>
    </SiteLayout>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
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
      // Configurações completas (WhatsApp, e-mail, Instagram…) para pré-carregar
      // o cache do React Query — ver RootComponent.
      settings,
    };
  },
  head: ({ loaderData }) => {
    const desc = loaderData?.siteDescription || DEFAULT_DESCRIPTION;
    const ogImg = absUrl(loaderData?.ogImage || "/logo.png");
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
  // A paleta do site é fixa em styles.css (verde-mata + mostarda, out/2026);
  // a "Cor principal" do admin não sobrescreve mais os tokens do site público.
  const state = useRouterState();

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
  const { settings } = Route.useLoaderData();

  // Os dados de contato vêm do banco via useSettingsQuery, que só buscava no
  // navegador: o HTML do servidor (o que o Google e o revisor do AdSense leem)
  // saía com WhatsApp/e-mail vazios e links para wa.me/5500000000000.
  // Semeando o cache com o que o loader já buscou, servidor e navegador
  // renderizam igual, já com os dados reais.
  if (settings && !queryClient.getQueryData(SETTINGS_QUERY_KEY)) {
    queryClient.setQueryData(SETTINGS_QUERY_KEY, settings);
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <AdsenseScript />
      <AnalyticsTracker />
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
