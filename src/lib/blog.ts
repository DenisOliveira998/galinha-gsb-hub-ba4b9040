import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";
import { requireAdmin } from "./admin-auth";
import { cached, invalidatePrefix } from "./server-cache";

const BLOG_TTL = 2 * 60_000; // 2 min

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
    updatedAt: b.updatedAt ? b.updatedAt.toISOString() : b.createdAt.toISOString(),
    images: b.images.map((i: any) => i.url),
    blocks: b.blocks.map((bl: any) => ({
      id: bl.id,
      type: bl.type.toLowerCase(),
      text: bl.text ?? undefined,
      image: bl.image ?? undefined,
    })),
  };
}

// Lista completa (inclui rascunhos e o texto integral) — só para o painel admin.
export const listBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return cached("blog:list", BLOG_TTL, async () => {
    const posts = await prisma.blogPost.findMany({
      include: blogInclude,
      orderBy: { createdAt: "desc" },
    });
    return posts.map(toBlogDTO);
  });
});

// Lista pública e leve para home/listagem do blog: só posts publicados e sem o
// texto completo (content/blocks), que deixava o HTML da home com ~400 KB.
export const listPublishedBlogSummaries = createServerFn({ method: "GET" }).handler(async () =>
  cached("blog:summaries", BLOG_TTL, async () => {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        published: true,
        createdAt: true,
        author: { select: { name: true, avatar: true } },
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return posts.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      coverImage: b.coverImage,
      published: b.published,
      createdAt: b.createdAt.toISOString(),
      likeCount: b._count.likes,
      author: b.author ? { name: b.author.name, avatar: b.author.avatar ?? null } : null,
    }));
  }),
);

export const getBlogPostBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) =>
    cached(`blog:slug:${data.slug}`, BLOG_TTL, async () => {
      const post = await prisma.blogPost.findUnique({
        where: { slug: data.slug },
        include: blogInclude,
      });
      // Rascunhos não são expostos publicamente.
      return post && post.published ? toBlogDTO(post) : null;
    }),
  );

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
    const plainTitle = data.title.replace(/<[^>]*>/g, "").trim();
    const slug = await uniqueBlogSlug(slugify(plainTitle));
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
    invalidatePrefix("blog:");
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

    const plainTitle = rest.title ? rest.title.replace(/<[^>]*>/g, "").trim() : undefined;
    const newSlug = plainTitle ? await uniqueBlogSlug(slugify(plainTitle), id) : undefined;

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

    invalidatePrefix("blog:");
    const post = await prisma.blogPost.findUniqueOrThrow({ where: { id }, include: blogInclude });
    return toBlogDTO(post);
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await prisma.blogPost.delete({ where: { id: data.id } });
    invalidatePrefix("blog:");
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
