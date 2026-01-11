// MediaBay Service Worker for PWA functionality
const CACHE_NAME = 'mediabay-v1.0.1';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/css/animations.css',
    '/assets/css/responsive.css',
    '/assets/js/main.js',
    '/assets/js/animations.js',
    '/assets/js/chatbot.js',
    '/assets/js/form-handler.js',
    '/assets/icons/favicon.ico',
    '/assets/icons/apple-touch-icon.png',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://kit.fontawesome.com/your-fontawesome-kit.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('MediaBay cache opened');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                // Activate this service worker immediately
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Cache installation failed:', error);
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then((response) => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
            .catch(() => {
                // Return offline page for navigation requests
                if (event.request.destination === 'document') {
                    return caches.match('/offline.html');
                }
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Take control of uncontrolled clients immediately
            return self.clients.claim();
        })
    );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
    
    if (event.tag === 'newsletter-sync') {
        event.waitUntil(syncNewsletter());
    }
});

// Push notification handling
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New message from MediaBay',
        icon: '/assets/icons/apple-touch-icon.png',
        badge: '/assets/icons/favicon.ico',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Website',
                icon: '/assets/icons/apple-touch-icon.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/icons/favicon.ico'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('MediaBay', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Helper functions
async function syncContactForm() {
    try {
        const formData = await getStoredFormData('contact-form');
        if (formData) {
            await submitContactForm(formData);
            await clearStoredFormData('contact-form');
        }
    } catch (error) {
        console.error('Contact form sync failed:', error);
    }
}

async function syncNewsletter() {
    try {
        const emailData = await getStoredFormData('newsletter');
        if (emailData) {
            await submitNewsletter(emailData);
            await clearStoredFormData('newsletter');
        }
    } catch (error) {
        console.error('Newsletter sync failed:', error);
    }
}

async function getStoredFormData(formType) {
    return new Promise((resolve) => {
        // This would typically read from IndexedDB
        resolve(null);
    });
}

async function clearStoredFormData(formType) {
    return new Promise((resolve) => {
        // This would typically clear from IndexedDB
        resolve();
    });
}

async function submitContactForm(data) {
    return fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

async function submitNewsletter(data) {
    return fetch('/api/newsletter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

console.log('MediaBay Service Worker loaded successfully!');