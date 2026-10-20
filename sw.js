// MobilTV service worker: uygulama kabuğunu önbelleğe alır, yayınlar her zaman ağdan gelir.
const CACHE = 'mobiltv-v2';
const SHELL = ['./', './index.html', './manifest.json', './manifest-ios.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if(url.origin !== location.origin || e.request.method !== 'GET') return;
  // Sayfa ve kabuk: önce ağ, çevrimdışıysa önbellek
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
