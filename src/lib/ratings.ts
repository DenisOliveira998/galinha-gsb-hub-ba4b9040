import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";

// Retorna a média e o total de avaliações de um anúncio.
export const getRatingSummary = createServerFn({ method: "GET" })
  .validator(z.object({ postId: z.string() }))
  .handler(async ({ data }) => {
    const agg = await prisma.rating.aggregate({
      where: { postId: data.postId },
      _avg: { value: true },
      _count: { value: true },
    });
    return { average: agg._avg.value ?? 0, count: agg._count.value };
  });

// Nota que o visitante atual (identificado por ownerKey) já deu neste anúncio.
export const getMyRating = createServerFn({ method: "GET" })
  .validator(z.object({ postId: z.string(), ownerKey: z.string() }))
  .handler(async ({ data }) => {
    const rating = await prisma.rating.findUnique({
      where: { postId_ownerKey: { postId: data.postId, ownerKey: data.ownerKey } },
    });
    return rating?.value ?? null;
  });

// Cria ou atualiza a nota do visitante (1 nota por pessoa por anúncio) —
// espelha ratePost do mock-store.ts.
// Teste: no primeiro voto de cada anúncio, semeia 30-70 avaliações fictícias
// com o mesmo valor para simular histórico de avaliações.
export const ratePost = createServerFn({ method: "POST" })
  .validator(
    z.object({
      postId: z.string(),
      ownerKey: z.string(),
      value: z.number().min(1).max(5),
    }),
  )
  .handler(async ({ data }) => {
    const value = Math.round(data.value);

    // Verifica se já existe alguma avaliação real (não-seed) para este anúncio
    const existing = await prisma.rating.count({
      where: { postId: data.postId, ownerKey: { not: { startsWith: "seed_" } } },
    });

    // Se for o primeiro voto real, semeia avaliações fictícias
    if (existing === 0) {
      const seedCount = Math.floor(Math.random() * 41) + 30; // 30–70
      await prisma.rating.createMany({
        data: Array.from({ length: seedCount }, (_, i) => ({
          postId: data.postId,
          ownerKey: `seed_${i + 1}`,
          value,
        })),
        skipDuplicates: true,
      });
    }

    return prisma.rating.upsert({
      where: { postId_ownerKey: { postId: data.postId, ownerKey: data.ownerKey } },
      update: { value },
      create: { postId: data.postId, ownerKey: data.ownerKey, value },
    });
  });
