'use client';

import {createContext, useContext, useEffect, useState, useRef} from 'react';
import {auth} from '@/firebase/config';
import {onIdTokenChanged, User} from 'firebase/auth';
import {useRouter} from 'next/navigation';

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	checkAuthToken: () => void;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	isAuthenticated: false,
	isLoading: true,
	checkAuthToken: () => {},
});

export function AuthProvider({children}: {children: React.ReactNode}) {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isMounted, setIsMounted] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout>();
	const timeoutRef = useRef<NodeJS.Timeout>();
	const router = useRouter();

	// Set isMounted to true once the component mounts in the browser
	useEffect(() => {
		setIsMounted(true);
		return () => setIsMounted(false);
	}, []);

	// Check if the auth token is present in the cookie and set the state accordingly
	const checkAuthToken = () => {
		if (!isMounted) return; // Skip if not mounted (server-side)

		const authCookie = document.cookie.split('; ').find((row) => row.startsWith('authToken='));
		if (authCookie) {
			setIsAuthenticated(true);
			setIsLoading(false);
			// Clear the interval when token is found
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		}
	};

	// Check if the user is logged in, if not redirect to login page
	useEffect(() => {
		if (!isMounted) return; // Skip if not mounted (server-side)

		const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
			setIsLoading(true);
			setUser(firebaseUser);
			if (!firebaseUser) {
				setIsAuthenticated(false);
				setIsLoading(false);
				router.push('/login');
			} else {
				// If we have a Firebase user, start checking for the auth token
				intervalRef.current = setInterval(checkAuthToken, 500);
				// If the token is not found after 30 seconds, stop the interval and set loading to false
				timeoutRef.current = setTimeout(() => {
					if (intervalRef.current) {
						clearInterval(intervalRef.current);
					}
					setIsLoading(false);
				}, 30000);
			}
		});

		return () => {
			unsubscribe();
			if (intervalRef.current) clearInterval(intervalRef.current);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [router, isMounted]);

	// Update the auth token cookie when the token changes in Firebase
	useEffect(() => {
		if (!isMounted) return; // Skip if not mounted (server-side)

		const unsubscribeToken = onIdTokenChanged(auth, async (user) => {
			if (user) {
				const token = await user.getIdToken();
				document.cookie = `authToken=${token}; path=/; secure; samesite=strict`;
			} else {
				document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict';
			}
		});

		return () => {
			unsubscribeToken();
		};
	}, [isMounted]);

	return <AuthContext.Provider value={{user, isAuthenticated, isLoading, checkAuthToken}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
