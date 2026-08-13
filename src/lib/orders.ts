import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";

const itemSchema = z.object({
  postId: z.string(),
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string().optional(),
  slug: z.string().optional(),
});

// Salva pedido no TiDB ao confirmar no checkout
export const saveOrder = createServerFn({ method: "POST" })
  .validator(z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    notes: z.string().optional(),
    total: z.number(),
    items: z.array(itemSchema),
    customerId: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    try {
      const order = await prisma.order.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          notes: data.notes ?? null,
          total: data.total,
          itemsJson: data.items,
          customerId: data.customerId ?? null,
          status: "PENDING",
        },
      });
      return { ok: true as const, id: order.id };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[saveOrder]", msg);
      return { ok: false as const, error: msg };
    }
  });

// Lista todos os pedidos para o admin
export const listOrders = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
      });
      return orders.map((o) => ({
        id: o.id,
        name: o.name,
        email: o.email,
        phone: o.phone,
        address: o.address,
        city: o.city,
        state: o.state,
        zip: o.zip,
        notes: o.notes ?? "",
        total: Number(o.total),
        status: o.status,
        createdAt: o.createdAt.toISOString(),
        items: o.itemsJson as Array<{ postId: string; title: string; price: number; quantity: number; image?: string }>,
      }));
    } catch (err) {
      console.error("[listOrders]", err);
      return [];
    }
  });

// Marca pedido como concluído
export const completeOrder = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    try {
      await prisma.order.update({
        where: { id: data.id },
        data: { status: "COMPLETED" },
      });
      return { ok: true as const };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false as const, error: msg };
    }
  });

// Lista clientes cadastrados para o admin
export const listCustomers = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const customers = await prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, createdAt: true },
      });
      return customers.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        createdAt: c.createdAt.toISOString(),
      }));
    } catch (err) {
      console.error("[listCustomers]", err);
      return [];
    }
  });
