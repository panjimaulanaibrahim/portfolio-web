"use client";

// Types the text letter by letter, then leaves a blinking cursor. Used for the hero slogan.

import { useEffect, useState } from "react";

export default function Typewriter({ text, startDelay = 700, speed = 65, className = "" }) {
  const [count, setCount] = useState(text.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let intervalId;
    // Clear the text on the next frame, then start typing after the delay
    const frameId = requestAnimationFrame(() => setCount(0));
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setCount((current) => {
          if (current >= text.length) {
            clearInterval(intervalId);
            return current;
          }
          return current + 1;
        });
      }, speed);
    }, startDelay);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, startDelay, speed]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span aria-hidden="true" className="type-cursor ml-0.5 inline-block w-[2px] self-stretch bg-current align-[-0.15em] [height:1.05em]" />
    </span>
  );
}
