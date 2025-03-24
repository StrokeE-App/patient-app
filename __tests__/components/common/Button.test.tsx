import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '@/components/Button';

describe('Button', () => {
	it('renders with children', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('handles click events', () => {
		const handleClick = jest.fn();
		render(<Button onClick={handleClick}>Click me</Button>);

		fireEvent.click(screen.getByText('Click me'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('is disabled when disabled prop is true', () => {
		render(<Button disabled>Click me</Button>);
		expect(screen.getByText('Click me')).toBeDisabled();
	});

	it('applies custom className', () => {
		render(<Button className="custom-class">Click me</Button>);
		expect(screen.getByText('Click me')).toHaveClass('custom-class');
	});

	it('renders with default type="button"', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText('Click me')).toHaveAttribute('type', 'button');
	});

	it('renders with specified type', () => {
		render(<Button type="submit">Submit</Button>);
		expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit');
	});
});
