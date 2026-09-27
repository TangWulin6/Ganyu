import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/posts";
import { IconCalendar, IconClock, IconPin } from "./Deco";

export function tagHref(tag: string) {
  return `/tags/${encodeURIComponent(tag)}`;
}

type Props = {
  post: PostMeta;
  /** feature 用于置顶大卡 */
  variant?: "default" | "feature";
  /** 列表首图是否优先加载（LCP 优化） */
  priority?: boolean;
};

export default function PostCard({ post, variant = "default", priority }: Props) {
  const isFeature = variant === "feature";

  return (
    <article className={`card${isFeature ? " card--feature" : ""}`}>
      <Link
        href={`/posts/${post.slug}`}
        className="card__cover"
        aria-label={post.title}
        tabIndex={-1}
      >
        <Image
          src={post.cover}
          alt=""
          fill
          sizes={isFeature ? "(max-width: 760px) 100vw, 560px" : "(max-width: 620px) 100vw, 380px"}
          priority={priority}
        />
      </Link>

      <div className="card__body">
        <div className="card__meta">
          {post.pinned && (
            <span className="pin-badge">
              <IconPin />
              置顶
            </span>
          )}
          <span>
            <IconCalendar />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          <span>
            <IconClock />
            {post.readingTime} 分钟
          </span>
        </div>

        <h3 className="card__title">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>

        {post.excerpt && <p className="card__excerpt">{post.excerpt}</p>}

        <div className="card__footer">
          <div className="tag-row">
            {post.tags.slice(0, isFeature ? 3 : 2).map((tag) => (
              <Link key={tag} href={tagHref(tag)} className="tag">
                {tag}
              </Link>
            ))}
          </div>
          <Link href={`/posts/${post.slug}`} className="card__more tag tag--gold">
            阅读
          </Link>
        </div>
      </div>
    </article>
  );
}
