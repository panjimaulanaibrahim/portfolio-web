"use client";

// Google Analytics 4: counts visits, countries, devices and where visitors came from.
// Loads only on the live website, so testing on localhost does not add fake visits.
// Reports: analytics.google.com (or the Google Analytics phone app), property "panjimaulana.web.app".

import { useEffect } from "react";

export const GA_MEASUREMENT_ID = "G-TLF2BTESLD";
const LIVE_HOSTS = ["panjimaulana.web.app", "panjimaulana.firebaseapp.com"];

export default function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !LIVE_HOSTS.includes(window.location.hostname)) return;
    if (window.gtag) return; // already loaded

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }, []);

  return null;
}
