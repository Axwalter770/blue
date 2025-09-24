/**
 * Service Worker for 蓝柚摄影工作室
 * 提供离线支持、缓存管理、推送通知等功能
 */

const CACHE_NAME = 'lanyu-photography-v1.0.0';
const STATIC_CACHE = 'lanyu-static-v1.0.0';
const DYNAMIC_CACHE = 'lanyu-dynamic-v1.0.0';
const IMAGE_CACHE = 'lanyu-images-v1.0.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/products.html',
  '/story.html',
  '/contact.html',
  '/gallery.html',
  '/message.html',
  '/booking.html',
  '/blog.html',
  '/login.html',
  '/register.html',
  '/user-center.html',
  '/styles.css',
  '/script.js',
  '/js/advanced.js',
  '/js/lightbox.js',
  '/manifest.json',
  // 外部资源
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// 需要网络优先的资源
const NETWORK_FIRST = [
  '/admin/',
  '/api/',
  '/booking.html',
  '/user-center.html'
];

// 安装事件
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// 激活事件
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// 获取事件
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // 跳过非HTTP请求
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // 跳过POST请求
  if (request.method !== 'GET') {
    return;
  }
  
  // 处理不同类型的请求
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isNetworkFirst(request)) {
    event.respondWith(handleNetworkFirst(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleCacheFirst(request));
  } else {
    event.respondWith(handleStaleWhileRevalidate(request));
  }
});

// 判断是否为图片请求
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(request.url);
}

// 判断是否为网络优先资源
function isNetworkFirst(request) {
  return NETWORK_FIRST.some(pattern => request.url.includes(pattern));
}

// 判断是否为静态资源
function isStaticAsset(request) {
  return STATIC_ASSETS.some(asset => {
    if (asset.startsWith('http')) {
      return request.url === asset;
    }
    return request.url.endsWith(asset);
  });
}

// 处理图片请求 - 缓存优先
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Image request failed', error);
    return createErrorResponse('图片加载失败');
  }
}

// 处理网络优先请求
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', request.url);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return createOfflineResponse(request);
  }
}

// 处理缓存优先请求
async function handleCacheFirst(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Cache first failed', error);
    return createErrorResponse('资源加载失败');
  }
}

// 处理Stale While Revalidate策略
async function handleStaleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(error => {
      console.log('Service Worker: Network failed for', request.url);
      return null;
    });
  
  if (cachedResponse) {
    // 返回缓存响应，同时在后台更新
    fetchPromise.catch(() => {}); // 防止未处理的Promise拒绝
    return cachedResponse;
  }
  
  // 如果没有缓存，等待网络响应
  try {
    const networkResponse = await fetchPromise;
    if (networkResponse) {
      return networkResponse;
    }
  } catch (error) {
    // 网络失败，返回离线页面
  }
  
  return createOfflineResponse(request);
}

// 创建离线响应
function createOfflineResponse(request) {
  if (request.destination === 'document') {
    return new Response(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>离线模式 - 蓝柚</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            text-align: center;
            max-width: 400px;
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            opacity: 0.9;
          }
          .btn {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid white;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
          }
          .btn:hover {
            background: white;
            color: #667eea;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📱</div>
          <h1>离线模式</h1>
          <p>网络连接不可用，您现在处于离线模式。某些功能可能无法使用。</p>
          <a href="/" class="btn">返回首页</a>
        </div>
        <script>
          // 检查网络连接
          function checkConnection() {
            if (navigator.onLine) {
              location.reload();
            }
          }
          
          // 监听网络状态变化
          window.addEventListener('online', checkConnection);
          
          // 定期检查连接
          setInterval(checkConnection, 5000);
        </script>
      </body>
      </html>
    `, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  }
  
  return new Response('离线模式', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// 创建错误响应
function createErrorResponse(message) {
  return new Response(message, {
    status: 500,
    statusText: 'Internal Server Error'
  });
}

// 推送通知事件
self.addEventListener('push', event => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: '您有新的预约消息',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('蓝柚摄影', options)
  );
});

// 通知点击事件
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/user-center.html')
    );
  } else if (event.action === 'close') {
    // 关闭通知
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// 后台同步事件
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// 执行后台同步
async function doBackgroundSync() {
  try {
    // 同步离线时保存的数据
    const offlineData = await getOfflineData();
    
    for (const data of offlineData) {
      try {
        await fetch(data.url, {
          method: data.method,
          headers: data.headers,
          body: data.body
        });
        
        // 同步成功，删除离线数据
        await removeOfflineData(data.id);
      } catch (error) {
        console.error('Background sync failed for', data.url, error);
      }
    }
  } catch (error) {
    console.error('Background sync error', error);
  }
}

// 获取离线数据
async function getOfflineData() {
  // 这里应该从IndexedDB或其他存储中获取离线数据
  return [];
}

// 删除离线数据
async function removeOfflineData(id) {
  // 这里应该从存储中删除指定的离线数据
}

// 消息事件
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event.data);
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({
        version: CACHE_NAME
      });
      break;
      
    case 'CACHE_URLS':
      event.waitUntil(
        cacheUrls(event.data.urls)
      );
      break;
      
    default:
      console.log('Unknown message type', event.data.type);
  }
});

// 缓存指定URLs
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  return Promise.all(
    urls.map(async url => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.error('Failed to cache', url, error);
      }
    })
  );
}

// 定期清理过期缓存
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupCache());
  }
});

// 清理过期缓存
async function cleanupCache() {
  const cacheNames = await caches.keys();
  const maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7天
  
  for (const cacheName of cacheNames) {
    if (cacheName.startsWith('lanyu-')) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        const cacheDate = response.headers.get('date');
        
        if (cacheDate) {
          const age = Date.now() - new Date(cacheDate).getTime();
          if (age > maxCacheAge) {
            await cache.delete(request);
          }
        }
      }
    }
  }
}

