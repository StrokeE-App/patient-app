self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open('strokee-v1').then((cache) => {
			return cache.addAll(['/', '/index.html', '/manifest.json', '/strokee-192x192.png', '/strokee-512x512.png']);
		})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return (
				response ||
				fetch(event.request)
					.then((response) => {
						// Clone the response because it can only be consumed once
						const responseToCache = response.clone();

						// Add the new response to the cache
						caches.open('strokee-v1').then((cache) => {
							cache.put(event.request, responseToCache);
						});

						return response;
					})
					.catch(() => {
						// If both fetch and cache fail, you might want to show a fallback
						return new Response('Offline content not available');
					})
			);
		})
	);
});
