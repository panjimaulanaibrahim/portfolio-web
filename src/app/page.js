// Page assembly. Hero is real; the remaining sections are placeholders until later steps.

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import { navLinks } from "@/data/profile";

function Placeholder({ id, label, index }) {
  return (
    <section id={id} className="mx-auto flex min-h-[70vh] max-w-6xl scroll-mt-24 items-center px-5 md:px-8">
      <div className="w-full rounded-2xl border border-dashed border-line-strong p-10">
        <p className="font-mono text-xs tracking-[0.14em] text-label">
          SEC.{String(index).padStart(2, "0")} / {label.toUpperCase()}
        </p>
        <h2 className="mt-3 font-display text-5xl font-bold tracking-tight text-heading">{label}</h2>
        <p className="mt-3 text-muted">Placeholder. The real section arrives in a later step.</p>
      </div>
    </section>
  );
}

export default function Home() {
  const remaining = navLinks.filter((link) => link.href !== "#home");

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {remaining.map((link, i) => (
          <Placeholder key={link.href} id={link.href.slice(1)} label={link.label} index={i + 2} />
        ))}
      </main>
      <Footer />
    </>
  );
}