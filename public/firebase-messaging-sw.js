// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDnYRorvi1QwCpyFH6N5dzCjHH5OFH2leI",
  authDomain: "mymediator-6caf6.firebaseapp.com",
  databaseURL: "https://mymediator-6caf6-default-rtdb.firebaseio.com",
  projectId: "mymediator-6caf6",
  storageBucket: "mymediator-6caf6.firebasestorage.app",
  messagingSenderId: "375086908278",
  appId: "1:375086908278:web:cf92b47c2e932628b1b057",
  measurementId: "G-FB8FZ9Y04R"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();



messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || "/favicon.ico",
     data: {
      url: "/notification" // 👈 set target URL
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});