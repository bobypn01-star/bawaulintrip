// Naikkan angka VERSI setiap kali Anda mengganti file aplikasi, agar HP memuat versi baru
const VERSI = 'v6.2.3';
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
/* v4.7.0: notifikasi pendaftar baru (push dari server) */
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) {}
  e.waitUntil(self.registration.showNotification(d.judul || 'bawaulin.trip', { body: d.isi || '', icon: './icon-192.png', badge: './icon-192.png', tag: 'pendaftar', renotify: true, data: { url: d.url || './?buka=pendaftaran' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const u = new URL((e.notification.data && e.notification.data.url) || './?buka=pendaftaran', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { if ('focus' in c) { c.postMessage({ buka: 'pendaftaran' }); return c.focus(); } }
    return self.clients.openWindow(u);
  }));
});
