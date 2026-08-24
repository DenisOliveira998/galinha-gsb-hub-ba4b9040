import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
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

const DEFAULT_DESCRIPTION = "Criadouro de galinha Sertanejo Balão (GSB). Ovos férteis, galinhas e reprodutores de procedência garantida.";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
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
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
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
    };
  },
  head: ({ loaderData }) => {
    const desc = loaderData?.siteDescription || DEFAULT_DESCRIPTION;
    const ogImg = loaderData?.ogImage || "/logo.png";
    return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Galinha GSB — Sertanejo Balão | Ovos férteis, galinhas e reprodutores" },
      { name: "description", content: desc },
      { name: "author", content: "Galinha GSB" },
      { property: "og:title", content: "Galinha GSB — Sertanejo Balão | Ovos férteis, galinhas e reprodutores" },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ogImg },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Galinha GSB — Sertanejo Balão | Ovos férteis, galinhas e reprodutores" },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: ogImg },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
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
  };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const loaderData = Route.useLoaderData();
  const tokens = brandTokens(loaderData?.brandColor || DEFAULT_BRAND_COLOR);
  // Script inline que aplica os tokens da cor da marca ANTES de qualquer pintura,
  // eliminando o flash da cor padrão que acontecia ao usar useEffect no cliente.
  const brandScript = `(function(){var s=document.documentElement.style;${
    Object.entries(tokens)
      .map(([k, v]) => `s.setProperty(${JSON.stringify(k)},${JSON.stringify(v)})`)
      .join(";")
  }})()`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: brandScript }} />
        <HeadContent />
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
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
