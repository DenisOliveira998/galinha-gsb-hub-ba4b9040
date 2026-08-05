import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";

// Lista os IDs de posts favoritados por este visitante.
export const listFavorites = createServerFn({ method: "GET" })
  .validator(z.object({ ownerKey: z.string() }))
  .handler(async ({ data }) => {
    const favs = await prisma.favorite.findMany({
      where: { ownerKey: data.ownerKey },
      select: { postId: true },
    });
    return favs.map((f) => f.postId);
  });

// Alterna favorito (adiciona se não existe, remove se já existe) —
// espelha toggleFavorite do mock-store.ts.
export const toggleFavorite = createServerFn({ method: "POST" })
  .validator(z.object({ postId: z.string(), ownerKey: z.string() }))
  .handler(async ({ data }) => {
    const existing = await prisma.favorite.findUnique({
      where: { postId_ownerKey: { postId: data.postId, ownerKey: data.ownerKey } },
    });
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    }
    await prisma.favorite.create({ data: { postId: data.postId, ownerKey: data.ownerKey } });
    return { favorited: true };
  });
