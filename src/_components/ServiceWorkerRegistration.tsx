"use client";

import { useEffect } from "react";
import { Workbox } from "workbox-window";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const wb = new Workbox("/app/sw.js");
      wb.register();
    }
  }, []);

  return null; // This component doesn't render anything
}
