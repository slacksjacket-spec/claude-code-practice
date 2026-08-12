'use strict';

// 医学系ツール共通のService Worker(サイトルートスコープ)。
// アプリを更新したらこのバージョンを上げる(古いキャッシュが破棄される)
const CACHE = 'medical-hub-v1';
const ASSETS = [
  './',
  './index.html',
  './medical.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
  './exam-review/',
  './exam-review/index.html',
  './lab-values/',
  './lab-values/index.html',
  './pubhealth-stats/',
  './pubhealth-stats/index.html',
  './exam-countdown/',
  './exam-countdown/index.html',
  './mock-tracker/',
  './mock-tracker/index.html',
  './medical-english/',
  './medical-english/index.html',
  './medical-english/morphemes.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// HTMLはネットワーク優先(更新をすぐ反映)、それ以外はキャッシュ優先。オフライン時はキャッシュで動く
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const isHtml = e.request.mode === 'navigate' || e.request.destination === 'document';
  if (isHtml) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request).then(r => r || caches.match('./medical.html')))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }))
    );
  }
});
