import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import DatePicker from '@/components/DatePicker';

describe('DatePicker', () => {
	const mockOnChange = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders with label when withLabel is true', () => {
		render(<DatePicker label="Test Label" withLabel selected={new Date()} onChange={mockOnChange} />);
		expect(screen.getByText('Test Label')).toBeInTheDocument();
	});

	it('renders with placeholder', () => {
		render(<DatePicker label="Select date" selected={new Date()} onChange={mockOnChange} />);
		expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
	});
});
