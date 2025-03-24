import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmModal from '@/components/ConfirmModal';

describe('ConfirmModal', () => {
	const mockOnClose = jest.fn();
	const mockOnConfirm = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders when isOpen is true', () => {
		render(<ConfirmModal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} title="Test Modal" />);

		expect(screen.getByText('Test Modal')).toBeInTheDocument();
		expect(screen.getByText('Si')).toBeInTheDocument();
		expect(screen.getByText('No')).toBeInTheDocument();
	});

	it('does not render when isOpen is false', () => {
		render(<ConfirmModal isOpen={false} onClose={mockOnClose} onConfirm={mockOnConfirm} title="Test Modal" />);

		expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
	});

	it('calls onClose when cancel button is clicked', () => {
		render(<ConfirmModal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} title="Test Modal" />);

		fireEvent.click(screen.getByText('No'));
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('calls onConfirm when confirm button is clicked', () => {
		render(<ConfirmModal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} title="Test Modal" />);

		fireEvent.click(screen.getByText('Si'));
		expect(mockOnConfirm).toHaveBeenCalledTimes(1);
	});
});
