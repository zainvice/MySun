const CACHE_NAME = 'my-react-app-v3';

const cacheableUrls = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pages/admin/dashboard.jsx',
  '/pages/login.jsx',
  '/pages/forgetPassword.jsx',
  '/pages/admin/newProject.jsx',
  '/pages/admin/workers.jsx',
  '/pages/admin/manageProjects/[id]/index.jsx',
  '/pages/admin/manageProjects/index.jsx',
  '/pages/worker/assignedTasks.jsx',
  '/pages/worker/newTaskAssigned.jsx'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(cacheableUrls);
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
