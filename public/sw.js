/**
 * Service Worker for Nexume Career Acceleration Platform
 * Provides offline functionality and advanced caching strategies
 */

const CACHE_VERSION = '1.1.0';
const CACHE_NAME = `nexume-v${CACHE_VERSION}`;
const STATIC_CACHE = `nexume-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `nexume-dynamic-v${CACHE_VERSION}`;
const IMAGE_CACHE = `nexume-images-v${CACHE_VERSION}`;
const API_CACHE = `nexume-api-v${CACHE_VERSION}`;

// Cache size limits
const CACHE_LIMITS = {
  [DYNAMIC_CACHE]: 50,
  [IMAGE_CACHE]: 30,
  [API_CACHE]: 20
};

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo.png'
];

// Routes that should work offline
const OFFLINE_ROUTES = [
  '/',
  '/ats-checker',
  '/templates',
  '/career',
  '/interview-prep',
  '/analytics'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
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

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(handleRequest(request));
});

// Handle different types of requests with advanced caching
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Static assets - Cache First with compression
    if (isStaticAsset(url.pathname)) {
      return await cacheFirstWithCompression(request);
    }
    
    // Strategy 2: Images - Cache First with size limits
    if (isImageRequest(url.pathname)) {
      return await cacheFirstWithLimits(request, IMAGE_CACHE);
    }
    
    // Strategy 3: API requests - Network First with TTL
    if (isApiRequest(url.pathname)) {
      return await networkFirstWithTTL(request);
    }
    
    // Strategy 4: Pages - Stale While Revalidate
    if (isPageRequest(url.pathname)) {
      return await staleWhileRevalidate(request);
    }
    
    // Default: Network First
    return await networkFirst(request);
    
  } catch (error) {
    console.error('Service Worker: Request failed', error);
    return await getOfflineFallback(request);
  }
}

// Cache First with compression - for static assets
async function cacheFirstWithCompression(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(STATIC_CACHE);
    
    // Add compression headers if not present
    const headers = new Headers(networkResponse.headers);
    if (!headers.has('cache-control')) {
      headers.set('cache-control', 'public, max-age=31536000'); // 1 year for static assets
    }
    
    const compressedResponse = new Response(networkResponse.body, {
      status: networkResponse.status,
      statusText: networkResponse.statusText,
      headers: headers
    });
    
    cache.put(request, compressedResponse.clone());
    return compressedResponse;
  }
  
  return networkResponse;
}

// Cache First with size limits - for images
async function cacheFirstWithLimits(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    
    // Enforce cache size limits
    await enforceCacheLimit(cacheName);
    
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First with TTL - for API requests
async function networkFirstWithTTL(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      
      // Add TTL metadata
      const headers = new Headers(networkResponse.headers);
      headers.set('sw-cached-at', Date.now().toString());
      headers.set('sw-ttl', '300000'); // 5 minutes TTL for API responses
      
      const responseWithTTL = new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: headers
      });
      
      cache.put(request, responseWithTTL.clone());
      return responseWithTTL;
    }
    
    return networkResponse;
  } catch (error) {
    // Check cache with TTL validation
    const cachedResponse = await getCachedResponseWithTTL(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Get cached response with TTL validation
async function getCachedResponseWithTTL(request) {
  const cachedResponse = await caches.match(request);
  if (!cachedResponse) {
    return null;
  }
  
  const cachedAt = cachedResponse.headers.get('sw-cached-at');
  const ttl = cachedResponse.headers.get('sw-ttl');
  
  if (cachedAt && ttl) {
    const age = Date.now() - parseInt(cachedAt);
    if (age > parseInt(ttl)) {
      // Cache expired, remove it
      const cache = await caches.open(API_CACHE);
      cache.delete(request);
      return null;
    }
  }
  
  return cachedResponse;
}

// Enforce cache size limits
async function enforceCacheLimit(cacheName) {
  const limit = CACHE_LIMITS[cacheName];
  if (!limit) return;
  
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length >= limit) {
    // Remove oldest entries (FIFO)
    const entriesToRemove = keys.slice(0, keys.length - limit + 1);
    await Promise.all(entriesToRemove.map(key => cache.delete(key)));
  }
}

// Network First strategy - for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Network First with fallback - for API requests
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for specific endpoints
    return getOfflineApiResponse(request);
  }
}

// Stale While Revalidate - for pages
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Check if request is for static assets
function isStaticAsset(pathname) {
  return pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/);
}

// Check if request is for images
function isImageRequest(pathname) {
  return pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/);
}

// Check if request is for API
function isApiRequest(pathname) {
  return pathname.startsWith('/api/') || pathname.includes('api');
}

// Check if request is for a page
function isPageRequest(pathname) {
  return OFFLINE_ROUTES.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });
}

// Get offline fallback response
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // For page requests, return cached index.html
  if (isPageRequest(url.pathname)) {
    const cachedIndex = await caches.match('/index.html');
    if (cachedIndex) {
      return cachedIndex;
    }
  }
  
  // For API requests, return offline data
  if (isApiRequest(url.pathname)) {
    return getOfflineApiResponse(request);
  }
  
  // Default offline response
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'This content is not available offline'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Get offline API response
function getOfflineApiResponse(request) {
  const url = new URL(request.url);
  
  // Mock responses for different API endpoints
  if (url.pathname.includes('analyze')) {
    return new Response(
      JSON.stringify({
        score: 75,
        message: 'Offline analysis - limited functionality',
        recommendations: [
          'Connect to internet for full AI-powered analysis',
          'Basic keyword matching performed offline'
        ],
        offline: true
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  if (url.pathname.includes('templates')) {
    return new Response(
      JSON.stringify({
        templates: [],
        message: 'Templates not available offline',
        offline: true
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Default offline API response
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'This feature requires an internet connection',
      offline: true
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Perform background sync
async function doBackgroundSync() {
  try {
    // Sync any pending data
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'BACKGROUND_SYNC',
        message: 'Connection restored - syncing data'
      });
    });
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_URLS':
      cacheUrls(data.urls);
      break;
      
    case 'CLEAR_CACHE':
      clearCache(data.cacheName);
      break;
      
    default:
      console.log('Service Worker: Unknown message type', type);
  }
});

// Cache specific URLs
async function cacheUrls(urls) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.addAll(urls);
    console.log('Service Worker: URLs cached', urls);
  } catch (error) {
    console.error('Service Worker: Failed to cache URLs', error);
  }
}

// Clear specific cache
async function clearCache(cacheName) {
  try {
    await caches.delete(cacheName || DYNAMIC_CACHE);
    console.log('Service Worker: Cache cleared', cacheName);
  } catch (error) {
    console.error('Service Worker: Failed to clear cache', error);
  }
}

// Notify clients about updates
function notifyClients(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  });
}

console.log('Service Worker: Loaded and ready');