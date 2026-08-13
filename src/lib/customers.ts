import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const registerCustomer = createServerFn({ method: "POST" })
  .validator(z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6) }))
  .handler(async ({ data }) => {
    try {
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

export const getCustomerProfile = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id: data.id },
        select: { id: true, name: true, email: true, phone: true, cpf: true, address: true, city: true, state: true, zip: true, createdAt: true },
      });
      if (!customer) return null;
      return { ...customer, createdAt: customer.createdAt.toISOString() };
    } catch {
      return null;
    }
  });

export const updateCustomerProfile = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string(),
    name: z.string().min(1, "Informe seu nome."),
    phone: z.string().optional(),
    cpf: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    try {
      const { id, ...fields } = data;
      await prisma.customer.update({ where: { id }, data: fields });
      return { ok: true as const };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false as const, error: `Erro interno: ${msg}` };
    }
  });
