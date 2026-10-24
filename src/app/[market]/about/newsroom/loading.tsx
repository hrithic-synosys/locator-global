import BlogSkeleton from "@/components/about/newsroom/blog/BlogSkeleton";

export default function NewsroomLoading() {
  return (
    <main style={{ minHeight: "65vh", background: "#f7f9fc" }}>
      <BlogSkeleton />
    </main>
  );
}
