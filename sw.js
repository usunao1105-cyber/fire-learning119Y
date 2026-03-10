// Service Worker (キャッシュとオフライン動作を管理するファイル)
const CACHE_NAME = 'ccf-calculator-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// インストール時にファイルをキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// ネットワークリクエストの処理（オフライン時はキャッシュを返す）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがあればそれを返し、なければネットワークから取得
        return response || fetch(event.request);
      })
  );
});