"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { QilinMark } from "./Deco";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/tags", label: "标签" },
  { href: "/about", label: "关于" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // 路由变化时收起抽屉
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 抽屉打开时锁定滚动
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Link href="/" className="brand" aria-label={`${SITE.fullName} 首页`}>
            <QilinMark className="brand__mark" />
            <span className="brand__text">
              {SITE.name}
              <span className="brand__sub">Ganyu&nbsp;·&nbsp;Notes</span>
            </span>
          </Link>

          <nav className="nav" aria-label="主导航">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav__link"
                data-active={isActive(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav-toggle__bars">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      {open && (
        <div className="drawer" id="mobile-drawer">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="drawer__link"
              data-active={isActive(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
