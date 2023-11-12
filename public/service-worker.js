const CACHE_NAME = 'my-sun-app-v10'; // Updated cache name


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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(cacheableUrls);
    }).catch((error) => {
      console.error('Cache.addAll failed:', error);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        if (fetchResponse.status === 200 && cacheableUrls.includes(event.request.url)) {
          const clone = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return fetchResponse;
      });
    })
  );
});

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
