import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const NOTIFICATIONS_ENDPOINT = `https://tl-notifications.beemerwt.workers.dev`;
const FIREBASE_PUBLIC_KEY = 'BFS3keQ352mCG46syS6J40qudaLb66czVzlpFC62SjOAkHbyBgDpmwH5VxSkL_lQww6YOOXuxtt0d4veD82-TWU';

const firebaseConfig = {
	apiKey: "AIzaSyDE9ScBcjn3cWe3QAkfJjhAqml_zx4L8lw",
	authDomain: "tl-notifications-7457a.firebaseapp.com",
	projectId: "tl-notifications-7457a",
	storageBucket: "tl-notifications-7457a.appspot.com",
	messagingSenderId: "172526363830",
	appId: "1:172526363830:web:68d8cf2a83227d4acdb217"
};

const app = initializeApp(firebaseConfig);
const messaging = async () => (await isSupported()) && getMessaging(app)

const nightCheckbox = document.getElementById('night');
const dawnCheckbox = document.getElementById('dawn');
const bossCheckbox = document.getElementById('boss');
const eventCheckbox = document.getElementById('event');
const stoneCheckbox = document.getElementById('stone');
const saveButton = document.getElementById('save');
const disableButton = document.getElementById('disable');

function post(path, data) {
	return fetch(`${NOTIFICATIONS_ENDPOINT}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
}

saveButton.addEventListener('click', async () => {
	const night = nightCheckbox.checked;
	const dawn = dawnCheckbox.checked;
	const boss = bossCheckbox.checked;
	const event = eventCheckbox.checked;
	const stone = stoneCheckbox.checked;
	console.log("Saving", { night, dawn, boss, event, stone });

	let token;
	if (Notification.permission !== 'granted') {
		const permission = await Notification.requestPermission();
		if (permission === 'granted') {
			console.log('Notification permission granted.');
			token = await getToken(messaging, { vapidKey: FIREBASE_PUBLIC_KEY });
		} else {
			console.log('Notification permission denied.');
		}
	}

	if (!token) {
		console.log("No notification token");
		return;
	}

	const response = await post(`/`, {
		notifications: true,
		token,
		night, dawn, boss, event, stone
	});
});

disableButton.addEventListener('click', async () => {
	if (Notification.permission !== 'granted') {
		console.log("User is not subbed to notifications");
		return;
	}

	// incase it hasn't already been fetched
	const token = await getToken(messaging, { vapidKey: FIREBASE_PUBLIC_KEY });
	const response = await post('/', {
		notifications: false,
		notificationToken,
	});
});
