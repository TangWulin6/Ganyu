# 甘雨 · 月海亭手记

以《原神》角色**甘雨**为主题元素的个人博客站点。深靛夜色 + 冰蓝月白 + 鎏金点缀的视觉体系，官方立绘与生日贺图作为装饰素材，内容以 Markdown 写作、构建期静态生成。

---

## 一、页面与功能

| 路由 | 说明 | 渲染方式 |
| --- | --- | --- |
| `/` | 首页：Hero 主视觉 + 置顶大卡 + 文章网格 + 侧边栏（第 1 页） | 静态生成 |
| `/page/[page]` | 文章列表分页（每页 6 篇） | SSG |
| `/posts/[slug]` | 文章详情：Markdown 渲染 + 代码高亮 + 目录 + 上下篇导航 | SSG |
| `/tags` | 标签总览（含各标签文章数预览） | 静态生成 |
| `/tags/[tag]` | 按标签筛选的文章列表 | SSG |
| `/about` | 关于页：站点定位、技术实现、素材来源与版权声明 | 静态生成 |
| `/api/posts` | 全站文章 JSON API（唯一 Route Handler） | `force-static` |
| `/feed.xml` | RSS 订阅 | `force-static` |
| `/sitemap.xml`、`/robots.txt` | SEO | 静态生成 |
| `*` | 404 页 | 静态生成 |

### 内容能力

- **Markdown 渲染**：`gray-matter` 解析 frontmatter，`marked` 渲染正文
- **代码高亮**：`highlight.js`，配套冰蓝主题配色
- **标题锚点 + 自动目录**：`h2` / `h3` 自动生成 id，文章页右侧生成 sticky 目录
- **富文本元素**：表格（横向滚动包裹）、引用块、列表、图片、外链（自动 `target=_blank rel=noopener`）
- **分页**：页码窗口算法（`1 … 4 5 6 … 12`），上一页/下一页在边界处禁用
- **置顶文章**：`pinned: true` 的文章在第一页以大卡形式突出显示
- **响应式**：移动端汉堡抽屉导航，1024px 以下侧边栏下沉，文章页 1080px 以下隐藏目录

---

## 二、技术栈

- **框架**：Next.js 16（App Router，Turbopack 构建）
- **语言**：TypeScript
- **样式**：原生 CSS（CSS 自定义属性 + 媒体查询），无 UI 框架依赖
- **内容**：Markdown 文件（`content/posts/*.md`）
- **解析**：`gray-matter` + `marked` + `highlight.js`

---

## 三、目录结构

```
ganyu-blog/
├── app/
│   ├── layout.tsx              # 根布局：Header / Footer / 全局元数据
│   ├── globals.css             # 设计令牌与全部样式
│   ├── page.tsx                # 首页（第 1 页）
│   ├── page/[page]/page.tsx    # 分页
│   ├── posts/[slug]/page.tsx   # 文章详情
│   ├── tags/page.tsx           # 标签总览
│   ├── tags/[tag]/page.tsx     # 标签筛选
│   ├── about/page.tsx          # 关于
│   ├── api/posts/route.ts      # JSON API（force-static）
│   ├── feed.xml/route.ts       # RSS（force-static）
│   ├── sitemap.ts / robots.ts  # SEO
│   └── not-found.tsx           # 404
├── components/
│   ├── Header.tsx              # 导航（客户端组件，含移动端抽屉）
│   ├── Footer.tsx
│   ├── Hero.tsx                # 首页主视觉 + 冰晶粒子
│   ├── PostCard.tsx            # 文章卡片（default / feature 两种形态）
│   ├── PostList.tsx            # 列表 + 分页组合
│   ├── Pagination.tsx          # 分页器
│   ├── Sidebar.tsx             # 作者卡 / 角色名片 / 标签云 / 最新文章
│   └── Deco.tsx                # SVG 图标与装饰（麒麟角标记、琉璃百合、云纹、粒子）
├── content/posts/              # 8 篇 Markdown 文章
├── lib/
│   ├── posts.ts                # 文章读取、Markdown 渲染、分页、标签聚合
│   └── site.ts                 # 站点常量
├── public/images/              # 立绘、贺图、名片等装饰素材
├── next.config.ts
├── vercel.json
└── tsconfig.json
```

---

## 四、本地运行

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 生产构建
npm start        # 本地预览构建产物
```

---

## 五、新增文章

在 `content/posts/` 下新建 `.md` 文件即可，文件名即 URL slug：

```markdown
---
title: "文章标题"
date: "2026-09-27"
excerpt: "列表页与 SEO 用的摘要。"
tags: ["角色考据", "璃月风物"]
cover: "/images/cover-1.jpg"
author: "月海亭书童"
pinned: false
---

正文使用 Markdown 书写。
```

新增文章后，**首页、分页、标签页、RSS、sitemap 会在下次构建时自动更新**，无需改动任何代码。

---

## 六、部署到 Vercel

```bash
# 方式一：Git 集成（推荐）
git init && git add -A && git commit -m "init"
# 推送到 GitHub 后在 Vercel 导入仓库，框架会被自动识别为 Next.js

