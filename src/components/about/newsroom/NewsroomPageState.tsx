import SoftwareNavbar from "@/components/software/SoftwareNavbar";
import Footer from "@/components/layouts/Footer";
import AboutPillarNav from "@/components/about/AboutPillarNav";
import ContentState from "./ContentState";
import NewsroomHero from "./NewsroomHero";
import NewsroomTicker from "./NewsroomTicker";
import ScrollReveal from "@/components/software/ScrollReveal";

export default function NewsroomPageState({
  newsroom = false,
  unavailable = false,
}: {
  newsroom?: boolean;
  unavailable?: boolean;
}) {
  return (
    <main style={{ background: "#fff", minHeight: "100vh", overflowX: "clip" }}>
      <ScrollReveal />
      {newsroom ? (
        <>
          <NewsroomHero />
          <NewsroomTicker />
        </>
      ) : (
        <SoftwareNavbar />
      )}
      <section
        aria-label={unavailable ? "Article availability" : "Loading articles"}
        style={{
          maxWidth: 1180,
          margin: "clamp(28px,5vw,64px) auto",
          padding: "0 28px",
          minHeight: 300,
        }}
      >
        <ContentState
          headingLevel={newsroom ? 2 : 1}
          state={unavailable ? "unavailable" : "loading"}
          title={
            unavailable
              ? "This article is temporarily unavailable"
              : newsroom
                ? "Preparing the newsroom"
                : "Preparing the latest articles"
          }
          description={
            unavailable
              ? "We can’t load this article right now. Please try again shortly or explore the rest of our newsroom."
              : undefined
          }
          href={unavailable ? "/about/newsroom" : undefined}
        />
      </section>
      <AboutPillarNav current="newsroom" />
      <Footer />
    </main>
  );
}
