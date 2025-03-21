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

// Types
import {MongoDBUserData} from '@/types';

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	checkAuthToken: () => void;
	role: string | null;
	setUserRole: (role: string) => void;
	mongoUser: MongoDBUserData | null;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	isAuthenticated: false,
	isLoading: true,
	checkAuthToken: () => {},
	role: null,
	setUserRole: () => {},
	mongoUser: null,
});

export function AuthProvider({children}: {children: React.ReactNode}) {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isMounted, setIsMounted] = useState(false);
	const [role, setRole] = useState<string | null>(null);
	const [mongoUser, setMongoUser] = useState<MongoDBUserData | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const router = useRouter();

	// Function to manually set the user role
	const setUserRole = (newRole: string) => {
		console.log('Manually setting role to:', newRole);
		setRole(newRole);
	};

	// Function to fetch MongoDB user data
	const fetchMongoUserData = async (userId: string) => {
		try {
			const response = await apiClient.get(`/patient/${userId}`);
			const userData = response.data.data;
			setMongoUser(userData);
		} catch (error) {
			console.error('Error fetching MongoDB user data:', error);
		}
	};

	// Function to clear MongoDB user data
	const clearMongoUserData = () => {
		setMongoUser(null);
	};

	// Set isMounted to true once the component mounts in the browser
	useEffect(() => {
		setIsMounted(true);
		// Immediately check for role and auth token on client-side mount
		if (typeof window !== 'undefined') {
			const userRole = getCookie('userRole');
			if (userRole) {
				console.log('Initial role check:', userRole);
				setRole(userRole);
			}
		}
		return () => setIsMounted(false);
	}, []);

	// Check if the auth token is present in the cookie and set the state accordingly
	const checkAuthToken = () => {
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
	};

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
				clearMongoUserData();
				// Check if current path is a public route before redirecting
				const path = window.location.pathname;
				if (!publicRoutes.some((route) => path === route || path.startsWith(`${route}/`))) {
					router.push('/login');
				}
			} else {
				// Check for auth token and role immediately
				checkAuthToken();

				// Wait for the auth token to be ready before fetching MongoDB data
				const waitForAuthToken = async () => {
					try {
						const token = await firebaseUser.getIdToken();
						if (token) {
							// Only fetch MongoDB data if role is patient
							if (role === 'patient') {
								await fetchMongoUserData(firebaseUser.uid);
							}
						}
					} catch (error) {
						console.error('Error getting auth token:', error);
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
	}, [router, isMounted, role]);

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
					// Only fetch MongoDB data if role is patient
					if (userRole === 'patient') {
						await fetchMongoUserData(user.uid);
					}
				}
			} else {
				deleteCookie('authToken');
				deleteCookie('userRole');
				clearMongoUserData();
			}
		});

		return () => {
			unsubscribeToken();
		};
	}, [isMounted]);

	// Debug log when role changes
	useEffect(() => {
		console.log('Current role in context:', role);
	}, [role]);

	return (
		<AuthContext.Provider value={{user, isAuthenticated, isLoading, checkAuthToken, role, setUserRole, mongoUser}}>{children}</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
