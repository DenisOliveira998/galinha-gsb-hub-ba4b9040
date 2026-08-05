import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

// Substitui a checagem de e-mail/senha em texto puro do mock-store.ts.
// Retorna apenas ok/erro — a criação do cookie/sessão de fato deve ser
// feita na rota que chama esta função (ver README, Passo 7).
export const adminLogin = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email(), password: z.string().min(1) }))
  .handler(async ({ data }) => {
    const admin = await prisma.admin.findUnique({ where: { email: data.email.toLowerCase() } });
    if (!admin) return { ok: false, error: "E-mail ou senha inválidos." };

    const valid = await bcrypt.compare(data.password, admin.passwordHash);
    if (!valid) return { ok: false, error: "E-mail ou senha inválidos." };

    return { ok: true, adminId: admin.id };
  });

export const changeAdminPassword = createServerFn({ method: "POST" })
  .validator(z.object({ adminId: z.string(), newPassword: z.string().min(6) }))
  .handler(async ({ data }) => {
    const passwordHash = await bcrypt.hash(data.newPassword, 10);
    await prisma.admin.update({ where: { id: data.adminId }, data: { passwordHash } });
    return { ok: true };
  });
