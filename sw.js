const CACHE_NAME = 'fitlife-v14';
const ASSETS = [
  '/',
  '/index.html',
  '/css/variables.css',
  '/css/base.css',
  '/css/components.css',
  '/css/social.css',
  '/css/marketplace.css',
  '/css/pages.css',
  '/js/i18n.js',
  '/js/services/haptics.js',
  '/js/db.js',
  '/js/services/workouts.js',
  '/js/services/social.js',
  '/js/services/challenges.js',
  '/js/services/marketplace.js',
  '/js/services/wallet.js',
  '/js/services/chat.js',
  '/js/services/aiCoach.js',
  '/js/services/geminiAi.js',
  '/js/services/foodScanner.js',
  '/js/services/notifications.js',
  '/js/services/subscriptions.js',
  '/js/services/runTracker.js',
  '/js/services/analytics.js',
  '/js/pages/auth.js',
  '/js/pages/home.js',
  '/js/pages/workout.js',
  '/js/pages/running.js',
  '/js/pages/nutrition.js',
  '/js/pages/social.js',
  '/js/pages/challenges.js',
  '/js/pages/marketplace.js',
  '/js/pages/wallet.js',
  '/js/pages/discover.js',
  '/js/pages/profile.js',
  '/js/pages/extras.js',
  '/js/pages/aiCoachModal.js',
  '/js/pages/foodScannerModal.js',
  '/js/pages/premiumModal.js',
  '/js/pages/createPostModal.js',
  '/js/pages/socialModals.js',
  '/js/pages/userProfileModal.js',
  '/js/pages/analyticsPage.js',
  '/js/app.js',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(response => {
        if (response && response.status === 200) {
          const cacheCopy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, cacheCopy));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
