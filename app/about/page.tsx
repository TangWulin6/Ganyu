import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllTags, getPostMetas, getTotalPages } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { tagHref } from "@/components/PostCard";
import { CloudDivider, GlazeLily, IconArrowRight } from "@/components/Deco";

export const metadata: Metadata = {
  title: "关于本站",
  description:
    "关于「甘雨 · 月海亭手记」：站点定位、技术实现、素材来源与授权说明。",
  alternates: { canonical: "/about" },
};

const FACTS = [
  { k: "站点名", v: SITE.fullName },
  { k: "站长", v: SITE.author },
  { k: "建站时间", v: "2026 年 7 月" },
  { k: "技术栈", v: "Next.js App Router · TypeScript · 构建期静态生成" },
  { k: "内容格式", v: "Markdown（gray-matter + marked）" },
  { k: "部署", v: "Vercel Hobby（免费版）" },
  { k: "主题", v: "甘雨 · 麒麟 · 冰元素 · 琉璃百合" },
];

export default function AboutPage() {
  const posts = getPostMetas();
  const tags = getAllTags();
  const totalPages = getTotalPages();

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <h1 className="page-head__title">关于本站</h1>
          <p className="page-head__desc">
            一个以《原神》角色甘雨为主题的个人博客。
            写作、考据、攻略、同人——所有内容都围绕同一个偏执展开。
          </p>
          <CloudDivider
            style={{ width: 240, height: 24, marginTop: 20, color: "var(--ice)" }}
          />
        </header>

        <div className="about-grid" style={{ marginTop: 40 }}>
          <div className="prose">
            <h2>为什么会有这个站</h2>
            <p>
              2021 年冬天，我在璃月港的码头站了很久。那时候甘雨刚上线不久，
              我对着她的角色故事看了一遍又一遍，然后意识到一件事：
              <strong>我喜欢的不只是这个角色的外形，而是她处理矛盾的方式</strong>。
            </p>
            <p>
              一个活了三千多年的人，既不是仙也不是人，既被需要又害怕被需要。
              她没有解决这个问题，她只是每天重新做一次同样的选择。
              这种叙事在游戏里很少见，值得被认真写下来。
            </p>
            <p>
              于是有了这个站。它不追热点、不做搬运，只写我愿意反复回看的东西。
            </p>

            <h2>写什么</h2>
            <ul>
              <li>
                <strong>角色考据</strong> —— 从立绘、角色故事、游戏内文本里挖细节
              </li>
              <li>
                <strong>璃月风物</strong> —— 把游戏场景当成真实城市来观察
              </li>
              <li>
                <strong>攻略心得</strong> —— 不掺水的培养与配队笔记
              </li>
              <li>
                <strong>同人创作</strong> —— 绘画流程、创作复盘、素材观察
              </li>
            </ul>

            <h2>技术实现</h2>
            <p>
              站点使用 Next.js App Router 构建，
              <strong>所有页面在构建期静态生成（SSG）</strong>，
              运行时零动态渲染。Markdown 由 gray-matter 解析元数据、
              marked 渲染正文，代码块经 highlight.js 高亮，标题自动生成锚点与目录。
            </p>
            <p>
              唯一的 Route Handler 是{" "}
              <Link href="/api/posts">/api/posts</Link>
              ，它同样使用 <code>force-static</code>，构建期即产出静态 JSON，
              因此不会消耗 Vercel 免费版的 Serverless 调用配额。
            </p>

            <h2>素材来源与授权</h2>
            <p>
              本站使用的角色立绘、生日贺图、角色名片等美术素材，
              均来自<strong>米哈游官方公开发布</strong>的《原神》相关内容
              （官方角色页、官方社区与官方生日贺图），
              在此仅作评论、介绍与非商业性同人展示之用。
            </p>

            <div className="notice">
              <b>版权声明</b>
              <br />
              本站为个人非商业同人博客，与米哈游（miHoYo / HoYoverse）无任何隶属或合作关系。
              《原神》及其角色形象、美术素材的版权归米哈游所有。
              本站不提供任何素材下载，亦不用于任何商业用途。
              如版权方认为本站内容存在不当使用，请联系站长，将在第一时间处理。
            </div>

            <h2>关于「甘雨同人图」</h2>
            <p>
              有朋友建议我直接抓取网络同人作品做装饰。我没有这么做，
              原因有两个：一是同人作品的权利归创作者个人，未经授权转载并不合适；
              二是<strong>官方素材本身已经足够好</strong>。
              所以本站所有图片均为官方公开美术，配色与版式则由我自己设计。
            </p>
          </div>

          <div className="aside">
            <div className="about-portrait">
              <Image
                src="/images/ganyu-card.png"
                alt="甘雨官方角色立绘"
                width={900}
                height={900}
                sizes="340px"
                priority
              />
            </div>

            <div className="panel">
              <div className="panel__head">站点信息</div>
              <div className="panel__body">
                <div className="fact-list">
                  {FACTS.map((f) => (
                    <div className="fact" key={f.k}>
                      <span className="fact__k">{f.k}</span>
                      <span className="fact__v">{f.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel__head">数据一览</div>
              <div className="panel__body">
                <div className="fact-list">
                  <div className="fact">
                    <span className="fact__k">文章</span>
                    <span className="fact__v">{posts.length} 篇</span>
                  </div>
                  <div className="fact">
                    <span className="fact__k">分页</span>
                    <span className="fact__v">{totalPages} 页</span>
                  </div>
                  <div className="fact">
                    <span className="fact__k">标签</span>
                    <span className="fact__v">{tags.length} 个</span>
                  </div>
                </div>
                <div className="tag-cloud" style={{ marginTop: 16 }}>
                  {tags.map((t) => (
                    <Link key={t.tag} href={tagHref(t.tag)} className="tag">
                      {t.tag}
                      <b>{t.count}</b>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel__head">订阅</div>
              <div className="panel__body">
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--muted)",
                    margin: "0 0 14px",
                    lineHeight: 1.85,
                  }}
                >
                  本站提供 RSS 与 JSON API，欢迎通过阅读器订阅。
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link href="/feed.xml" className="btn btn--outline">
                    RSS
                  </Link>
                  <Link href="/api/posts" className="btn btn--outline">
                    JSON API
                  </Link>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel__body" style={{ textAlign: "center" }}>
                <GlazeLily
                  style={{
                    width: 56,
                    height: 56,
                    margin: "4px auto 10px",
                    color: "var(--ice)",
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.875rem",
                    color: "var(--muted)",
                  }}
                >
                  愿每一次开花，都在无人注视的夜里。
                </div>
                <Link
                  href="/"
                  className="btn btn--primary"
                  style={{ marginTop: 16 }}
                >
                  回到首页
                  <IconArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
