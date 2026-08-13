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

      // Conta criada via Google/OTP não tem senha — orienta o usuário
      if (!customer.passwordHash) {
        return { ok: false as const, error: "Esta conta usa login pelo Google ou código por e-mail. Use uma dessas opções." };
      }

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

// ---------------------------------------------------------------------------
// Sincroniza usuário Better Auth (Google/OTP) com tabela customers
// Chamado pelo cliente após login social/OTP bem-sucedido
// ---------------------------------------------------------------------------
export const syncBetterAuthUser = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.string(), name: z.string(), email: z.string() }))
  .handler(async ({ data }) => {
    try {
      const email = data.email.trim().toLowerCase();
      let customer = await prisma.customer.findUnique({ where: { email } });
      if (customer) {
        if (!customer.userId) {
          customer = await prisma.customer.update({
            where: { email },
            data: { userId: data.userId, name: data.name || customer.name },
          });
        }
      } else {
        customer = await prisma.customer.create({
          data: {
            userId: data.userId,
            name: data.name || email.split("@")[0],
            email,
            passwordHash: null,
          },
        });
      }
      return { ok: true as const, customerId: customer.id, name: customer.name };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[syncBetterAuthUser]", msg);
      return { ok: false as const, error: `Erro interno: ${msg}` };
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

// ---------------------------------------------------------------------------
// Troca de senha para usuários com login e-mail + senha
// ---------------------------------------------------------------------------
export const changeCustomerPassword = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string(),
    currentPassword: z.string(),
    newPassword: z.string().min(6, "Mínimo 6 caracteres."),
  }))
  .handler(async ({ data }) => {
    try {
      const customer = await prisma.customer.findUnique({ where: { id: data.id } });
      if (!customer) return { ok: false as const, error: "Conta não encontrada." };
      if (!customer.passwordHash) return { ok: false as const, error: "Esta conta usa login social. Não é possível alterar a senha aqui." };

      const valid = await bcrypt.compare(data.currentPassword, customer.passwordHash);
      if (!valid) return { ok: false as const, error: "Senha atual incorreta." };

      const newHash = await bcrypt.hash(data.newPassword, 10);
      await prisma.customer.update({ where: { id: data.id }, data: { passwordHash: newHash } });
      return { ok: true as const };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false as const, error: `Erro interno: ${msg}` };
    }
  });
