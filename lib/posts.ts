import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import hljs from "highlight.js";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** 每页文章数 —— 分页逻辑的唯一真源 */
export const POSTS_PER_PAGE = 6;

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  cover: string;
  author: string;
  readingTime: number;
  pinned: boolean;
};

export type TocItem = { id: string; text: string; depth: 2 | 3 };

export type Post = PostMeta & {
  html: string;
  toc: TocItem[];
};

/* ------------------------------------------------------------------ *
 * 工具函数
 * ------------------------------------------------------------------ */

const decodeEntities = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&");

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** 中英混排的阅读时长估算（中文 320 字/分，英文 200 词/分） */
function estimateReadingTime(markdown: string): number {
  const cjk = (markdown.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = (markdown.match(/[A-Za-z0-9]+/g) || []).length;
  return Math.max(1, Math.round(cjk / 320 + words / 200));
}

/** 标题锚点 id：保留中英文与数字，其余字符丢弃 */
function slugifyHeading(text: string, index: number): string {
  const base = text
    .replace(/<[^>]+>/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}\-_]/gu, "");
  return base || `section-${index}`;
}

/**
 * Markdown → HTML。
 * 在 marked 产出之后做三件增量处理：标题锚点 + 目录、代码高亮、表格包裹。
 */
export function renderMarkdown(markdown: string): { html: string; toc: TocItem[] } {
  const raw = marked.parse(markdown, { gfm: true, breaks: false }) as string;
  const toc: TocItem[] = [];
  let cursor = 0;

  let html = raw.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_match, level: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const id = slugifyHeading(text, cursor++);
      toc.push({ id, text, depth: Number(level) as 2 | 3 });
      return `<h${level} id="${id}"><a class="heading-anchor" href="#${id}" aria-hidden="true">#</a>${inner}</h${level}>`;
    },
  );

  html = html.replace(
    /<pre><code class="language-([\w-]+)">([\s\S]*?)<\/code><\/pre>/g,
    (_match, lang: string, code: string) => {
      const decoded = decodeEntities(code);
      if (hljs.getLanguage(lang)) {
        const highlighted = hljs.highlight(decoded, {
          language: lang,
          ignoreIllegals: true,
        }).value;
        return `<pre class="code-block" data-lang="${escapeHtml(
          lang,
        )}"><code class="hljs language-${lang}">${highlighted}</code></pre>`;
      }
      return `<pre class="code-block" data-lang="${escapeHtml(
        lang,
      )}"><code>${escapeHtml(decoded)}</code></pre>`;
    },
  );

  html = html
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(
      /<a href="(https?:\/\/[^"]+)"/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"',
    );

  return { html, toc };
}

/* ------------------------------------------------------------------ *
 * 文章读取（构建期执行，运行时不产生任何文件 IO）
 * ------------------------------------------------------------------ */

let cache: Post[] | null = null;

function readAll(): Post[] {
  if (cache) return cache;

  if (!fs.existsSync(POSTS_DIR)) {
    cache = [];
    return cache;
  }

  const posts = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const { html, toc } = renderMarkdown(content);

      const meta: PostMeta = {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "1970-01-01",
        excerpt: data.excerpt ?? "",
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        cover: data.cover ?? "/images/cover-1.jpg",
        author: data.author ?? "月海亭书童",
        readingTime: estimateReadingTime(content),
        pinned: Boolean(data.pinned),
      };

      return { ...meta, html, toc };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  cache = posts;
  return posts;
}

export function getAllPosts(): Post[] {
  return readAll();
}

export function getPostMetas(): PostMeta[] {
  return readAll().map(({ html, toc, ...meta }) => meta);
}

export function getPostSlugs(): string[] {
  return readAll().map((p) => p.slug);
}

export function getPostBySlug(slug: string): Post | undefined {
  return readAll().find((p) => p.slug === slug);
}

/** 上一篇 / 下一篇（按时间倒序列表中的相邻项） */
export function getAdjacentPosts(slug: string) {
  const all = readAll();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    // 更新的文章
    prev: i > 0 ? all[i - 1] : undefined,
    // 更早的文章
    next: i < all.length - 1 ? all[i + 1] : undefined,
  };
}

export type TagCount = { tag: string; count: number };

export function getAllTags(): TagCount[] {
  const map = new Map<string, number>();
  for (const post of readAll()) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh"));
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getPostMetas().filter((p) => p.tags.includes(tag));
}

/* ------------------------------------------------------------------ *
 * 分页
 * ------------------------------------------------------------------ */

export type PaginatedPosts = {
  items: PostMeta[];
  page: number;
  totalPages: number;
  totalPosts: number;
};

export function paginatePosts(page: number): PaginatedPosts {
  const all = getPostMetas();
  const totalPages = Math.max(1, Math.ceil(all.length / POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * POSTS_PER_PAGE;

  return {
    items: all.slice(start, start + POSTS_PER_PAGE),
    page: safePage,
    totalPages,
    totalPosts: all.length,
  };
}

export function getTotalPages(): number {
  return Math.max(1, Math.ceil(getPostMetas().length / POSTS_PER_PAGE));
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`;
}
