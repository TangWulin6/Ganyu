import Link from "next/link";
import { CloudDivider, GlazeLily } from "@/components/Deco";

export default function NotFound() {
  return (
    <div className="page">
      <div className="container container--narrow" style={{ textAlign: "center" }}>
        <GlazeLily
          style={{
            width: 84,
            height: 84,
            margin: "20px auto 18px",
            color: "var(--ice)",
          }}
        />
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.4rem, 8vw, 3.6rem)",
            margin: 0,
            background: "linear-gradient(120deg, var(--ice-deep), var(--ice), var(--gold))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          404
        </h1>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.125rem",
            marginTop: 12,
            color: "var(--ink-soft)",
          }}
        >
          这一页像三千年里被遗忘的某一天。
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>
          你访问的页面不存在，或者已经被移到了别处。
        </p>

        <CloudDivider
          style={{ width: 220, height: 24, margin: "24px auto", color: "var(--ice)" }}
        />

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/" className="btn btn--primary">
            回到首页
          </Link>
          <Link href="/tags" className="btn btn--outline">
            按标签浏览
          </Link>
        </div>
      </div>
    </div>
  );
}
