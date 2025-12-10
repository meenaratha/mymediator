// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDnYRorvi1QwCpyFH6N5dzCjHH5OFH2leI",
  authDomain: "mymediator-6caf6.firebaseapp.com",
  projectId: "mymediator-6caf6",
  storageBucket: "mymediator-6caf6.firebasestorage.app",
  messagingSenderId: "375086908278",
  appId: "1:375086908278:web:6940805881ed449cb1b057",
  measurementId: "G-PJKW28RLCR",
  databaseURL: "https://mymediator-6caf6-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

/**
 * Request FCM permission and get token
 */
const requestFirebaseToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || "BEcCimXAN3thDAE11HwktfQ1WmeDyk8d0LqFTA_zNaWAZdQpFM680X2s06BnLOeBKrZHC4FIcTYSPSwdvGGiqaQ", // Add this to .env
    });
    if (currentToken) {
      console.log("Firebase token:", currentToken);
      return currentToken;
    } else {
      console.log("No registration token available.");
      return null;
    }
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
    return null;
  }
};

// Listen to foreground messages
onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
});

export { app, analytics, messaging, requestFirebaseToken };
