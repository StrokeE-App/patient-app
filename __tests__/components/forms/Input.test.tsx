import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '@/components/Input';

describe('Input', () => {
	const mockOnChange = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders with placeholder', () => {
		render(<Input placeholder="Test placeholder" onChange={mockOnChange} />);
		expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
	});

	it('renders with label when withLabel is true', () => {
		render(<Input placeholder="Test Label" withLabel onChange={mockOnChange} />);
		expect(screen.getByText('Test Label')).toBeInTheDocument();
	});

	it('handles input changes', () => {
		render(<Input onChange={mockOnChange} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, {target: {value: 'test value'}});

		expect(mockOnChange).toHaveBeenCalledTimes(1);
	});

	it('is disabled when disabled prop is true', () => {
		render(<Input disabled />);
		expect(screen.getByRole('textbox')).toBeDisabled();
	});

	it('is required when required prop is true', () => {
		render(<Input required />);
		expect(screen.getByRole('textbox')).toBeRequired();
	});
});
