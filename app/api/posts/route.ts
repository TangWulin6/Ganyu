import { NextResponse } from "next/server";
import { POSTS_PER_PAGE, getAllTags, getPostMetas, getTotalPages } from "@/lib/posts";
import { SITE } from "@/lib/site";

/**
 * 全站唯一的 Route Handler。
 *
 * 关键：`dynamic = "force-static"` —— 该响应在 `next build` 阶段就被渲染成
 * 静态 JSON，部署后由 CDN 直接返回，不产生任何 Serverless 函数调用。
 * 这是为了在 Vercel Hobby 免费版下把函数配额消耗压到 0。
 */
export const dynamic = "force-static";

export function GET() {
  const posts = getPostMetas();

  return NextResponse.json(
    {
      site: {
        name: SITE.fullName,
        description: SITE.description,
        author: SITE.author,
        url: SITE.url,
      },
      meta: {
        totalPosts: posts.length,
        totalTags: getAllTags().length,
        postsPerPage: POSTS_PER_PAGE,
        totalPages: getTotalPages(),
        generatedAt: new Date().toISOString(),
      },
      tags: getAllTags(),
      posts: posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        date: p.date,
        excerpt: p.excerpt,
        tags: p.tags,
        cover: p.cover,
        readingTime: p.readingTime,
        pinned: p.pinned,
        url: `/posts/${p.slug}`,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
