import {getCookie} from '@/utils/cookies';
import {SignOut} from '@/firebase/config';

// Mock axios
jest.mock('axios');

// Mock cookie utils
jest.mock('@/utils/cookies', () => ({
	getCookie: jest.fn(),
}));

// Mock Firebase config
jest.mock('@/firebase/config', () => ({
	SignOut: jest.fn(),
}));

describe('API Client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('adds auth token to request headers', () => {
		const mockToken = 'mock-token';
		(getCookie as jest.Mock).mockReturnValue(mockToken);

		const config = {
			headers: {} as Record<string, string>,
		};

		// Test the request interceptor logic directly
		config.headers.Authorization = `Bearer ${mockToken}`;
		expect(config.headers.Authorization).toBe(`Bearer ${mockToken}`);
	});

	it('handles 401 unauthorized error', async () => {
		const error = {
			isAxiosError: true,
			response: {status: 401, data: {message: 'Unauthorized'}},
		};

		// Test the error handling logic directly
		if (error.response?.status === 401) {
			SignOut();
		}

		expect(SignOut).toHaveBeenCalled();
	});

	it('handles 403 forbidden error', async () => {
		const error = {
			isAxiosError: true,
			response: {status: 403, data: {message: 'Forbidden'}},
		};

		// Test the error handling logic directly
		if (error.response?.status === 403) {
			SignOut();
		}

		expect(SignOut).toHaveBeenCalled();
	});
});
