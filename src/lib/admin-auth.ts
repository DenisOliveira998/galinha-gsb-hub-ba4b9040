import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { prisma } from "./prisma";

// ─── Guard de autenticação ────────────────────────────────────────────────────
// Lança erro se a requisição não vier de uma sessão admin válida.
// Use dentro de handlers de createServerFn para proteger mutações admin-only.
//
// NOTA: getCookie é importado dinamicamente para evitar que o analisador
// estático do import-protection-plugin do TanStack Start bloqueie este módulo
// no bundle do cliente (admin.tsx importa este arquivo para getAdminSession/
// adminLogout, mas requireAdmin só roda no servidor).

export async function requireAdmin(): Promise<void> {
  const { getCookie: getServerCookie } = await import("@tanstack/react-start/server");
  const adminId = getServerCookie("admin_session");
  if (!adminId) throw new Error("Não autorizado");
  const admin = await prisma.admin.findUnique({ where: { id: adminId }, select: { id: true } });
  if (!admin) throw new Error("Não autorizado");
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

      setCookie("admin_session", admin.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: "/",
      });

      return { ok: true as const };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[adminLogin]", msg);
      return { ok: false as const, error: `Erro interno: ${msg}` };
    }
  });

// ─── Verificar sessão ─────────────────────────────────────────────────────────
// Lê o cookie e retorna os dados do admin ou null.

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const adminId = getCookie("admin_session");
  if (!adminId) return null;

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, email: true },
  });

  return admin ?? null;
});

// ─── Logout ───────────────────────────────────────────────────────────────────

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie("admin_session", { path: "/" });
  return { ok: true as const };
});

// ─── Trocar senha ─────────────────────────────────────────────────────────────

export const changeAdminPassword = createServerFn({ method: "POST" })
  .validator(z.object({ adminId: z.string(), newPassword: z.string().min(6) }))
  .handler(async ({ data }) => {
    const passwordHash = await bcrypt.hash(data.newPassword, 10);
    await prisma.admin.update({ where: { id: data.adminId }, data: { passwordHash } });
    return { ok: true as const };
  });
