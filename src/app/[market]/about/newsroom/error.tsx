"use client";
import Link from "@/components/country/CountryLink";
export default function NewsroomError() {
  return (
    <section
      role="alert"
      style={{ maxWidth: 760, margin: "80px auto", padding: 28 }}
    >
      <h1>Blog temporarily unavailable</h1>
      <p>We could not load the blog. Please try again shortly.</p>
      <button type="button" onClick={() => window.location.reload()}>
        Try again
      </button>{" "}
      <Link href="/about/newsroom">Back to newsroom</Link>
    </section>
  );
}
