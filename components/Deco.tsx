import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (p: IconProps) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

/* -------------------------------------------------------------------------- *
 * 品牌标记：麒麟角 + 冰元素
 * -------------------------------------------------------------------------- */
export function QilinMark(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden {...props}>
      <defs>
        <linearGradient id="qm-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b7dcf3" />
          <stop offset="55%" stopColor="#7fc4e8" />
          <stop offset="100%" stopColor="#3a80b8" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill="url(#qm-a)" opacity="0.16" />
      <circle
        cx="24"
        cy="24"
        r="21"
        fill="none"
        stroke="url(#qm-a)"
        strokeWidth="1.4"
        opacity="0.7"
      />
      {/* 双角 */}
      <path
        d="M18 20c-2.6-2.2-4.4-5.2-5-8.6 2.9.9 5.4 2.7 7.2 5.2"
        fill="none"
        stroke="url(#qm-a)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 20c2.6-2.2 4.4-5.2 5-8.6-2.9.9-5.4 2.7-7.2 5.2"
        fill="none"
        stroke="url(#qm-a)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 冰元素雪花 */}
      <g stroke="url(#qm-a)" strokeWidth="1.7" strokeLinecap="round">
        <path d="M24 17v14" />
        <path d="M18 20.5l12 7" />
        <path d="M30 20.5l-12 7" />
      </g>
      <circle cx="24" cy="24" r="2.1" fill="#3a80b8" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- *
 * 通用图标
 * -------------------------------------------------------------------------- */
export const IconCalendar = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);

export const IconClock = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconTag = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 12.5V5a2 2 0 012-2h7.5L21 11.5a2 2 0 010 2.8l-6.7 6.7a2 2 0 01-2.8 0L3 12.5z" />
    <circle cx="7.8" cy="7.8" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const IconArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconArrowLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const IconChevronRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const IconPin = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 17v5" />
    <path d="M9 3h6l-1 5 3.5 3.2a1 1 0 01.3.7V13a1 1 0 01-1 1H7.2a1 1 0 01-1-1v-1.1a1 1 0 01.3-.7L10 8 9 3z" />
  </svg>
);

export const IconSnow = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2v20M4.2 6.5l15.6 11M19.8 6.5l-15.6 11" />
    <path d="M12 6.5l2.6-2M12 6.5l-2.6-2M12 17.5l2.6 2M12 17.5l-2.6 2" />
  </svg>
);

export const IconBook = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5.5A2.5 2.5 0 016.5 3H19v15H6.5A2.5 2.5 0 004 20.5V5.5z" />
    <path d="M19 18v3H6.5A2.5 2.5 0 014 18.5" />
  </svg>
);

export const IconSearch = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.6-3.6" />
  </svg>
);

/* -------------------------------------------------------------------------- *
 * 装饰：琉璃百合 / 云纹分隔
 * -------------------------------------------------------------------------- */
export function GlazeLily(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M32 30c0-9 3-15 0-22-3 7 0 13 0 22z" />
        <path d="M32 30c-6-6-12-7-17-13 1 8 8 12 17 13z" />
        <path d="M32 30c6-6 12-7 17-13-1 8-8 12-17 13z" />
        <path d="M32 30c-7 0-13 2-19 6 7 2 13 0 19-6z" />
        <path d="M32 30c7 0 13 2 19 6-7 2-13 0-19-6z" />
        <path d="M32 30v22" />
      </g>
      <circle cx="32" cy="30" r="3.4" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function CloudDivider(props: IconProps) {
  return (
    <svg viewBox="0 0 240 24" aria-hidden {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M0 16c10 0 14-6 24-6s14 6 24 6 14-6 24-6 14 6 24 6 14-6 24-6 14 6 24 6 14-6 24-6 14 6 24 6 14-6 24-6" />
        <circle cx="120" cy="7" r="3.2" />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- *
 * Hero 冰晶粒子层（纯 CSS 动画，无 JS）
 * -------------------------------------------------------------------------- */
const PARTICLES = [
  { left: "6%", delay: "0s", dur: "13s", size: 5 },
  { left: "17%", delay: "2.4s", dur: "16s", size: 3 },
  { left: "28%", delay: "5.1s", dur: "12s", size: 6 },
  { left: "41%", delay: "1.2s", dur: "18s", size: 4 },
  { left: "53%", delay: "6.8s", dur: "14s", size: 5 },
  { left: "64%", delay: "3.5s", dur: "17s", size: 3 },
  { left: "75%", delay: "8.2s", dur: "13s", size: 6 },
  { left: "86%", delay: "4.4s", dur: "19s", size: 4 },
  { left: "94%", delay: "7.1s", dur: "15s", size: 5 },
];

export function Particles() {
  return (
    <div className="particles" aria-hidden>
      {PARTICLES.map((p, i) => (
        <i
          key={i}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
    </div>
  );
}
