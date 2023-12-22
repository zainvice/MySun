importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.3.0/workbox-sw.js');

workbox.setConfig({
  debug: false,  
});

const CACHE_NAME = 'my-sun-app-v15';

const cacheableUrls = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pages/admin/dashboard.jsx',
  '/dashboard',
  '/manage-projects',
  '/favicon.png',
  '/static/js/bundle.js',
  '/workers',
  '/images/stickyNotes.png',
  '/images/avatarFemale.png',
  '/images/avatarMale.png',
  '/images/check.png',
  '/images/ForgetPasswordImg.png',
  '/images/LoginImg.png',
  '/images/logo.png',
  '/images/logo1.png',
  '/images/taskIcon-Ig.png',
  '/images/taskIcon.png',
  '/images/taskico1.png',
  '/images/uploadFile.png',
  '/ForgotPassword',
  '/resetPassword/:resetToken/:userId',
  '/assigned-tasks',
  '/new-task-assigned'
];

workbox.precaching.precacheAndRoute(cacheableUrls);

workbox.routing.registerRoute(
  new RegExp('/static/js/.*\\.js'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'js-cache',
  })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 Days
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /\.(?:css)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'css-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60, // 1 Days
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp('/manifest.json'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'manifest-cache',
  })
);

workbox.routing.registerRoute(
  ({url}) => url.origin,
  new workbox.strategies.NetworkFirst({
    cacheName: 'others-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 24 * 60 * 60, // 1 Day
      }),
    ],
  })
);

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
});
