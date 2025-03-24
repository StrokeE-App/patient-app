import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import DataProtectionAgreement from '@/components/DataProtectionAgreement';

describe('DataProtectionAgreement', () => {
	const mockOnClose = jest.fn();
	const mockOnAccept = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders when isOpen is true', () => {
		render(<DataProtectionAgreement isOpen={true} onClose={mockOnClose} onAccept={mockOnAccept} />);

		expect(screen.getByText('Autorización para el Tratamiento de Datos Personales')).toBeInTheDocument();
		expect(screen.getByText('Aceptar')).toBeInTheDocument();
		expect(screen.getByText('Cancelar')).toBeInTheDocument();
	});

	it('does not render when isOpen is false', () => {
		render(<DataProtectionAgreement isOpen={false} onClose={mockOnClose} onAccept={mockOnAccept} />);

		expect(screen.queryByText('Acuerdo de Protección de Datos')).not.toBeInTheDocument();
	});

	it('calls onClose when cancel button is clicked', () => {
		render(<DataProtectionAgreement isOpen={true} onClose={mockOnClose} onAccept={mockOnAccept} />);

		fireEvent.click(screen.getByText('Cancelar'));
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('calls onAccept when accept button is clicked', () => {
		render(<DataProtectionAgreement isOpen={true} onClose={mockOnClose} onAccept={mockOnAccept} />);

		fireEvent.click(screen.getByText('Aceptar'));
		expect(mockOnAccept).toHaveBeenCalledTimes(1);
	});

	it('displays the agreement content', () => {
		render(<DataProtectionAgreement isOpen={true} onClose={mockOnClose} onAccept={mockOnAccept} />);

		// Check for some key content that should be present in the agreement
		expect(screen.getByText('Registro y gestión de mi información personal en la plataforma STROKEE.')).toBeInTheDocument();
		expect(
			screen.getByText(
				'De conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013, autorizo a STROKEE para que, en calidad de Responsable del Tratamiento, realice el tratamiento de mis datos personales de acuerdo con las siguientes finalidades:'
			)
		).toBeInTheDocument();
	});
});
