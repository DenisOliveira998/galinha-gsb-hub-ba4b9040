import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

// Espelha register() do shop-store.ts, com senha hasheada de verdade.
export const registerCustomer = createServerFn({ method: "POST" })
  .validator(z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6) }))
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) return { ok: false, error: "Já existe uma conta com este e-mail." };

    const passwordHash = await bcrypt.hash(data.password, 10);
    const customer = await prisma.customer.create({
      data: { name: data.name.trim() || email, email, passwordHash },
    });
    return { ok: true, customerId: customer.id };
  });

// Espelha loginCustomer() do shop-store.ts.
export const loginCustomer = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email(), password: z.string() }))
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) return { ok: false, error: "E-mail ou senha inválidos." };

    const valid = await bcrypt.compare(data.password, customer.passwordHash);
    if (!valid) return { ok: false, error: "E-mail ou senha inválidos." };

    return { ok: true, customerId: customer.id, name: customer.name };
  });
