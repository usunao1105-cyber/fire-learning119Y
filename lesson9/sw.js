const CACHE_NAME = 'ems-record-cache-v2'; // ここを v1 から v2 に変更しました

// キャッシュしておきたいファイルを指定します
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// インストール時の処理（キャッシュの保存と即時有効化）
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 新しいバージョンをすぐに有効にする
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// アクティベート時の処理（古いキャッシュの削除）
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 現在のキャッシュ名と違う古いキャッシュを削除
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ネットワークリクエスト時の処理（オフライン対応）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュがあればそれを返す
        if (response) {
          return response;
        }
        // キャッシュがなければネットワークから取得する
        return fetch(event.request);
      })
  );
});
