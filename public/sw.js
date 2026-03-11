// Service Worker for Push Notifications
const CACHE_NAME = 'doit4jesus-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Time to pray the rosary!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/app/dashboard',
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'pray-now',
        title: 'Pray Now',
        icon: '/icon-pray.png',
      },
      {
        action: 'remind-later',
        title: 'Remind Later',
        icon: '/icon-clock.png',
      },
    ],
    tag: data.tag || 'daily-reminder',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'DoIt4Jesus', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'pray-now') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/app/dashboard')
    );
  } else if (event.action === 'remind-later') {
    // Schedule another notification in 1 hour
    setTimeout(() => {
      self.registration.showNotification('DoIt4Jesus Reminder', {
        body: "Don't forget to pray your rosary today!",
        icon: '/icon-192x192.png',
      });
    }, 3600000); // 1 hour
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/app/dashboard')
    );
  }
});
