/* JY STUDIO 관리자 앱 — Service Worker */
const CACHE = 'jy-admin-v1';
const SHELL = ['./admin.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* admin.html은 네트워크 우선(항상 최신), 실패 시 캐시. 아이콘/매니페스트는 캐시 우선. */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;               // CDN/Supabase 요청은 건드리지 않음
  if (e.request.method !== 'GET') return;

  if (url.pathname.endsWith('/admin.html')) {
    e.respondWith(
      fetch(e.request)
        .then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return res; })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  if (SHELL.some(p => url.pathname.endsWith(p.replace('./', '/')))) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
  }
});
