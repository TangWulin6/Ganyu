import Link from "next/link";
import { IconArrowLeft, IconArrowRight } from "./Deco";

type Props = {
  page: number;
  totalPages: number;
  totalPosts: number;
  /** 生成某页链接；标签页复用该组件时传入自定义函数 */
  hrefFor: (page: number) => string;
};

/** 生成形如 1 … 4 [5] 6 … 12 的页码序列 */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const out: (number | "gap")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) out.push("gap");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("gap");
  out.push(total);

  return out;
}

export default function Pagination({ page, totalPages, totalPosts, hrefFor }: Props) {
  if (totalPages <= 1) {
    return (
      <nav className="pagination" aria-label="分页">
        <span className="pagination__info">
          共 {totalPosts} 篇文章 · 当前仅一页
        </span>
      </nav>
    );
  }

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className="pagination" aria-label="分页导航">
      {hasPrev ? (
        <Link href={hrefFor(page - 1)} className="pagination__btn" aria-label="上一页">
          <IconArrowLeft />
        </Link>
      ) : (
        <span className="pagination__btn" data-disabled="true" aria-hidden>
          <IconArrowLeft />
        </span>
      )}

      {pageWindow(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="pagination__dots">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            className="pagination__btn"
            data-active={p === page}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Link>
        ),
      )}

      {hasNext ? (
        <Link href={hrefFor(page + 1)} className="pagination__btn" aria-label="下一页">
          <IconArrowRight />
        </Link>
      ) : (
        <span className="pagination__btn" data-disabled="true" aria-hidden>
          <IconArrowRight />
        </span>
      )}

      <span className="pagination__info">
        第 {page} / {totalPages} 页 · 共 {totalPosts} 篇文章
      </span>
    </nav>
  );
}
