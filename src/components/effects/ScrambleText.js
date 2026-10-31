"use client";

// Text effect from the TikTok reference: random glyphs resolve into the real text, left to right.
// - Default: runs once, the first time the element scrolls into view (section headings).
// - startOnLoad: runs once, right after the loading screen has finished (hero text, which is
//   already on screen while the loader covers it, so a scroll trigger would fire unseen).
// The real text is in the HTML from the start, so search engines and screen readers read it normally.

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+/<>=0123456789";

export default function ScrambleText({
  text,
  as: Tag = "span",
  className = "",
  duration = 1300,
  delay = 0,
  startOnLoad = false,
}) {
  const ref = useRef(null);
  const [output, setOutput] = useState(text);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    let delayTimer = 0;

    function run() {
      cancelAnimationFrame(frameId);
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const settled = Math.floor(progress * text.length);
        setOutput(
          text
            .split("")
            .map((char, i) =>
              i < settled || char === " " ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            )
            .join("")
        );
        if (progress < 1) frameId = requestAnimationFrame(tick);
      };
      frameId = requestAnimationFrame(tick);
    }
    const runLater = () => {
      delayTimer = setTimeout(run, delay);
    };

    if (startOnLoad) {
      if (window.__pmiLoaderDone) runLater();
      else window.addEventListener("pmi:loader-done", runLater, { once: true });
      return () => {
        window.removeEventListener("pmi:loader-done", runLater);
        clearTimeout(delayTimer);
        cancelAnimationFrame(frameId);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runLater();
          observer.disconnect(); // scramble only once
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      clearTimeout(delayTimer);
      cancelAnimationFrame(frameId);
    };
  }, [text, duration, delay, startOnLoad]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{output}</span>
    </Tag>
  );
}
