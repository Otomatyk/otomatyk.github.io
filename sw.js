// @ts-nocheck
const CACHE_NAME = "version-6";

const self = this;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            const DATA_URI = `https://calendrier.api.gouv.fr/jours-feries/metropole/${new Date().getFullYear()}.json`

            fetch(DATA_URI).then((res) => {
                cache.put(DATA_URI, res)
            })
        })
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {

            return cachedResponse || fetch(event.request.url).then((fetchedResponse) => {
                cache.put(event.request, fetchedResponse.clone());
    
                return fetchedResponse;
          });
        });
    }));
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
            
    )
});