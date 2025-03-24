'use client';
import {createContext, useContext, useEffect, useState, useRef} from 'react';
import {auth} from '@/firebase/config';
import {onIdTokenChanged, User} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import apiClient from '@/api/api';

// Utils
import {getCookie, setCookie, deleteCookie} from '@/utils/cookies';

// Config
import {publicRoutes} from '@/config/routes';

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	checkAuthToken: () => void;
	role: string | null;
	setUserRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	isAuthenticated: false,
	isLoading: true,
	checkAuthToken: () => {},
	role: null,
	setUserRole: () => {},
});

// Utility functions for storing and retrieving user role from localStorage
const STORAGE_KEYS = {
	ROLE: 'strokee_role',
};

const persistToStorage = (key: string, data: string) => {
	try {
		localStorage.setItem(key, data);
	} catch (error) {
		console.error('Error persisting data to storage:', error);
	}
};

const getFromStorage = (key: string): string | null => {
	try {
		return localStorage.getItem(key);
	} catch (error) {
		console.error('Error reading from storage:', error);
		return null;
	}
};

export function AuthProvider({children}: {children: React.ReactNode}) {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isMounted, setIsMounted] = useState(false);
	const [role, setRole] = useState<string | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const router = useRouter();

	// Modified setUserRole to persist to both cookie and localStorage
	const setUserRole = (newRole: string) => {
		console.log('Setting role to:', newRole);
		setRole(newRole);
		setCookie('userRole', newRole, {
			path: '/',
			secure: true,
			sameSite: 'strict',
		});
		persistToStorage(STORAGE_KEYS.ROLE, newRole);
	};

	// Function to restore user state from storage
	const restoreUserState = () => {
		const storedRole = getFromStorage(STORAGE_KEYS.ROLE);

		if (storedRole) {
			setRole(storedRole);
			setCookie('userRole', storedRole, {
				path: '/',
				secure: true,
				sameSite: 'strict',
			});
		}

		return {storedRole};
	};

	// Set isMounted to true once the component mounts in the browser
	useEffect(() => {
		setIsMounted(true);
		// Immediately check for role on client-side mount
		if (typeof window !== 'undefined') {
			restoreUserState();
		}
		return () => setIsMounted(false);
	}, []);

	// Check if the auth token is present in the cookie and set the state accordingly
	/* 	const checkAuthToken = () => {
		if (!isMounted) return; // Skip if not mounted (server-side)

		// Check for user role in cookie
		const userRole = getCookie('userRole');
		if (userRole) {
			console.log('Role from cookie:', userRole);
			setRole(userRole);
		} else {
			console.log('No role found in cookie');
		}

		// Check for auth token in cookie
		const authToken = getCookie('authToken');
		if (authToken) {
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
	}; */

	// Check if the user is logged in, if not redirect to login page
	useEffect(() => {
		if (!isMounted) return; // Skip if not mounted (server-side)

		const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
			setIsLoading(true);
			setUser(firebaseUser);

			if (!firebaseUser) {
				setIsAuthenticated(false);
				setIsLoading(false);
				setRole(null);
				localStorage.removeItem(STORAGE_KEYS.ROLE);

				// Check if current path is a public route before redirecting
				const path = window.location.pathname;
				if (!publicRoutes.some((route) => path === route || path.startsWith(`${route}/`))) {
					router.push('/login');
				}
			} else {
				// Check for auth token and role immediately
				checkAuthToken();

				// Wait for the auth token to be ready before restoring user state
				const waitForAuthToken = async () => {
					try {
						const token = await firebaseUser.getIdToken();
						if (token) {
							// First try to restore from storage
							const {storedRole} = restoreUserState();

							// If we don't have a role, try to determine it
							if (!storedRole && !role) {
								try {
									// Try to fetch patient data to determine role
									await apiClient.get(`/patient/${firebaseUser.uid}`);
									setUserRole('patient');
								} catch {
									// If patient fetch fails, assume emergency contact
									setUserRole('emergencyContact');
								}
							}
						}
					} catch (error) {
						console.error('Error getting auth token:', error);
					} finally {
						setIsLoading(false);
					}
				};

				waitForAuthToken();

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
				setCookie('authToken', token, {
					path: '/',
					secure: true,
					sameSite: 'strict',
				});

				// Check for role again when token changes
				const userRole = getCookie('userRole');
				if (userRole) {
					console.log('Role after token change:', userRole);
					setRole(userRole);
				}
			} else {
				deleteCookie('authToken');
				deleteCookie('userRole');
				localStorage.removeItem(STORAGE_KEYS.ROLE);
				setRole(null);
			}
		});

		return () => {
			unsubscribeToken();
		};
	}, [isMounted]);

	// Check if the auth token is present in the cookie and set the state accordingly
	const checkAuthToken = () => {
		if (!isMounted) return;

		// Check for user role in cookie
		const userRole = getCookie('userRole');
		if (userRole) {
			console.log('Role from cookie:', userRole);
			setRole(userRole);
		} else {
			console.log('No role found in cookie');
		}

		// Check for auth token in cookie
		const authToken = getCookie('authToken');
		if (authToken) {
			setIsAuthenticated(true);
			setIsLoading(false);
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		}
	};

	// Debug log when role changes
	useEffect(() => {
		console.log('Current role in context:', role);
	}, [role]);

	return <AuthContext.Provider value={{user, isAuthenticated, isLoading, checkAuthToken, role, setUserRole}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
