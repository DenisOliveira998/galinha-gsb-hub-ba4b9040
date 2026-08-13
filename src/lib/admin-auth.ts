import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { prisma } from "./prisma";

// ─── Login ────────────────────────────────────────────────────────────────────
// Valida credenciais e, em caso de sucesso, grava cookie HTTP-only de sessão.

export const adminLogin = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email(), password: z.string().min(1) }))
  .handler(async ({ data }) => {
    try {
      const admin = await prisma.admin.findUnique({ where: { email: data.email.toLowerCase() } });
      if (!admin) return { ok: false as const, error: "E-mail ou senha inválidos." };

      const valid = await bcrypt.compare(data.password, admin.passwordHash);
      if (!valid) return { ok: false as const, error: "E-mail ou senha inválidos." };

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
