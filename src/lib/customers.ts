import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

// Espelha register() do shop-store.ts, com senha hasheada de verdade.
export const registerCustomer = createServerFn({ method: "POST" })
  .validator(z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6) }))
  .handler(async ({ data }) => {
    try {
      // DEBUG — remove depois de confirmar
      if (!process.env.DATABASE_URL) {
        const keys = Object.keys(process.env).filter(k => !/(secret|token|key|pass)/i.test(k)).slice(0, 30).join(', ');
        return { ok: false as const, error: `DATABASE_URL ausente. Vars disponíveis: ${keys}` };
      }

      const email = data.email.trim().toLowerCase();
      const existing = await prisma.customer.findUnique({ where: { email } });
      if (existing) return { ok: false as const, error: "Já existe uma conta com este e-mail." };

      const passwordHash = await bcrypt.hash(data.password, 10);
      const customer = await prisma.customer.create({
        data: { name: data.name.trim() || email, email, passwordHash },
      });
      return { ok: true as const, customerId: customer.id };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[registerCustomer]", msg);
      return { ok: false as const, error: `Erro interno: ${msg}` };
    }
  });

// Espelha loginCustomer() do shop-store.ts.
export const loginCustomer = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email(), password: z.string() }))
  .handler(async ({ data }) => {
    try {
      const email = data.email.trim().toLowerCase();
      const customer = await prisma.customer.findUnique({ where: { email } });
      if (!customer) return { ok: false as const, error: "E-mail ou senha inválidos." };

      const valid = await bcrypt.compare(data.password, customer.passwordHash);
      if (!valid) return { ok: false as const, error: "E-mail ou senha inválidos." };

      return { ok: true as const, customerId: customer.id, name: customer.name };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[loginCustomer]", msg);
      return { ok: false as const, error: `Erro interno: ${msg}` };
    }
  });
