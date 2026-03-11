const CACHE_NAME = 'rescue-map-cache-v3'; // 名前を更新
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// インストール処理
self.addEventListener('install', event => {
  self.skipWaiting(); // 新しいService Workerをすぐにアクティブにする
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('キャッシュを開きました');
        // エラーが起きてもインストールを止めないように個別に追加する
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url).catch(err => console.log('キャッシュ失敗(無視します):', url)))
        );
      })
  );
});

// アクティベート処理（古いキャッシュの削除）
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('古いキャッシュを削除しました:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// リソースの取得（ネットワーク通信を優先し、オフラインの時だけキャッシュを返す）
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return; // POSTリクエストはキャッシュしない

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
