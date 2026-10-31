"use client";

// Scroll animation that follows the scroll direction:
// - scrolling down: the element rises from below as it enters the screen
// - scrolling up:   the element drops in from above
// It hides again after leaving the screen, so it animates every time it comes back.
// as: which HTML tag to render (div, li, article ...). delay: milliseconds, for staggered lists.

import { useEffect, useRef, useState } from "react";

export default function Reveal({ as: Tag = "div", delay = 0, className = "", style, children, ...rest }) {
  const ref = useRef(null);
  const [state, setState] = useState("below"); // "visible" | "above" | "below"

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Reduced motion: CSS already shows the element without animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
        } else {
          // Remember which side it left from, so it comes back from that side
          setState(entry.boundingClientRect.top < 0 ? "above" : "below");
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const stateClass = state === "visible" ? "is-visible" : state === "above" ? "from-above" : "";

  return (
    <Tag
      ref={ref}
      className={`reveal ${stateClass} ${className}`}
      // Stagger only on the way in; hide together on the way out
      style={{ ...style, transitionDelay: state === "visible" ? `${delay}ms` : "0ms" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
