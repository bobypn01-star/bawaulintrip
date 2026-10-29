// Naikkan angka VERSI setiap kali Anda mengganti file aplikasi, agar HP memuat versi baru
const VERSI = 'v2.2.0';
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './logo.png', './logo-cash.png', './bg.png', './daftar.html'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSI).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSI).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(VERSI).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
