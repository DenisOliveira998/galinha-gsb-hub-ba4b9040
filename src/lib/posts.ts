import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";

// ---------------------------------------------------------------------------
// Server functions de Posts/Anúncios.
// Substituem addPost/updatePost/deletePost do mock-store.ts por chamadas
// reais ao TiDB Cloud via Prisma. A shape de retorno é compatível com a
// interface Post já usada nos componentes do site.
// ---------------------------------------------------------------------------

const postInclude = {
  images: { orderBy: { order: "asc" as const } },
  faqs: { orderBy: { order: "asc" as const } },
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function toPostDTO(p: any) {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.categoryId,
    description: p.description,
    price: p.price ? Number(p.price) : undefined,
    status: p.status,
    images: p.images.map((i: any) => i.url),
    createdAt: p.createdAt.toISOString(),
    faq: p.faqs.map((f: any) => ({ id: f.id, question: f.question, answer: f.answer ?? "" })),
  };
}

export const getPostBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const post = await prisma.post.findUnique({
      where: { slug: data.slug },
      include: postInclude,
    });
    return post ? toPostDTO(post) : null;
  });

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const posts = await prisma.post.findMany({
    include: postInclude,
    orderBy: { createdAt: "desc" },
  });
  return posts.map(toPostDTO);
});

const createPostSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  price: z.number().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SOLD"]).default("DRAFT"),
  images: z.array(z.string()).default([]),
  faq: z.array(z.object({ question: z.string(), answer: z.string().optional() })).default([]),
});

export const createPost = createServerFn({ method: "POST" })
  .validator(createPostSchema)
  .handler(async ({ data }) => {
    const slug = `${slugify(data.title)}-${Math.random().toString(36).slice(2, 6)}`;
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug,
        categoryId: data.category,
        description: data.description,
        price: data.price,
        status: data.status,
        images: { create: data.images.map((url, order) => ({ url, order })) },
        faqs: {
          create: data.faq.map((f, order) => ({
            question: f.question,
            answer: f.answer,
            order,
          })),
        },
      },
      include: postInclude,
    });
    return toPostDTO(post);
  });

const updatePostSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  price: z.number().nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SOLD"]).optional(),
  images: z.array(z.string()).optional(),
  faq: z.array(z.object({ question: z.string(), answer: z.string().optional() })).optional(),
});

export const updatePost = createServerFn({ method: "POST" })
  .validator(updatePostSchema)
  .handler(async ({ data }) => {
    const { id, images, faq, category, ...rest } = data;

    await prisma.post.update({
      where: { id },
      data: {
        ...rest,
        ...(category ? { categoryId: category } : {}),
      },
    });

    if (images) {
      await prisma.postImage.deleteMany({ where: { postId: id } });
      await prisma.postImage.createMany({
        data: images.map((url, order) => ({ postId: id, url, order })),
      });
    }

    if (faq) {
      await prisma.faq.deleteMany({ where: { postId: id } });
      await prisma.faq.createMany({
        data: faq.map((f, order) => ({
          postId: id,
          question: f.question,
          answer: f.answer,
          order,
        })),
      });
    }

    const post = await prisma.post.findUniqueOrThrow({ where: { id }, include: postInclude });
    return toPostDTO(post);
  });

export const deletePost = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    // onDelete: Cascade no schema já remove images, faqs, comments,
    // ratings e favorites vinculados a este post.
    await prisma.post.delete({ where: { id: data.id } });
    return { ok: true };
  });
