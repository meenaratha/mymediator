// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
 apiKey: "AIzaSyDnYRorvi1QwCpyFH6N5dzCjHH5OFH2leI",
  authDomain: "mymediator-6caf6.firebaseapp.com",
  projectId: "mymediator-6caf6",
  storageBucket: "mymediator-6caf6.firebasestorage.app",
  messagingSenderId: "375086908278",
  appId: "1:375086908278:web:6940805881ed449cb1b057",
  measurementId: "G-PJKW28RLCR",
    databaseURL: "https://mymediator-6caf6-default-rtdb.firebaseio.com",

});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/favicon.ico",
     data: {
      url: "/notification" // 👈 set target URL
    }
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});


// 🔥 Handle Click on Notification → Navigate to /notification
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/notification";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {

      // If window already open → focus + navigate
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      // Otherwise open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});