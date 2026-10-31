"use client";

// Full-hero layer for the 3D lanyard card, placed behind the hero text.
// - Laptops and desktops with WebGL: loads the 3D card (on demand) across the whole hero,
//   so it can be dragged anywhere, even behind the text.
// - Phones, reduced motion, or no WebGL: renders nothing; the flat card in HeroCard stays.
// Events: "idcard:3d-ready" tells HeroCard to fade out the flat card,
//         "idcard:ready" tells the loading screen the hero card is ready.

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Lanyard = dynamic(() => import("@/components/three/Lanyard"), { ssr: false });

function announce(name) {
  if (name === "idcard:ready") window.__idcardReady = true;
  if (name === "idcard:3d-ready") window.__idcard3dReady = true;
  window.dispatchEvent(new Event(name));
}

export default function HeroLanyard() {
  const layer = useRef(null);
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      webgl = Boolean(document.createElement("canvas").getContext("webgl2"));
    } catch {
      webgl = false;
    }

    if (wide && !reduced && webgl && layer.current) {
      // The hero section (this layer's parent) receives pointer events for the 3D scene
      const section = layer.current.parentElement;
      const frameId = requestAnimationFrame(() => setEventSource(section));
      return () => cancelAnimationFrame(frameId);
    }
    announce("idcard:ready");
  }, []);

  return (
    <div ref={layer} aria-hidden="true" className="absolute inset-0 z-0">
      {eventSource && (
        <Lanyard
          eventSource={eventSource}
          onReady={() => {
            announce("idcard:3d-ready");
            announce("idcard:ready");
          }}
        />
      )}
    </div>
  );
}
