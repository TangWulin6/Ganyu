import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostList from "@/components/PostList";
import Sidebar from "@/components/Sidebar";
import { getTotalPages, paginatePosts } from "@/lib/posts";

type Params = { page: string };

/** 第 1 页固定由 / 承担，这里只生成 2..N */
export function generateStaticParams(): Params[] {
  const total = getTotalPages();
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

/** 关闭按需生成，避免产生额外的 Serverless 调用 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { page } = await params;
  const total = getTotalPages();
  return {
    title: `第 ${page} 页 · 文章列表`,
    description: `月海亭手记文章列表第 ${page} 页，共 ${total} 页。`,
    alternates: { canonical: `/page/${page}` },
  };
}

export default async function PagedListPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { page } = await params;
  const pageNum = Number(page);

  if (!Number.isInteger(pageNum) || pageNum < 2 || pageNum > getTotalPages()) {
    notFound();
  }

  const data = paginatePosts(pageNum);

  return (
    <div className="page">
      <div className="container layout layout--with-aside">
        <PostList
          data={data}
          hrefFor={(p) => (p === 1 ? "/" : `/page/${p}`)}
          title={`文章列表 · 第 ${pageNum} 页`}
        />
        <Sidebar />
      </div>
    </div>
  );
}
