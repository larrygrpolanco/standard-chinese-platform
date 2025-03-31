// service-worker.js
const CACHE_NAME = 'tapedchinese-cache-v1';
const AUDIO_CACHE_NAME = 'tapedchinese-audio-cache-v1';
const IMAGE_CACHE_NAME = 'tapedchinese-image-cache-v1';

// Files to cache immediately on service worker installation
const STATIC_CACHE_URLS = [
  '/',
  '/favicon.ico',
  '/site.webmanifest',
  '/textures/subtle-paper.png',
  '/images/vintage-cassette.png'
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName !== CACHE_NAME && 
              cacheName !== AUDIO_CACHE_NAME &&
              cacheName !== IMAGE_CACHE_NAME
            );
          })
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - network-first strategy for most requests, cache-first for audio, network-first with cache for exercise images
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Special handling for audio files (from Supabase storage)
  if (isAudioFile(event.request.url)) {
    event.respondWith(handleAudioRequest(event.request));
    return;
  }
  
  // Special handling for exercise images (from Supabase storage)
  if (isExerciseImage(event.request.url)) {
    event.respondWith(handleImageRequest(event.request));
    return;
  }
  
  // Default network-first strategy for other requests
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache non-successful responses or non-GET requests
        if (!response.ok || event.request.method !== 'GET') {
          return response;
        }
        
        // Clone the response to store in cache and return the original
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
  );
});

// Special handling for audio files with long cache duration
async function handleAudioRequest(request) {
  // First check if we have it in cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, fetch from network
  try {
    const response = await fetch(request);
    
    // Only cache successful responses
    if (!response.ok) {
      return response;
    }
    
    // Clone the response to store in cache
    const responseToCache = response.clone();
    
    // Open the audio cache and store the response
    const cache = await caches.open(AUDIO_CACHE_NAME);
    cache.put(request, responseToCache);
    
    return response;
  } catch (error) {
    // If fetch fails and we don't have it in cache, return a fallback
    console.error('Audio fetch failed:', error);
    return new Response('Audio fetch failed', { status: 408 });
  }
}

// Special handling for exercise images with medium cache duration (3 days)
async function handleImageRequest(request) {
  try {
    // Try to fetch from network first
    const response = await fetch(request);
    
    // Only cache successful responses
    if (!response.ok) {
      return response;
    }
    
    // Clone the response to store in cache
    const responseToCache = response.clone();
    
    // Open the image cache and store the response
    const cache = await caches.open(IMAGE_CACHE_NAME);
    
    // Store in cache
    cache.put(request, responseToCache);
    
    // Set a timeout to delete this cached item after 3 days (259200000 ms)
    const requestUrl = request.url;
    setTimeout(() => {
      caches.open(IMAGE_CACHE_NAME).then(cache => {
        cache.delete(new Request(requestUrl));
      });
    }, 259200000);
    
    return response;
  } catch (error) {
    // If fetch fails, try to get it from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache either, return error response
    console.error('Image fetch failed:', error);
    return new Response('Image fetch failed', { status: 408 });
  }
}

// Helper function to identify audio files
function isAudioFile(url) {
  // Check if URL is from Supabase storage and contains audio
  return (
    (url.includes('supabase.co') && url.includes('storage/v1/object/public')) &&
    (url.endsWith('.mp3') || url.endsWith('.wav') || url.includes('audio'))
  );
}

// Helper function to identify exercise images
function isExerciseImage(url) {
  // Check if URL is from Supabase storage and likely to be an exercise image
  return (
    (url.includes('supabase.co') && url.includes('storage/v1/object/public')) &&
    (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) &&
    (url.includes('exercises') || url.includes('workbook'))
  );
}