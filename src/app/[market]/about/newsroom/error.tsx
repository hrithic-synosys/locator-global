"use client";
import BlogStatus from "@/components/about/newsroom/blog/BlogStatus";
export default function NewsroomError({ reset }: { reset: () => void }) {
  return (
    <main
      style={{
        minHeight: "60vh",
        padding: "clamp(36px,6vw,80px) 24px",
        background: "#fff",
      }}
    >
      <BlogStatus kind="unavailable" headingLevel="h1" onRetry={reset} />
    </main>
  );
}
