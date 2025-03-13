// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { setCookie, deleteCookie } from '@/utils/cookies';
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

export async function SignOut() {
	try {
		await auth.signOut();
		// Remove auth token and role using the utility function
		deleteCookie('authToken');
		deleteCookie('userRole');
		// Let AuthContext handle the navigation
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function SignIn(email: string, password: string) {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const idToken = await userCredential.user.getIdToken();

		// Send Firebase token to your backend
		console.log('Sending token to backend for authentication');
		const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'x-app-identifier': 'patients'},
			body: JSON.stringify({token: idToken}),
		});

		const data = await response.json();
		console.log('Login response data:', data);

		if (!response.ok) {
			await SignOut();
			const {message} = data;
			throw new Error(message);
		}

		console.log("User role from API:", data.role);

		// Store backend token in cookie using the utility function
		setCookie('authToken', idToken, {
			path: '/',
			secure: true,
			sameSite: 'strict'
		});
		
		let userRole = null;
		
		// Store user role in cookie using the utility function
		if (data.role) {
			userRole = data.role;
			console.log(`Setting userRole cookie: ${data.role}`);
			setCookie('userRole', data.role, {
				path: '/',
				secure: true,
				sameSite: 'strict'
			});
			
			// Double check if cookie was set
			setTimeout(() => {
				const cookies = document.cookie.split(';').map(c => c.trim());
				console.log('All cookies after login:', cookies);
				const roleCookie = cookies.find(cookie => cookie.startsWith('userRole='));
				console.log('Role cookie found:', roleCookie);
			}, 100);
		} else {
			console.warn('No role returned from API');
		}

		// Return both user and role
		return {
			user: userCredential.user,
			role: userRole
		};
	} catch (error) {
		console.error(error);

		// Check if is a credential error and show a custom message
		const firebaseError = error as {code?: string};
		if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/invalid-credential') {
			throw new Error('Usuario o contraseña incorrecta.');
		}

		throw error;
	}
}

export {app, auth};
