import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";
import { requireAdmin } from "./admin-auth";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function uniqueBlogSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${++n}`;
  }
}

const blogInclude = {
  images: { orderBy: { order: "asc" as const } },
  blocks: { orderBy: { order: "asc" as const } },
  author: true,
  _count: { select: { likes: true } },
};

function toBlogDTO(b: any) {
  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    content: b.content,
    coverImage: b.coverImage,
    published: b.published,
    adSlot: b.adSlot ?? "",
    authorId: b.authorId ?? null,
    author: b.author ? { id: b.author.id, name: b.author.name, avatar: b.author.avatar ?? null, bio: b.author.bio ?? null } : null,
    likeCount: b._count?.likes ?? 0,
    createdAt: b.createdAt.toISOString(),
    images: b.images.map((i: any) => i.url),
    blocks: b.blocks.map((bl: any) => ({
      id: bl.id,
      type: bl.type.toLowerCase(),
      text: bl.text ?? undefined,
      image: bl.image ?? undefined,
    })),
  };
}

export const listBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  const posts = await prisma.blogPost.findMany({
    include: blogInclude,
    orderBy: { createdAt: "desc" },
  });
  return posts.map(toBlogDTO);
});

export const getBlogPostBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const post = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
      include: blogInclude,
    });
    return post ? toBlogDTO(post) : null;
  });

const blockSchema = z.object({
  type: z.enum(["text", "image"]),
  text: z.string().optional(),
  image: z.string().optional(),
});

const createBlogSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  coverImage: z.string().default(""),
  published: z.boolean().default(false),
  adSlot: z.string().default(""),
  authorId: z.string().nullable().optional(),
  images: z.array(z.string()).default([]),
  blocks: z.array(blockSchema).default([]),
});

export const createBlogPost = createServerFn({ method: "POST" })
  .validator(createBlogSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const slug = await uniqueBlogSlug(slugify(data.title));
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        published: data.published,
        adSlot: data.adSlot || null,
        authorId: data.authorId ?? null,
        images: { create: data.images.map((url, order) => ({ url, order })) },
        blocks: {
          create: data.blocks.map((b, order) => ({
            type: b.type.toUpperCase() as "TEXT" | "IMAGE",
            text: b.text,
            image: b.image,
            order,
          })),
        },
      },
      include: blogInclude,
    });
    return toBlogDTO(post);
  });

const updateBlogSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  published: z.boolean().optional(),
  adSlot: z.string().optional(),
  authorId: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),
  blocks: z.array(blockSchema).optional(),
});

export const updateBlogPost = createServerFn({ method: "POST" })
  .validator(updateBlogSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { id, images, blocks, ...rest } = data;

    const newSlug = rest.title ? await uniqueBlogSlug(slugify(rest.title), id) : undefined;

    await prisma.blogPost.update({
      where: { id },
      data: {
        ...rest,
        ...(rest.adSlot !== undefined ? { adSlot: rest.adSlot || null } : {}),
        ...(rest.authorId !== undefined ? { authorId: rest.authorId ?? null } : {}),
        ...(newSlug ? { slug: newSlug } : {}),
      },
    });

    if (images) {
      await prisma.blogImage.deleteMany({ where: { blogPostId: id } });
      await prisma.blogImage.createMany({
        data: images.map((url, order) => ({ blogPostId: id, url, order })),
      });
    }

    if (blocks) {
      await prisma.blogBlock.deleteMany({ where: { blogPostId: id } });
      await prisma.blogBlock.createMany({
        data: blocks.map((b, order) => ({
          blogPostId: id,
          type: b.type.toUpperCase() as "TEXT" | "IMAGE",
          text: b.text,
          image: b.image,
          order,
        })),
      });
    }

    const post = await prisma.blogPost.findUniqueOrThrow({ where: { id }, include: blogInclude });
    return toBlogDTO(post);
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await prisma.blogPost.delete({ where: { id: data.id } });
    return { ok: true };
  });

// ----------------------------------------------------------------- Blog Likes

export const getBlogLikeSummary = createServerFn({ method: "GET" })
  .validator(z.object({ postId: z.string(), ownerKey: z.string() }))
  .handler(async ({ data }) => {
    const [count, mine] = await Promise.all([
      prisma.blogLike.count({ where: { blogPostId: data.postId } }),
      prisma.blogLike.findUnique({ where: { blogPostId_ownerKey: { blogPostId: data.postId, ownerKey: data.ownerKey } } }),
    ]);
    return { count, liked: !!mine };
  });

export const toggleBlogLike = createServerFn({ method: "POST" })
  .validator(z.object({ postId: z.string(), ownerKey: z.string() }))
  .handler(async ({ data }) => {
    const existing = await prisma.blogLike.findUnique({
      where: { blogPostId_ownerKey: { blogPostId: data.postId, ownerKey: data.ownerKey } },
    });
    if (existing) {
      await prisma.blogLike.delete({ where: { id: existing.id } });
    } else {
      await prisma.blogLike.create({ data: { blogPostId: data.postId, ownerKey: data.ownerKey } });
    }
    const count = await prisma.blogLike.count({ where: { blogPostId: data.postId } });
    return { count, liked: !existing };
  });
