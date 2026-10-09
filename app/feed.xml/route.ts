import fs from "node:fs";
import path from "node:path";
import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

/** 构建期生成静态 RSS 文件，运行时零函数调用 */
export const dynamic = "force-static";

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** 正文塞进 CDATA；若正文里本身出现 ]]> 必须拆开，否则 XML 会被截断 */
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

/**
 * 阅读器不会加载站点 CSS，也不认站内相对路径，因此正文需要预处理：
 *   1. 站内链接与图片补成绝对地址，否则图片全部裂开
 *   2. 去掉标题前的 # 锚点（在阅读器里会显示成一个突兀的井号）
 *   3. 图片加内联最大宽度，避免撑破阅读器版面
 */
function prepareForFeed(html: string): string {
  return html
    .replace(/(src|href)="\/(?!\/)/g, `$1="${SITE.url}/`)
    .replace(/<a class="heading-anchor"[^>]*>#<\/a>/g, "")
    .replace(/<img /g, '<img style="max-width:100%;height:auto" ');
}

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

/** <enclosure> 的 length 要求是真实字节数；读不到就退回 0 */
function enclosureLength(publicPath: string): number {
  try {
    return fs.statSync(path.join(process.cwd(), "public", publicPath)).size;
  } catch {
    return 0;
  }
}

const absolute = (p: string) => (/^https?:\/\//.test(p) ? p : `${SITE.url}${p}`);

/**
 * frontmatter 的 date 是纯日期。直接按 00:00+08:00 转 UTC 会变成前一天 16:00，
 * 按 UTC 显示的阅读器就会把文章日期显示成前一天，故取北京时间正午。
 */
const toPubDate = (date: string) => new Date(`${date}T12:00:00+08:00`).toUTCString();

export function GET() {
  const posts = getAllPosts();
  const now = new Date();

  const items = posts
    .map((p) => {
      const url = `${SITE.url}/posts/${p.slug}`;
      const cover = absolute(p.cover);
      const mime = MIME[path.extname(p.cover).toLowerCase()] ?? "image/jpeg";
      const categories = p.tags
        .map((t) => `      <category>${escapeXml(t)}</category>`)
        .join("\n");

      // 元素顺序遵循 RSS 2.0 规范：title → link → description → category →
      // enclosure → guid → pubDate，扩展命名空间元素（dc: / content:）放在最后。
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <description>${escapeXml(p.excerpt)}</description>
${categories}
      <enclosure url="${cover}" type="${mime}" length="${enclosureLength(p.cover)}" />
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toPubDate(p.date)}</pubDate>
      <dc:creator>${escapeXml(p.author)}</dc:creator>
      <content:encoded>${cdata(prepareForFeed(p.html))}</content:encoded>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE.fullName)}</title>
    <link>${SITE.url}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>zh-CN</language>
    <copyright>© ${now.getFullYear()} ${escapeXml(SITE.author)}</copyright>
    <pubDate>${posts.length > 0 ? toPubDate(posts[0].date) : now.toUTCString()}</pubDate>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <generator>Next.js App Router</generator>
    <ttl>60</ttl>
    <image>
      <url>${SITE.url}/images/feed-logo.png</url>
      <title>${escapeXml(SITE.fullName)}</title>
      <link>${SITE.url}</link>
    </image>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // 阅读器按 ttl 每小时轮询一次；CDN 侧也压到 1 小时，
      // 否则发布新文章后订阅源可能一整天都停在旧副本上。
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
