"use client";

// Flat ID card in the hero's right column, with a gentle sway.
// Shown on phones always, and on desktop until the 3D card (HeroLanyard) is ready,
// then it fades out so only the 3D card remains.

import { useEffect, useState } from "react";
import IdCard from "./IdCard";

export default function HeroCard() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hide = () => setHidden(true);
    if (window.__idcard3dReady) {
      const frameId = requestAnimationFrame(hide);
      return () => cancelAnimationFrame(frameId);
    }
    window.addEventListener("idcard:3d-ready", hide, { once: true });
    return () => window.removeEventListener("idcard:3d-ready", hide);
  }, []);

  return (
    <div className="relative flex h-full w-full justify-center">
      <div
        className={`idcard-sway transition-opacity duration-700 md:pt-4 ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <IdCard />
      </div>
    </div>
  );
}
