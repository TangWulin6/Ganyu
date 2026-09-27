import Link from "next/link";
import { getAllTags, getPostMetas, getTotalPages } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { QilinMark, IconArrowRight, CloudDivider } from "./Deco";
import { tagHref } from "./PostCard";

export default function Footer() {
  const tags = getAllTags().slice(0, 6);
  const totalPages = getTotalPages();
  const totalPosts = getPostMetas().length;

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <div className="footer__brand">
            <QilinMark />
            {SITE.fullName}
          </div>
          <p className="footer__text">
            {SITE.description}
            <br />
            共 {totalPosts} 篇文章 · {totalPages} 页 · 以 Markdown 写作，构建期静态生成。
          </p>
          <CloudDivider
            style={{ width: 220, height: 22, marginTop: 18, color: "rgba(183,220,243,0.4)" }}
          />
        </div>

        <div>
          <div className="footer__title">导航</div>
          <div className="footer__links">
            <Link href="/">首页</Link>
            <Link href="/tags">全部标签</Link>
            <Link href="/about">关于本站</Link>
            <Link href="/feed.xml">RSS 订阅</Link>
            <Link href="/api/posts">文章 JSON API</Link>
          </div>
        </div>

        <div>
          <div className="footer__title">热门标签</div>
          <div className="footer__links">
            {tags.map(({ tag, count }) => (
              <Link key={tag} href={tagHref(tag)}>
                {tag}（{count}）
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>
          © {new Date().getFullYear()} {SITE.author} · 以热爱构建
        </span>
        <span className="footer__disclaimer">
          {SITE.icp} 本站为非商业个人同人博客，与米哈游无隶属关系。
        </span>
        <Link href="/about" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          素材来源与授权说明 <IconArrowRight style={{ width: 13, height: 13 }} />
        </Link>
      </div>
    </footer>
  );
}
