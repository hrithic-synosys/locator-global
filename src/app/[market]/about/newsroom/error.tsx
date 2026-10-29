"use client";
import ContentState from "@/components/about/newsroom/ContentState";
import SoftwareNavbar from "@/components/software/SoftwareNavbar";
import Footer from "@/components/layouts/Footer";
export default function NewsroomError({ reset }: { reset: () => void }) {
  return (
    <main style={{ background: "#fff", minHeight: "100vh" }}>
      <SoftwareNavbar />
      <section
        style={{
          maxWidth: 1180,
          margin: "48px auto",
          padding: "0 28px",
          minHeight: 300,
        }}
      >
        <h1 style={{ color: "#16294b", marginBottom: 24 }}>Locator Newsroom</h1>
        <ContentState
          state="unavailable"
          title="We couldn’t open this page"
          description="Please try again, or return to the newsroom to explore more stories."
          href="/about/newsroom"
          onRetry={reset}
        />
      </section>
      <Footer />
    </main>
  );
}
