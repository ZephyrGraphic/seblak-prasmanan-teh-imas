"use client";

import { useEffect } from "react";

export function usePWA() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration.scope);

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log("[PWA] New version available");
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("[PWA] Service Worker registration failed:", error);
        });
    }

    // Handle beforeinstallprompt for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("[PWA] Install prompt available");
      // Store the event for later use
      (window as unknown as { deferredPrompt: Event }).deferredPrompt = e;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);
}

export function PWAInstallPrompt() {
  const handleInstall = async () => {
    const deferredPrompt = (
      window as unknown as {
        deferredPrompt?: {
          prompt: () => void;
          userChoice: Promise<{ outcome: string }>;
        };
      }
    ).deferredPrompt;
    if (!deferredPrompt) {
      alert(
        "Untuk install aplikasi, gunakan menu browser: 'Add to Home Screen' atau 'Install App'",
      );
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("[PWA] Install outcome:", outcome);
    (window as unknown as { deferredPrompt: undefined }).deferredPrompt =
      undefined;
  };

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
    >
      <span className="material-symbols-outlined text-lg">download</span>
      Install App
    </button>
  );
}
