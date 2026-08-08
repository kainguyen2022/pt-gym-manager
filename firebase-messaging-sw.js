importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAZAIBSanO9Iq3fdWAh2LMvDvfIx1zD4U0",
    authDomain: "pt-manager-2b7c5.firebaseapp.com",
    projectId: "pt-manager-2b7c5",
    storageBucket: "pt-manager-2b7c5.firebasestorage.app",
    messagingSenderId: "968416571201",
    appId: "1:968416571201:web:be3e6d34df9ae74f37bbc0",
    measurementId: "G-ZYFWNQHH26"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title || 'PT Manager';
    const notificationOptions = {
        body: payload.notification.body || 'Bạn có lịch tập sắp tới',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'pt-notification',
        requireInteraction: true,
        data: payload.data
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow('/');
        })
    );
});
