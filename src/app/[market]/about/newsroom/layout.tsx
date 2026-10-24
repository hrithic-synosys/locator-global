import type { ReactNode } from "react";
import SoftwareNavbar from "@/components/software/SoftwareNavbar";
import NewsroomSubscribe from "@/components/about/newsroom/NewsroomSubscribe";
import AboutPillarNav from "@/components/about/AboutPillarNav";
import Footer from "@/components/layouts/Footer";

// Keep the site shell mounted during route loading, retries and errors.
export default function NewsroomLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SoftwareNavbar />
      {children}
      <NewsroomSubscribe />
      <AboutPillarNav current="newsroom" />
      <Footer />
    </>
  );
}
