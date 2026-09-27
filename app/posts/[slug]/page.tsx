import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatDate,
  getAdjacentPosts,
  getPostBySlug,
  getPostSlugs,
} from "@/lib/posts";
import { SITE } from "@/lib/site";
import { tagHref } from "@/components/PostCard";
import {
  IconCalendar,
  IconChevronRight,
  IconClock,
  IconTag,
} from "@/components/Deco";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPostSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "文章未找到" };

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: post.cover }],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    keywords: post.tags.join(", "),
    publisher: { "@type": "Organization", name: SITE.fullName },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="article-head">
        <div className="container">
          <div className="article-head__inner">
            <nav className="breadcrumb" aria-label="面包屑">
              <Link href="/">首页</Link>
              <IconChevronRight />
              <span>文章</span>
            </nav>

            <h1 className="article-head__title">{post.title}</h1>

            <div className="article-head__meta">
              <span>
                <IconCalendar />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </span>
              <span>
                <IconClock />
                约 {post.readingTime} 分钟
              </span>
              <span>
                <IconTag />
                {post.tags.length} 个标签
              </span>
              <span>{post.author}</span>
            </div>

            <div className="tag-row">
              {post.tags.map((tag) => (
                <Link key={tag} href={tagHref(tag)} className="tag">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="article-layout">
          <article>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />

            <footer className="article-foot">
              <p className="article-foot__note">
                本文由 {post.author} 撰写，采用 Markdown 编写、构建期静态生成。
                转载请注明出处。
              </p>

              <nav className="adjacent" aria-label="相邻文章">
                {prev ? (
                  <Link href={`/posts/${prev.slug}`} className="adjacent__item">
                    <div className="adjacent__label">← 更新的一篇</div>
                    <div className="adjacent__title">{prev.title}</div>
                  </Link>
                ) : (
                  <div className="adjacent__item adjacent__item--empty">
                    已经是最新一篇
                  </div>
                )}

                {next ? (
                  <Link href={`/posts/${next.slug}`} className="adjacent__item">
                    <div className="adjacent__label">更早的一篇 →</div>
                    <div className="adjacent__title">{next.title}</div>
                  </Link>
                ) : (
                  <div className="adjacent__item adjacent__item--empty">
                    已经是最早一篇
                  </div>
                )}
              </nav>
            </footer>
          </article>

          {post.toc.length > 0 && (
            <nav className="toc" aria-label="目录">
              <div className="toc__title">本页目录</div>
              <ul className="toc__list">
                {post.toc.map((item) => (
                  <li
                    key={item.id}
                    className="toc__item"
                    data-depth={item.depth}
                  >
                    <a href={`#${item.id}`}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
