import Image from "next/image";
import Link from "next/link";
import { getAllTags, getPostMetas } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { tagHref } from "./PostCard";

export default function Sidebar() {
  const tags = getAllTags();
  const latest = getPostMetas().slice(0, 5);

  return (
    <aside className="aside" aria-label="侧边栏">
      {/* 作者卡 */}
      <div className="panel author-card">
        <div className="author-card__banner" />
        <Image
          src="/images/cover-1.jpg"
          alt={SITE.author}
          width={84}
          height={84}
          className="author-card__avatar"
        />
        <div className="author-card__name">{SITE.author}</div>
        <div className="author-card__role">月海亭 · 值夜人</div>
        <p className="author-card__bio">{SITE.authorBio}</p>
      </div>

      {/* 名片装饰 */}
      <div className="panel">
        <div className="panel__head">角色名片</div>
        <div className="panel__body">
          <div className="namecard">
            <Image
              src="/images/namecard.png"
              alt="甘雨·麟迹 名片"
              width={840}
              height={400}
              sizes="300px"
            />
            <span className="namecard__cap">甘雨 · 麟迹</span>
          </div>
        </div>
      </div>

      {/* 标签云 */}
      <div className="panel">
        <div className="panel__head">标签</div>
        <div className="panel__body">
          <div className="tag-cloud">
            {tags.map(({ tag, count }) => (
              <Link key={tag} href={tagHref(tag)} className="tag">
                {tag}
                <b>{count}</b>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 最新文章 */}
      <div className="panel">
        <div className="panel__head">最新</div>
        <div className="panel__body">
          <div className="mini-list">
            {latest.map((post, i) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="mini-list__item"
              >
                <span className="mini-list__idx">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mini-list__title">{post.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
