"use client";

// Thumbnail that opens the full image enlarged on top of the page (no new tab).
// Close it with the X button, the Esc key, a click outside the image, or the browser's Back button;
// the visitor stays at the same spot on the page.

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ImageLightbox({ src, alt, label, className = "", children }) {
  const [open, setOpen] = useState(false);
  const pushedHistory = useRef(false);
  const closeButton = useRef(null);
  const trigger = useRef(null);

  const close = useCallback(() => {
    // If opening added a history entry, go back so the Back button stays in sync
    if (pushedHistory.current) {
      pushedHistory.current = false;
      window.history.back();
    } else {
      setOpen(false);
    }
  }, []);

  function show() {
    window.history.pushState({ lightbox: true }, "");
    pushedHistory.current = true;
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => event.key === "Escape" && close();
    const onPop = () => {
      pushedHistory.current = false;
      setOpen(false);
    };
    const opener = trigger.current;
    document.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    document.documentElement.style.overflow = "hidden"; // no page scroll behind the image
    closeButton.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      document.documentElement.style.overflow = "";
      opener?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button ref={trigger} type="button" onClick={show} aria-label={label} className={`cursor-zoom-in ${className}`}>
        {children}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={close}
          className="lightbox-in fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(3,5,10,0.88)] p-4 backdrop-blur-sm md:p-10"
        >
          <div className="relative h-full max-h-[86vh] w-full max-w-[1200px]">
            <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" onClick={(e) => e.stopPropagation()} />
          </div>
          <button
            ref={closeButton}
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-panel text-fg transition-colors hover:border-accent-light md:right-8 md:top-8"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
