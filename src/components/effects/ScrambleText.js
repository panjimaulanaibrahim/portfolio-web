"use client";

// Section-heading effect from the TikTok reference: random glyphs resolve into the real
// text, left to right, only the first time the heading scrolls into view.
// After that the heading just moves with the fade animation of its wrapper.
// The real text is in the HTML from the start, so search engines and screen readers read it normally.

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+/<>=0123456789";
const DURATION = 1300; // ms

export default function ScrambleText({ text, as: Tag = "span", className = "" }) {
  const ref = useRef(null);
  const [output, setOutput] = useState(text);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;

    function run() {
      cancelAnimationFrame(frameId);
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / DURATION);
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          observer.disconnect(); // scramble only once
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [text]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{output}</span>
    </Tag>
  );
}
