import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";

export const listAuthors = createServerFn({ method: "GET" }).handler(async () => {
  return prisma.author.findMany({ orderBy: { createdAt: "asc" } });
});

const authorSchema = z.object({
  name: z.string().min(1),
  avatar: z.string().optional(),
  bio: z.string().optional(),
});

export const createAuthor = createServerFn({ method: "POST" })
  .validator(authorSchema)
  .handler(async ({ data }) => {
    return prisma.author.create({ data });
  });

export const updateAuthor = createServerFn({ method: "POST" })
  .validator(authorSchema.extend({ id: z.string() }))
  .handler(async ({ data }) => {
    const { id, ...rest } = data;
    return prisma.author.update({ where: { id }, data: rest });
  });

export const deleteAuthor = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await prisma.author.delete({ where: { id: data.id } });
    return { ok: true };
  });
