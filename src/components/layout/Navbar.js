"use client";

import { useEffect, useState } from "react";
import { navLinks, profile } from "@/data/profile";
import { CloseIcon, MenuIcon, PinIcon } from "@/components/ui/icons";

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Give the bar a solid, blurred background once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the menu item of the section currently in view
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Close the phone menu with the Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid ? "border-line/60 bg-ground/80 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a href="#home" className="font-display text-xl font-bold tracking-wide text-fg">
          PMI<span className="text-accent">.</span>
        </a>

        {/* Desktop: pill menu */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-1 rounded-full border border-line bg-panel/75 p-1.5">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`block rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? "bg-line text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop: location badge */}
        <span className="hidden items-center gap-2 font-mono text-xs tracking-[0.1em] text-faint md:flex">
          <PinIcon width={14} height={14} className="text-accent-light" />
          {profile.location.toUpperCase()}
        </span>

        {/* Phone: menu button */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-line bg-panel text-fg md:hidden"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Phone: dropdown menu */}
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-line/60 px-5 pb-6 md:hidden">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-line/50 py-4 font-display text-2xl font-semibold ${
                    active === link.href.slice(1) ? "text-heading" : "text-muted"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-center gap-2 font-mono text-xs tracking-[0.1em] text-faint">
            <PinIcon width={14} height={14} className="text-accent-light" />
            {profile.location.toUpperCase()}
          </p>
        </nav>
      )}
    </header>
  );
}