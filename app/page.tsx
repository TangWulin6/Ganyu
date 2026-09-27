import Hero from "@/components/Hero";
import PostList from "@/components/PostList";
import Sidebar from "@/components/Sidebar";
import { paginatePosts } from "@/lib/posts";

export default function HomePage() {
  const data = paginatePosts(1);

  return (
    <>
      <Hero />
      <div className="page">
        <div className="container layout layout--with-aside">
          <PostList
            data={data}
            hrefFor={(p) => (p === 1 ? "/" : `/page/${p}`)}
          />
          <Sidebar />
        </div>
      </div>
    </>
  );
}
