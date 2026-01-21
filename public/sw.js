// Service Worker for Seblak Prasmanan Teh Imas PWA
const CACHE_NAME = "sp-teh-imas-v1";
const STATIC_ASSETS = [
  "/",
  "/order",
  "/checkout",
  "/admin/dashboard",
  "/admin/orders",
  "/admin/revenue",
  "/admin/stock",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install event - cache static assets
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) {
            return name !== CACHE_NAME;
          })
          .map(function (name) {
            return caches.delete(name);
          }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", function (event) {
  var request = event.request;

  // Skip non-GET requests and API calls
  if (request.method !== "GET" || request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(function (response) {
        // Cache successful responses
        if (response.status === 200) {
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(function () {
        // Fallback to cache
        return caches.match(request).then(function (cachedResponse) {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline page for navigation requests
          if (request.mode === "navigate") {
            return caches.match("/");
          }
          return new Response("Offline", { status: 503 });
        });
      }),
  );
});

// Push notification support
self.addEventListener("push", function (event) {
  var data = event.data ? event.data.json() : {};

  var options = {
    body: data.body || "Ada pesanan baru!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [200, 100, 200],
    tag: "order-notification",
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Seblak Teh Imas",
      options,
    ),
  );
});

// Notification click handler
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then(function (clientList) {
      // Focus existing window if available
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url.includes("/admin") && "focus" in client) {
          return client.focus();
        }
      }
      // Open new window
      return self.clients.openWindow("/admin/dashboard");
    }),
  );
});
