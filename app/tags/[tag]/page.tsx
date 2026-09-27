import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostList from "@/components/PostList";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { tagHref } from "@/components/PostCard";
import { CloudDivider, IconChevronRight } from "@/components/Deco";

type Params = { tag: string };

export function generateStaticParams(): Params[] {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export const dynamicParams = false;

/** 动态路由中的中文参数做一次安全解码 */
function normalize(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tag } = await params;
  const name = normalize(tag);
  const count = getPostsByTag(name).length;
  if (count === 0) return { title: "标签未找到" };

  return {
    title: `标签：${name}`,
    description: `「${name}」标签下的全部 ${count} 篇文章。`,
    alternates: { canonical: `/tags/${encodeURIComponent(name)}` },
  };
}

export default async function TagDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tag } = await params;
  const name = normalize(tag);
  const posts = getPostsByTag(name);

  if (posts.length === 0) notFound();

  const allTags = getAllTags();
  const current = allTags.find((t) => t.tag === name);

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <nav className="breadcrumb" style={{ color: "var(--muted)" }} aria-label="面包屑">
            <Link href="/">首页</Link>
            <IconChevronRight />
            <Link href="/tags">标签</Link>
          </nav>

          <h1 className="page-head__title">
            <span style={{ color: "var(--ice-deep)" }}>#</span> {name}
          </h1>
          <p className="page-head__desc">
            该标签下共 {current?.count ?? posts.length} 篇文章。
            共 {allTags.length} 个标签，可随时切换。
          </p>

          <CloudDivider
            style={{ width: 240, height: 24, marginTop: 20, color: "var(--ice)" }}
          />
        </header>

        <div className="tag-row" style={{ margin: "24px 0 8px" }}>
          {allTags.map((t) => (
            <Link
              key={t.tag}
              href={tagHref(t.tag)}
              className={`tag${t.tag === name ? " tag--gold" : ""}`}
            >
              {t.tag}
              <b style={{ opacity: 0.6, fontSize: "0.6875rem" }}>{t.count}</b>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 32 }}>
          <PostList
            data={{
              items: posts,
              page: 1,
              totalPages: 1,
              totalPosts: posts.length,
            }}
            hrefFor={() => tagHref(name)}
            title={`「${name}」下的文章`}
            subtitle={`共 ${posts.length} 篇`}
          />
        </div>
      </div>
    </div>
  );
}
