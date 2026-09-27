import Link from "next/link";
import type { PaginatedPosts } from "@/lib/posts";
import PostCard from "./PostCard";
import Pagination from "./Pagination";
import { IconArrowRight } from "./Deco";

type Props = {
  data: PaginatedPosts;
  /** 首页与分页页共用；page 1 始终指回 / */
  hrefFor: (page: number) => string;
  title?: string;
  subtitle?: string;
};

export default function PostList({ data, hrefFor, title, subtitle }: Props) {
  const { items, page, totalPages, totalPosts } = data;

  // 置顶文章只在第一页以大卡形式突出显示
  const feature = page === 1 ? items.find((p) => p.pinned) : undefined;
  const rest = feature ? items.filter((p) => p.slug !== feature.slug) : items;

  return (
    <section id="latest">
      <div className="section-head">
        <h2 className="section-head__title">{title ?? "最新文章"}</h2>
        <span className="section-head__sub">
          {subtitle ?? `第 ${page} / ${totalPages} 页`}
        </span>
      </div>

      {feature && (
        <div style={{ marginBottom: 24 }}>
          <PostCard post={feature} variant="feature" priority />
        </div>
      )}

      <div className="post-grid">
        {rest.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {items.length === 0 && (
        <div className="empty">
          <p>这里还没有文章。</p>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        totalPosts={totalPosts}
        hrefFor={hrefFor}
      />

      {page === 1 && totalPages > 1 && (
        <div style={{ textAlign: "center", marginTop: 26 }}>
          <Link href={hrefFor(2)} className="btn btn--outline">
            浏览更早的文章
            <IconArrowRight />
          </Link>
        </div>
      )}
    </section>
  );
}
