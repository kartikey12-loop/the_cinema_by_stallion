const CACHE_NAME = 'cineverse-v1';
const toCache = [
  '/',
  '/index.html',
  '/movies.html',
  '/events.html',
  '/join.html',
  '/leaderboard.html',
  '/about.html',
  '/contact.html',
  '/css/style.css',
  '/js/script.js',
  '/assets/img/poster-placeholder.jpg',
  '/assets/img/icon-192.png',
  '/assets/img/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(toCache)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); })))
  );
});
