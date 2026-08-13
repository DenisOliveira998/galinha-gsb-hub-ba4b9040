import { PrismaClient } from "@prisma/client";

// Em ambiente serverless (Vercel), cada invocação pode recriar o módulo.
// Usar um singleton global evita abrir uma conexão nova a cada request,
// o que esgotaria rapidamente o limite de conexões do TiDB Cloud Serverless.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

if (!process.env.DATABASE_URL) {
  console.error("[prisma] DATABASE_URL não definida no ambiente!");
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
