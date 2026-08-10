import { createServerFn } from "@tanstack/react-start";
import { put } from "@vercel/blob";
import { z } from "zod";

// Upload de imagem para Vercel Blob Storage.
// Requer BLOB_READ_WRITE_TOKEN configurado no painel da Vercel
// (Storage → Blob → Connect Store → o token é adicionado automaticamente).
export const uploadImage = createServerFn({ method: "POST" })
  .validator(z.object({ base64: z.string(), filename: z.string() }))
  .handler(async ({ data }) => {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error(
        "BLOB_READ_WRITE_TOKEN não configurado. Ative o Vercel Blob em Storage → Blob no painel da Vercel.",
      );
    }

    // Separa o prefixo "data:image/webp;base64," do conteúdo real
    const [meta, b64] = data.base64.split(",");
    if (!b64) throw new Error("Formato de imagem inválido.");

    const contentType = meta.match(/:(.*?);/)?.[1] ?? "image/webp";
    const ext = contentType.split("/")[1] || "webp";
    const buffer = Buffer.from(b64, "base64");

    // Nome único: timestamp + nome original com extensão correta
    const safeName = data.filename.replace(/[^a-z0-9._-]/gi, "_").replace(/\.[^.]+$/, "");
    const blobName = `gsb/${Date.now()}-${safeName}.${ext}`;

    const blob = await put(blobName, buffer, {
      access: "public",
      contentType,
      token,
    });

    return { url: blob.url };
  });
