// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function SignIn(email: string, password: string) {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const idToken = await userCredential.user.getIdToken();

		// // Send Firebase token to your backend
		const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({token: idToken}),
		});

		if (!response.ok) throw new Error('Authentication failed');

		const {userId} = await response.json();
		// Store backend token in cookie
		document.cookie = `authToken=${userId}; path=/; secure; samesite=strict`;

		// Redirect to dashboard
		window.location.href = '/dashboard';

		// Manually add auth token to cookie for demonstration purposes
		// document.cookie = `authToken=123; path=/; secure; samesite=strict`;

		return userCredential.user;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function SignOut() {
	try {
		await auth.signOut();
		// Remove auth token
		document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
		// Let AuthContext handle the navigation
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export {app, auth};
