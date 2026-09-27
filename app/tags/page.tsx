import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags, getPostMetas } from "@/lib/posts";
import { tagHref } from "@/components/PostCard";
import { CloudDivider, IconTag } from "@/components/Deco";

export const metadata: Metadata = {
  title: "全部标签",
  description: "按标签浏览月海亭手记的全部文章：角色考据、璃月风物、攻略心得、同人创作等。",
  alternates: { canonical: "/tags" },
};

export default function TagsPage() {
  const tags = getAllTags();
  const posts = getPostMetas();

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <h1 className="page-head__title">全部标签</h1>
          <p className="page-head__desc">
            共 {tags.length} 个标签，覆盖 {posts.length} 篇文章。
            点击任意标签即可筛选出该主题下的全部内容。
          </p>
          <CloudDivider
            style={{ width: 240, height: 24, marginTop: 20, color: "var(--ice)" }}
          />
        </header>

        <div className="tag-index" style={{ marginTop: 36 }}>
          {tags.map(({ tag, count }) => {
            const titles = posts
              .filter((p) => p.tags.includes(tag))
              .slice(0, 3)
              .map((p) => p.title);

            return (
              <Link key={tag} href={tagHref(tag)} className="tag-card">
                <div className="tag-card__top">
                  <span className="tag-card__name">
                    <IconTag
                      style={{
                        width: 15,
                        height: 15,
                        display: "inline",
                        verticalAlign: -2,
                        marginRight: 6,
                        color: "var(--ice-deep)",
                      }}
                    />
                    {tag}
                  </span>
                  <span className="tag-card__count">{count} 篇</span>
                </div>
                <div className="tag-card__list">
                  {titles.map((t) => (
                    <div key={t}>· {t}</div>
                  ))}
                  {count > 3 && <div style={{ opacity: 0.6 }}>…</div>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
