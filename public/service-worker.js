// service-worker.js

// Cache version
const CACHE_NAME = 'my-react-app-v2';

// List of files to cache
const filesToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {

        if (event.request.url.includes('/pages/admin/dashboard.jsx')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
            console.log('Clonned!')
          });
        }
        return response;
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  const requestedUrl = new URL(event.request.url);

  if (
    requestedUrl.pathname.includes('/pages/admin/dashboard.jsx') ||
    requestedUrl.pathname.includes('/pages/admin/newProject.jsx') ||
    requestedUrl.pathname.includes('/pages/admin/workers.jsx') ||
    requestedUrl.pathname.includes('/pages/admin/manageProjects/[id]/index.jsx') ||
    requestedUrl.pathname.includes('/pages/admin/manageProjects/index.jsx') ||
    requestedUrl.pathname.includes('/pages/worker/assignedTasks.jsx') ||
    requestedUrl.pathname.includes('/pages/worker/newTaskAssigned.jsx')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            return response; // Cache hit, return the cached response
          }

          // If not found in cache, fetch and cache the requested URL
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              const clone = response.clone();
              cache.put(event.request, clone);
            }
            return response;
          });
        });
      })
    );
  }
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
