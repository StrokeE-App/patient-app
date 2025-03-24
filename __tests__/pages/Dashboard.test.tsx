import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '@/app/dashboard/page';
import {useAuth} from '@/context/AuthContext';

// Mock the API client
jest.mock('@/api/api');

// Mock the AuthContext
jest.mock('@/context/AuthContext', () => ({
	useAuth: jest.fn(),
}));

describe('Dashboard', () => {
	const mockUser = {
		uid: 'test-uid',
		email: 'test@example.com',
	};

	const mockUseAuth = useAuth as jest.Mock;

	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();

		// Default mock implementation for useAuth
		mockUseAuth.mockReturnValue({
			user: mockUser,
			isLoading: false,
			role: 'patient',
		});
	});

	it('renders the dashboard with panic button', () => {
		render(<Dashboard />);

		// Check if the panic button image is present
		const panicButton = screen.getByAltText('Botón de pánico');
		expect(panicButton).toBeInTheDocument();

		// Check if the RAPIDO text is present
		const rapidoText = screen.getByText('Reconoce un ACV con la regla');
		expect(rapidoText).toBeInTheDocument();
	});

	it('shows loading spinner when isLoading is true', () => {
		mockUseAuth.mockReturnValue({
			user: null,
			isLoading: true,
			role: 'patient',
		});

		render(<Dashboard />);

		const spinner = screen.getByRole('status');
		expect(spinner).toBeInTheDocument();
	});

	// it('handles emergency button click', async () => {
	// 	render(<Dashboard />);

	// 	// Find the container div by its test ID
	// 	const panicButtonContainer = screen.getByTestId('panic-button');
	// 	fireEvent.click(panicButtonContainer);

	// 	await waitFor(() => {
	// 		expect(mockPost).toHaveBeenCalledWith('/patient/start-emergency', {
	// 			patientId: mockUser.uid,
	// 			role: 'patient',
	// 		});
	// 	});
	// });

	// it('redirects to emergency panel when role is emergencyContact', () => {
	// 	const mockRouter = {
	// 		push: jest.fn(),
	// 	};
	// 	jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue(mockRouter);

	// 	mockUseAuth.mockReturnValue({
	// 		user: mockUser,
	// 		isLoading: false,
	// 		role: 'emergencyContact',
	// 	});

	// 	render(<Dashboard />);

	// 	expect(mockRouter.push).toHaveBeenCalledWith('/emergency-panel');
	// });
});
