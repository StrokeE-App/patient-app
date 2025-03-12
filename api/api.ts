import axios, {AxiosInstance, AxiosResponse, AxiosError} from 'axios';
import {getCookie} from '@/utils/cookies';
import {SignOut} from '@/firebase/config';

// Create an axios instance with base config and typed instance
const apiClient: AxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	timeout: 10000,
});

// Example interceptor for request logging or adding tokens
apiClient.interceptors.request.use(
	(config) => {
		// Set token from cookie to headers
		const token = getCookie('authToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: unknown): Promise<never> => Promise.reject(error)
);

// Example interceptor for response handling
apiClient.interceptors.response.use(
	(response: AxiosResponse): AxiosResponse => response,
	async (error: unknown): Promise<never> => {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError;
			const status = axiosError.response?.status;
			const message = (axiosError.response?.data as {message?: string})?.message || axiosError.message;
			
			// Log out user automatically on 401 (Unauthorized) or 403 (Forbidden)
			if (status === 401 || status === 403) {
				console.error('Authentication error. Logging out user...');
				try {
					// Call SignOut function to handle logging out
					await SignOut();
				} catch (signOutError) {
					console.error('Error during automatic logout:', signOutError);
				}
			}
			
			// Optionally log or process the message here
			console.error(`Error: ${message}`);
		}
		return Promise.reject(error);
	}
);

// Export the client instance for use in your requests
export default apiClient;