# 方式二：CLI
npx vercel        # 预览部署
npx vercel --prod # 生产部署
```

无需配置任何环境变量。

---

## 七、Vercel 免费版（Hobby）配额适配

Hobby 免费版的限制是**硬上限**：超限后不会自动计费，而是**暂停部署、函数停止执行**。因此本项目的核心策略是——**把运行时消耗压到 0**。

### 7.1 配额对照与本项目的实测占用

| Hobby 限制项 | 免费版上限 | 本项目占用 | 说明 |
| --- | --- | --- | --- |
| Serverless 函数调用 | 100,000 次/月 | **0** | 所有页面 + 2 个 Route Handler 全部构建期静态化 |
| 函数最长执行时间 | 10 秒 | 不适用 | 无任何运行时函数 |
| 带宽 | 100 GB/月 | 约 1.4 MB / 次首屏 | 约可支撑 7 万+ 次完整访问 |
| 图片优化源图 | 1,000 张/月 | **0** | `images.unoptimized = true`，直接用预优化静态图 |
| 构建时长 | 6,000 分钟/月 | 约 10 秒 | 单次构建远低于上限 |
| 并发构建 | 1 | 1 | 个人博客无并发需求 |
| 部署次数 | 100 次/天 | — | 常规使用远低于上限 |
| 函数体积 | 50 MB | 不适用 | 无 Serverless 函数产物 |
| 团队席位 | 1 | 1 | 个人站点 |
| 商业使用 | 禁止 | 符合 | 个人非商业同人博客 |

### 7.2 具体做法

**① 全站静态生成，零 SSR**

所有页面使用 `generateStaticParams` + `dynamicParams = false`。构建产物中每条路由都被标记为 `○ (Static)` 或 `● (SSG)`，没有任何 `ƒ (Dynamic)`：

```
Route (app)
┌ ○ /                        ├ ○ /about              ├ ○ /api/posts
├ ○ /_not-found              ├ ○ /feed.xml           ├ ○ /robots.txt
├ ● /page/[page]             ├ ○ /sitemap.xml        ├ ○ /tags
├ ● /posts/[slug]            └ ● /tags/[tag]
```

**② Route Handler 也静态化**

`/api/posts` 与 `/feed.xml` 都声明了 `export const dynamic = "force-static"`，响应在 `next build` 阶段就固化成静态文件，由 CDN 直接返回，**不产生任何函数调用**。这正是应对「API 路由限制」的关键：Route Handler 可以用，但要让它静态。

**③ 关闭运行时图片优化**

`next.config.ts` 中设置 `images.unoptimized = true`。装饰素材已在上游用 `sips` 完成尺寸与格式优化（760–1600px、JPEG q82），因此无需消耗 Hobby 每月 1,000 张的图片优化配额。同时在 `vercel.json` 中为 `/images/*` 设置一年期 immutable 缓存头，让图片走 CDN 边缘缓存。

**④ 不使用 middleware / ISR / Edge Functions**

`middleware.ts` 会在**每一次请求**上触发函数调用，是免费版配额最常见的隐形杀手。本项目完全没有使用，也没有配置任何 `revalidate`。

**⑤ 未开启 `output: 'export'`**

刻意保留了一个 Route Handler 用于演示 API 路由能力。如果希望产物是**纯静态目录**（可直接托管在任意静态服务上），在 `next.config.ts` 中加上 `output: "export"` 并删除 `app/api/` 即可 —— 届时 `next build` 会产出 `out/` 目录，Vercel 配额消耗将仅剩带宽一项。

### 7.3 什么情况下会触碰上限

按当前体积，100 GB 带宽约对应 **7 万次**完整首屏访问。真正需要警惕的场景是：

- 单篇文章被大量转载、短时间涌入数万访问（带宽突增）
- 后续自行加入了 middleware 或把页面改成 SSR / ISR
- 大量新增高清大图（每张立绘 800KB–1MB 量级）

若出现上述情况，优先做的是**给 Hero 主视觉换成 WebP**，而不是升级套餐 —— 单这一项就能把首屏压掉约 60%。

---

## 八、素材来源与版权

本站使用的角色立绘、生日贺图、角色名片等美术素材，均来自**米哈游官方公开发布**的《原神》相关内容：

| 文件 | 内容 |
| --- | --- |
| `hero-splash.png` | 甘雨官方抽卡立绘（透明背景，2048×1024 原图） |
| `ganyu-card.png` | 甘雨官方角色卡 |
| `ganyu-full.jpg` | 甘雨官方全身立绘 |
| `namecard.png` | 甘雨·麟迹 官方名片 |
| `cover-1…6.jpg` | 官方生日贺图与节日贺图（2021–2025） |

> **版权声明**：本站为个人非商业同人博客，与米哈游（miHoYo / HoYoverse）无任何隶属或合作关系。《原神》及其角色形象、美术素材版权归米哈游所有。本站不提供素材下载，不用于任何商业用途。
>
> **关于同人作品**：站点装饰**未使用**任何网络同人画作。同人作品的权利归创作者个人，未经授权转载并不合适，因此本站仅采用官方公开美术，配色与版式由项目自行设计。

---

## 九、可选的进一步优化

- Hero 主视觉转 WebP（当前 900 KB PNG → 约 350 KB），可显著改善移动端 LCP
- 为文章卡片图生成多种尺寸并配置 `srcset`（需重新启用图片优化或预生成多份）
- 接入 Vercel Analytics 观察真实带宽走势（免费版含 50,000 事件/月）
- 增加全文搜索（建议构建期生成静态索引 + 客户端检索，避免引入 Serverless）
