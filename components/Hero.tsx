import Image from "next/image";
import Link from "next/link";
import { getPostMetas } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { IconArrowRight, IconSnow, Particles } from "./Deco";

export default function Hero() {
  const posts = getPostMetas();
  const tagCount = new Set(posts.flatMap((p) => p.tags)).size;
  const totalMinutes = posts.reduce((sum, p) => sum + p.readingTime, 0);

  const stats = [
    { value: String(posts.length), label: "篇文章" },
    { value: String(tagCount), label: "个标签" },
    { value: `${totalMinutes}`, label: "分钟阅读" },
    { value: "168", label: "株琉璃百合" },
  ];

  return (
    <section className="hero">
      <Particles />

      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="hero__eyebrow">
            <IconSnow />
            循 循 守 月
          </span>

          <h1 className="hero__title">
            把三千年，
            <br />
            过成<em>一天一天</em>。
          </h1>

          <p className="hero__tagline">
            {SITE.tagline}。这里有角色考据、璃月风物的散步笔记、
            不掺水的培养攻略，以及一个普通玩家关于「如何与矛盾共处」的碎碎念。
          </p>

          <div className="hero__actions">
            <Link href="#latest" className="btn btn--primary">
              开始阅读
              <IconArrowRight />
            </Link>
            <Link href="/about" className="btn btn--ghost">
              关于本站
            </Link>
          </div>

          <div className="hero__stats">
            {stats.map((s) => (
              <div className="hero__stat" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__art">
          <Image
            src="/images/hero-splash.png"
            alt="甘雨 · 冰元素"
            width={1600}
            height={800}
            priority
            sizes="(max-width: 900px) 92vw, 620px"
          />
        </div>
      </div>
    </section>
  );
}
