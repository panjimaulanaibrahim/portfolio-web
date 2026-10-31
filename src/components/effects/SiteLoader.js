"use client";

// Loading screen with a large percentage counter, as in the TikTok reference.
// The number follows real progress (fonts, page assets, and the hero ID card) and runs
// for at least MIN_DURATION so it never just flashes. It appears once per browser session.

import { useEffect, useState } from "react";

const SESSION_KEY = "pmi-loaded";
const MIN_DURATION = 3000; // ms
const MAX_WAIT = 8000; // ms, safety net on very slow connections

// Tells the hero text it can start animating (ScrambleText with startOnLoad)
function announceDone() {
  window.__pmiLoaderDone = true;
  window.dispatchEvent(new Event("pmi:loader-done"));
}

export default function SiteLoader() {
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduced) {
      const frameId = requestAnimationFrame(() => {
        setRemoved(true);
        announceDone();
      });
      return () => cancelAnimationFrame(frameId);
    }

    const root = document.documentElement;
    root.style.overflow = "hidden"; // no scrolling behind the loader

    const tasks = { fonts: false, page: false, card: Boolean(window.__idcardReady) };
    const doneCount = () => Object.values(tasks).filter(Boolean).length;
    const markDone = (name) => () => {
      tasks[name] = true;
    };

    document.fonts.ready.then(markDone("fonts"));
    const onLoad = markDone("page");
    const onCard = markDone("card");
    if (document.readyState === "complete") tasks.page = true;
    else window.addEventListener("load", onLoad, { once: true });
    window.addEventListener("idcard:ready", onCard, { once: true });

    const safety = setTimeout(() => {
      tasks.fonts = tasks.page = tasks.card = true;
    }, MAX_WAIT);

    const start = performance.now();
    let shown = 0;
    let frameId = 0;
    let removeTimer = 0;

    const tick = (now) => {
      const real = 5 + (doneCount() / 3) * 95;
      const timeCap = Math.min(100, ((now - start) / MIN_DURATION) * 100);
      const goal = Math.min(real, timeCap);
      shown += (goal - shown) * 0.12;
      if (goal - shown < 0.5) shown = goal;
      setProgress(Math.round(shown));

      if (shown >= 100) {
        setFinished(true);
        root.style.overflow = "";
        announceDone();
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // storage blocked: the loader will simply show again next visit
        }
        removeTimer = setTimeout(() => setRemoved(true), 700);
        return;
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(safety);
      clearTimeout(removeTimer);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("idcard:ready", onCard);
      root.style.overflow = "";
    };
  }, []);

  if (removed) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`site-loader fixed inset-0 z-[100] flex items-center justify-center bg-ground transition-opacity duration-700 ${
        finished ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex w-[240px] flex-col items-center gap-4">
        <p className="font-display text-[88px] font-bold leading-none tabular-nums text-heading">
          {progress}
          <span className="ml-1 text-5xl text-[#3b82f6]">%</span>
        </p>
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-line">
          <div className="h-full bg-[#3b82f6]" style={{ width: `${progress}%` }} />
        </div>
        <p className="font-mono text-xs tracking-[0.14em] text-faint">LOADING ASSETS</p>
      </div>
    </div>
  );
}
