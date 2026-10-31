// TEMPORARY page for step 4.2.
// Navbar and Footer are real; the sections in between are placeholders
// so the menu highlight and smooth scroll can be tested.

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { navLinks } from "@/data/profile";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {navLinks.map((link, index) => {
          const id = link.href.slice(1);
          return (
            <section
              key={id}
              id={id}
              className="mx-auto flex min-h-[80vh] max-w-6xl scroll-mt-24 items-center px-5 pt-24 md:px-8"
            >
              <div className="w-full rounded-2xl border border-dashed border-line-strong p-10">
                <p className="font-mono text-xs tracking-[0.14em] text-label">
                  SEC.{String(index + 1).padStart(2, "0")} / {link.label.toUpperCase()}
                </p>
                <h2 className="mt-3 font-display text-5xl font-bold tracking-tight text-heading">
                  {link.label}
                </h2>
                <p className="mt-3 text-muted">Placeholder. The real section arrives in a later step.</p>
              </div>
            </section>
          );
        })}
      </main>

      <Footer />
    </>
  );
}