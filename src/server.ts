import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

async function handleSitemap(): Promise<Response> {
  const BASE = "https://galinhagsb.com.br";
  const today = new Date().toISOString().split("T")[0];
  const day = (d: Date) => d.toISOString().split("T")[0];

  let posts: { slug: string; updatedAt: Date }[] = [];
  let blogs: { slug: string; updatedAt: Date }[] = [];

  try {
    const { prisma } = await import("./lib/prisma");
    [posts, blogs] = await Promise.all([
      prisma.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);
  } catch {
    // se falhar retorna sitemap estático
  }

  // Páginas fixas. As do /guia e as institucionais estavam fora do sitemap.
  const staticRoutes = [
    "/", "/catalogo", "/blog", "/guia",
    "/guia/origem", "/guia/caracteristicas", "/guia/plumagem", "/guia/alimentacao",
    "/guia/pintinhos", "/guia/reproducao", "/guia/selecao", "/guia/sanidade",
    "/sobre", "/contato", "/afiliados", "/publicidade",
    "/privacidade", "/termos", "/cookies",
  ];
  const url = (loc: string, lastmod: string) => `  <url><loc>${BASE}${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
  // lastmod real (data da última edição) em vez de "hoje" em tudo.
  const urls = [
    ...staticRoutes.map((r) => url(r, today)),
    ...posts.map((p) => url(`/catalogo/${p.slug}`, day(p.updatedAt))),
    ...blogs.map((b) => url(`/blog/${b.slug}`, day(b.updatedAt))),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

// Páginas que dependem de login/sessão nunca vão para o cache da CDN.
const PRIVATE_PREFIXES = ["/admin", "/conta", "/carrinho", "/api", "/_serverFn"];

/**
 * Deixa a CDN da Vercel guardar páginas públicas por 60 s (e servir a cópia
 * antiga enquanto atualiza em segundo plano). Antes era "max-age=0" em tudo,
 * então cada visita ia até o banco (~1–1,5 s de espera, 9 s no cold start).
 * Só aplica a GET anônimo (sem cookie), HTML, status 200 e sem Set-Cookie,
 * para nunca guardar uma página personalizada de um usuário logado.
 */
function withEdgeCache(request: Request, pathname: string, response: Response): Response {
  if (request.method !== "GET") return response;
  if (request.headers.get("cookie")) return response;
  if (PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return response;
  if (response.status !== 200) return response;
  if (!(response.headers.get("content-type") ?? "").includes("text/html")) return response;
  if (response.headers.has("set-cookie")) return response;
  const headers = new Headers(response.headers);
  headers.set("cache-control", "public, max-age=0, must-revalidate");
  headers.set("cdn-cache-control", "public, s-maxage=60, stale-while-revalidate=300");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      // Better Auth intercepta /api/auth/* antes do roteador SSR
      const { pathname } = new URL(request.url);

      // ── OTP bypass: chama auth.api.* diretamente sem passar pelo roteador HTTP
      // (evita o bug de 404 no plugin emailOTP via auth.handler)
      if (pathname === "/api/otp/send" && request.method === "POST") {
        const { auth } = await import("./lib/auth");
        const body = await request.json() as { email: string; type: string };
        try {
          await (auth.api as any).sendVerificationOTP({ body });
          return new Response(JSON.stringify({ success: true }), {
            headers: { "content-type": "application/json" },
          });
        } catch (e: any) {
          const status = typeof e?.statusCode === "number" ? e.statusCode : 400;
          return new Response(JSON.stringify({ error: e?.message ?? String(e) }), {
            status,
            headers: { "content-type": "application/json" },
          });
        }
      }

      if (pathname === "/api/otp/verify" && request.method === "POST") {
        const { auth } = await import("./lib/auth");
        const body = await request.json() as { email: string; otp: string };
        try {
          // asResponse: true → retorna Response com Set-Cookie
          const response = await (auth.api as any).signInEmailOTP({ body, asResponse: true }) as Response;
          return response;
        } catch (e: any) {
          const status = typeof e?.statusCode === "number" ? e.statusCode : 400;
          return new Response(JSON.stringify({ error: e?.message ?? String(e) }), {
            status,
            headers: { "content-type": "application/json" },
          });
        }
      }

      if (pathname.startsWith("/api/auth")) {
        const { auth } = await import("./lib/auth");
        return auth.handler(request);
      }

      if (pathname === "/sitemap.xml") {
        return handleSitemap();
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withEdgeCache(request, pathname, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
