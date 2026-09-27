import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { prisma } from "./prisma";

// ─── Sessão assinada ──────────────────────────────────────────────────────────
// Antes o cookie guardava o próprio ID do admin: quem o obtivesse tinha acesso
// permanente (o valor nunca mudava, não expirava no servidor e o logout não o
// invalidava). Agora o cookie é um token assinado com HMAC-SHA256:
//
//   base64url(adminId) . expiraEm(ms) . assinatura
//
// A assinatura cobre o ID, a validade e o hash da senha atual — então:
//   • não dá para forjar nem alterar o token sem o segredo do servidor;
//   • ele expira sozinho em 7 dias (checado no servidor, não só no navegador);
//   • trocar a senha invalida na hora todas as sessões abertas.
// Usa Web Crypto (globalThis.crypto) para não puxar node:crypto no bundle do cliente.

const COOKIE = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

function sessionSecret(): string {
  // Mesmos nomes que o Better Auth aceita (ele já exige um deles em produção).
  const secret =
    process.env.ADMIN_SESSION_SECRET || process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET/BETTER_AUTH_SECRET ausente — configure na Vercel.");
  }
  return secret;
}

const b64url = {
  encode: (bytes: Uint8Array) =>
    btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  decode: (s: string) => {
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
    return Uint8Array.from(bin, (c) => c.charCodeAt(0));
  },
};
const utf8 = new TextEncoder();

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    utf8.encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, utf8.encode(message));
  return b64url.encode(new Uint8Array(sig));
}

/** Comparação em tempo constante (evita descobrir a assinatura medindo o tempo). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function createSessionToken(adminId: string, passwordHash: string): Promise<string> {
  const exp = Date.now() + SESSION_TTL_MS;
  const idPart = b64url.encode(utf8.encode(adminId));
  const sig = await hmac(`${idPart}.${exp}.${passwordHash}`);
  return `${idPart}.${exp}.${sig}`;
}

/** Valida o token do cookie e devolve o admin, ou null se inválido/expirado. */
async function verifySessionToken(token: string | undefined) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [idPart, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return null;

  let adminId: string;
  try {
    adminId = new TextDecoder().decode(b64url.decode(idPart));
  } catch {
    return null;
  }
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, email: true, passwordHash: true },
  });
  if (!admin) return null;

  const expected = await hmac(`${idPart}.${expStr}.${admin.passwordHash}`);
  if (!safeEqual(sig, expected)) return null;
  return { id: admin.id, email: admin.email };
}

// ─── Guard de autenticação ────────────────────────────────────────────────────
// Lança erro se a requisição não vier de uma sessão admin válida.
// Use dentro de handlers de createServerFn para proteger mutações admin-only.
//
// NOTA: getCookie é importado dinamicamente para evitar que o analisador
// estático do import-protection-plugin do TanStack Start bloqueie este módulo
// no bundle do cliente (admin.tsx importa este arquivo para getAdminSession/
// adminLogout, mas requireAdmin só roda no servidor).

export async function requireAdmin(): Promise<{ id: string; email: string }> {
  const { getCookie: getServerCookie } = await import("@tanstack/react-start/server");
  const admin = await verifySessionToken(getServerCookie(COOKIE));
  if (!admin) throw new Error("Não autorizado");
  return admin;
}

// ─── Login ────────────────────────────────────────────────────────────────────
// Valida credenciais e, em caso de sucesso, grava cookie HTTP-only de sessão.

// Hash fictício usado quando o email não existe — garante que o bcrypt sempre
// rode pelo mesmo tempo, impedindo timing attacks (medir ms para saber se o
// email existe no sistema).
const DUMMY_HASH = "$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345";

export const adminLogin = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email(), password: z.string().min(1) }))
  .handler(async ({ data }) => {
    try {
      const admin = await prisma.admin.findUnique({ where: { email: data.email.toLowerCase() } });

      // Sempre roda bcrypt — mesmo sem admin — para que o tempo de resposta
      // seja idêntico independente de o email existir ou não (anti-timing attack).
      const valid = await bcrypt.compare(data.password, admin?.passwordHash ?? DUMMY_HASH);

      if (!admin || !valid) return { ok: false as const, error: "E-mail ou senha inválidos." };

      setCookie(COOKIE, await createSessionToken(admin.id, admin.passwordHash), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_TTL_MS / 1000,
        path: "/",
      });

      return { ok: true as const };
    } catch (err) {
      // Detalhe só no log do servidor; o navegador recebe mensagem genérica.
      console.error("[adminLogin]", err instanceof Error ? err.message : String(err));
      return { ok: false as const, error: "Erro interno. Tente novamente em instantes." };
    }
  });

// ─── Verificar sessão ─────────────────────────────────────────────────────────
// Lê o cookie e retorna os dados do admin ou null.

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await verifySessionToken(getCookie(COOKIE));
  } catch (err) {
    console.error("[getAdminSession]", err instanceof Error ? err.message : String(err));
    return null;
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE, { path: "/" });
  return { ok: true as const };
});

// ─── Trocar senha ─────────────────────────────────────────────────────────────
// Antes: sem login e com o adminId vindo do navegador — qualquer pessoa que
// soubesse o ID podia trocar a senha. Agora exige sessão válida, só altera a
// senha do próprio admin logado e pede a senha atual. Como a assinatura da
// sessão inclui o hash da senha, todas as outras sessões caem após a troca.

export const changeAdminPassword = createServerFn({ method: "POST" })
  .validator(z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8) }))
  .handler(async ({ data }) => {
    const session = await requireAdmin();
    const admin = await prisma.admin.findUniqueOrThrow({ where: { id: session.id } });
    if (!(await bcrypt.compare(data.currentPassword, admin.passwordHash))) {
      return { ok: false as const, error: "Senha atual incorreta." };
    }
    const passwordHash = await bcrypt.hash(data.newPassword, 10);
    await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash } });

    // Reemite o cookie desta sessão com a nova senha (as demais ficam inválidas).
    setCookie(COOKIE, await createSessionToken(admin.id, passwordHash), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_TTL_MS / 1000,
      path: "/",
    });
    return { ok: true as const };
  });
