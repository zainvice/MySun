// service-worker.js

// Cache version
const CACHE_NAME = 'my-react-app-v1';

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

        if (event.request.url.includes('/pages/admin/dashboard.jsx')||event.request.url.includes('/pages/admin/newProject.jsx')||event.request.url.includes('/pages/admin/workers.jsx')||event.request.url.includes('/pages/admin/manageProjects/[id]/index.jsx')||event.request.url.includes('/pages/admin/manageProjects/index.jsx')||event.request.url.includes('/pages/worker/assignedTasks.jsx')||event.request.url.includes('/pages/worker/newTaskAssigned.jsx')) {
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
