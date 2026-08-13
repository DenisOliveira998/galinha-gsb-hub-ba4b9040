import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";

export const listComments = createServerFn({ method: "GET" })
  .validator(z.object({ postId: z.string() }))
  .handler(async ({ data }) => {
    return prisma.comment.findMany({
      where: { postId: data.postId },
      orderBy: { createdAt: "asc" },
    });
  });

export const listAllComments = createServerFn({ method: "GET" }).handler(async () => {
  return prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { post: { select: { title: true, slug: true } } },
  });
});

export const addComment = createServerFn({ method: "POST" })
  .validator(z.object({ postId: z.string(), name: z.string(), text: z.string().min(1) }))
  .handler(async ({ data }) => {
    return prisma.comment.create({
      data: {
        postId: data.postId,
        name: data.name.trim() || "Visitante",
        text: data.text.trim(),
      },
    });
  });

export const deleteComment = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await prisma.comment.delete({ where: { id: data.id } });
    return { ok: true };
  });
