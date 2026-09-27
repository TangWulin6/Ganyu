import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.fullName} · ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "甘雨",
    "原神",
    "Ganyu",
    "同人博客",
    "角色考据",
    "璃月",
    "个人博客",
  ],
  authors: [{ name: SITE.author }],
  creator: SITE.author,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: SITE.fullName,
    title: SITE.fullName,
    description: SITE.description,
    images: [{ url: "/images/hero-splash.png", width: 1600, height: 800 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.fullName,
    description: SITE.description,
    images: ["/images/hero-splash.png"],
  },
  robots: { index: true, follow: true },
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export const viewport = {
  themeColor: "#0d1f31",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a
          href="#main"
          className="btn btn--outline"
          style={{
            position: "absolute",
            left: -9999,
            top: 8,
            zIndex: 100,
          }}
        >
          跳到主内容
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
