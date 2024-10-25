import { initializeApp } from "firebase/app";
import { getMessaging, getToken as getFirebaseToken } from "firebase/messaging";

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

// await isSupported()
const messaging = getMessaging(app);

const nightCheckbox = document.getElementById('night');
const nightAdvance = document.getElementById('night-advance');

const dawnCheckbox = document.getElementById('dawn');
const dawnAdvance = document.getElementById('dawn-advance');

const bossCheckbox = document.getElementById('boss');
const bossAdvance = document.getElementById('boss-advance');

const eventCheckbox = document.getElementById('event');
const eventAdvance = document.getElementById('event-advance');

const stoneCheckbox = document.getElementById('stone');
const stoneAdvance = document.getElementById('stone-advance');

const saveButton = document.getElementById('save');
const disableButton = document.getElementById('disable');
const testButton = document.getElementById('test');

async function getValues(token) {
	const response = await fetch(`${NOTIFICATIONS_ENDPOINT}/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token })
	});

	const data = await response.json();
	return data;
}

async function unsubscribe(token) {
	const url = new URL(`${NOTIFICATIONS_ENDPOINT}/`);

	const response = await fetch(url, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token })
	});

	const data = await response.json();
	return data;
}

async function updateValues(token, values) {
	if (!token) {
		console.error("No token provided");
		return;
	}

	const response = await fetch(`${NOTIFICATIONS_ENDPOINT}/`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token, ...values })
	});

	console.log(`Response Status: ${response.statusText} (${response.status})`);
	console.log("Response Headers: ", response.headers);
	console.log("Response Type", response.type);
	console.log("Was Redirected? ", response.redirected);

	const responseData = await response.json();
	return responseData;
}

let serviceWorkerRegistration;
async function getServiceWorkerRegistration() {
	if (serviceWorkerRegistration)
		return serviceWorkerRegistration;

	try {
		serviceWorkerRegistration = await navigator.serviceWorker.register('/TLNotifications/dist/messaging.bundle.js');
		return serviceWorkerRegistration;
	} catch (err) {
		console.error("Problem getting service worker registration", err);
	}
}

async function getToken() {
	try {
		const serviceWorkerRegistration = await getServiceWorkerRegistration();
		const token = getFirebaseToken(messaging, {
			serviceWorkerRegistration,
			vapidKey: FIREBASE_PUBLIC_KEY
		});

		return token;
	} catch (err) {
		console.error("Problem getting token", err);
	}
}

saveButton.addEventListener('click', async () => {
	const permission = await Notification.requestPermission();
	if (permission !== 'granted') {
		alert("Cannot save settings without approving notification permission");
		return;
	}

	const token = await getToken();

	if (!token) {
		console.log("No notification token");
		return;
	}

	const values = {
		night: {
			enabled: nightCheckbox.checked,
			advance: parseInt(nightAdvance.value) || 0
		},
		dawn: {
			enabled: dawnCheckbox.checked,
			advance: parseInt(dawnAdvance.value) || 0
		},
		boss: {
			enabled: bossCheckbox.checked,
			advance: parseInt(bossAdvance.value) || 0
		},
		event: {
			enabled: eventCheckbox.checked,
			advance: parseInt(eventAdvance.value) || 0
		},
		stone: {
			enabled: stoneCheckbox.checked,
			advance: parseInt(stoneAdvance.value) || 0
		}
	}

	const response = await updateValues(token, values);

	if (response && response.error) {
		console.error("Failed to save settings", response.error);
		return;
	}
});

disableButton.addEventListener('click', async () => {
	if (Notification.permission !== 'granted') {
		console.log("User is not subbed to notifications");
		return;
	}

	// incase it hasn't already been fetched
	const token = await getToken();
	const response = await unsubscribe(token);
	if (response && response.error) {
		console.error("Failed to save settings", response.error);
		return;
	}
});

testButton.addEventListener('click', async () => {
	const response = await fetch(`${NOTIFICATIONS_ENDPOINT}/test`);
});

(async () => {
	if (Notification.permission !== 'granted') {
		console.log("User is not subbed to notifications");
		return;
	}

	const token = await getToken();
	if (!token) {
		console.log("No token");
		return;
	}

	const values = await getValues(token);
	if (values && values.error) {
		console.error("Failed to get values", values.error);
		return;
	}

	// TODO: Input validation so that value is always a number
	// and always an increment of 5
	const { settings } = values;

	nightCheckbox.checked = settings.night.enabled;
	nightAdvance.value = settings.night.advance;

	dawnCheckbox.checked = settings.dawn.enabled;
	dawnAdvance.value = settings.dawn.advance;

	bossCheckbox.checked = settings.boss.enabled;
	bossAdvance.value = settings.boss.advance;

	eventCheckbox.checked = settings.event.enabled;
	eventAdvance.value = settings.event.advance

	stoneCheckbox.checked = settings.stone.enabled;
	stoneAdvance.value = settings.stone.advance;
})();
