// LED Dot Creator service worker  ver a7fa9cf884
const SHELL = 'ldc-shell-a7fa9cf884', PARTS = 'ldc-parts-v1';
const CORE = ['./', 'index.html', 'index.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'favicon.ico'];
self.addEventListener('install', e => { e.waitUntil(caches.open(SHELL).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('ldc-shell-') && k !== SHELL).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if(e.request.method !== 'GET' || u.origin !== location.origin) return;
  const big = /(voice|camera)[^/]*\.(js|bin)$/.test(u.pathname);
  if(big){ // 大きい部品: 一度読んだら保存して、次からは保存したものを使う
    e.respondWith(caches.open(PARTS).then(c => c.match(e.request).then(r => r || fetch(e.request).then(n => { if(n.ok) c.put(e.request, n.clone()); return n; })))); return; }
  // 本体: ネットにつながれば新しいものを、つながらなければ保存したものを
  e.respondWith(fetch(e.request).then(n => { if(n.ok){ const cp = n.clone(); caches.open(SHELL).then(c => c.put(e.request, cp)); } return n; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
