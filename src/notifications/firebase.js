// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging , getToken,onMessage } from "firebase/messaging";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnYRorvi1QwCpyFH6N5dzCjHH5OFH2leI",
  authDomain: "mymediator-6caf6.firebaseapp.com",
  databaseURL: "https://mymediator-6caf6-default-rtdb.firebaseio.com",
  projectId: "mymediator-6caf6",
  storageBucket: "mymediator-6caf6.firebasestorage.app",
  messagingSenderId: "375086908278",
  appId: "1:375086908278:web:cf92b47c2e932628b1b057",
  measurementId: "G-FB8FZ9Y04R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);



// 🔔 Foreground notification handler
export const listenToMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("🔥 Foreground FCM:", payload);

    if (Notification.permission === "granted" && payload.notification) {
      const notification = new Notification(
        payload.notification.title,
        {
          body: payload.notification.body,
          icon: "/favicon.ico",
          data: {
            url: "/notification",
          },
        }
      );

      // ✅ Handle click
      notification.onclick = () => {
        window.focus();
        window.location.href = "/notification";
      };
    }
  });
};



export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);

    if (permission !== "granted") {
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "BEcCimXAN3thDAE11HwktfQ1WmeDyk8d0LqFTA_zNaWAZdQpFM680X2s06BnLOeBKrZHC4FIcTYSPSwdvGGiqaQ",
    });

    console.log("FCM Token:", token);
    localStorage.setItem("fcm_token", token);
    return token; // ✅ MUST return
  } catch (error) {
    console.error("FCM error:", error);
    return null;
  }
};
