// Page assembly in final section order.

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Certifications from "@/components/sections/Certifications";
import Education from "@/components/sections/Education";
import PlaylistSection from "@/components/sections/PlaylistSection";
import Contact from "@/components/sections/Contact";
import Starfield from "@/components/effects/Starfield";
import SiteLoader from "@/components/effects/SiteLoader";

export default function Home() {
  return (
    <>
      <SiteLoader />
      <Starfield />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Certifications />
          <Education />
          <PlaylistSection />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
