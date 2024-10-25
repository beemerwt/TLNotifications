import { initializeApp } from "firebase/app";
import { onMessage } from "firebase/messaging";
import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";

const firebaseApp = initializeApp({
	apiKey: "AIzaSyDE9ScBcjn3cWe3QAkfJjhAqml_zx4L8lw",
	authDomain: "tl-notifications-7457a.firebaseapp.com",
	projectId: "tl-notifications-7457a",
	storageBucket: "tl-notifications-7457a.appspot.com",
	messagingSenderId: "172526363830",
	appId: "1:172526363830:web:68d8cf2a83227d4acdb217"
});

const messaging = getMessaging(firebaseApp);
onMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Customize notification here
	const { title, body } = payload.data;
  const notificationOptions = { body };
  self.registration.showNotification(title, notificationOptions);
});

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Customize notification here
	const { title, body } = payload.data;
  const notificationOptions = { body };
  self.registration.showNotification(title, notificationOptions);
});
