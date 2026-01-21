"use client";

import { useEffect } from "react";

export default function AdminPWAWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Register service worker for PWA
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "[Admin PWA] Service Worker registered:",
            registration.scope,
          );
        })
        .catch((error) => {
          console.error(
            "[Admin PWA] Service Worker registration failed:",
            error,
          );
        });
    }
  }, []);

  return <>{children}</>;
}
