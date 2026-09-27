import type { NextConfig } from "next";

/**
 * Vercel 免费版（Hobby）适配要点：
 * 1. images.unoptimized = true —— 关闭运行时图片优化，直接吃 `next build` 时
 *    就已经用 sips 压好的静态资源。这样既不消耗 Hobby 每月 5,000 次
 *    Image Optimization 配额，也让整站产物完全静态化。
 * 2. 不开启 output: 'export'（静态导出），因为站点保留了一个 /api/posts
 *    路由用于演示 Route Handler；该路由使用 force-static，构建期即产出
 *    静态 JSON，运行时零 Serverless 调用。
 * 3. 未使用任何 ISR / revalidate / middleware，避免 Hobby 的函数调用与
 *    边缘请求配额消耗。
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // 显式指定 Turbopack 根目录，避免构建时向上扫描到上层目录的 lockfile
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true,
  },
  // 构建产物中只保留必要的 sourcemap 行为，减小 .next 体积
  productionBrowserSourceMaps: false,
};

export default nextConfig;
