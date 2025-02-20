'use client';
//A button component that recieves a title, click event and a color

interface ButtonProps {
	onClick?: () => void;
	className?: string;
	children?: React.ReactNode;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
}

export default function Button({onClick, type = 'button', disabled = false, className = '', children}: ButtonProps) {
	return (
		<button
			onClick={onClick}
			type={type}
			disabled={disabled}
			className={`flex items-center justify-center gap-2 w-full px-4 py-3 text-white bg-customRed rounded-full hover:bg-gustomRed focus:outline-none focus:ring-2 focus:ring-customRed transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
		>
			{children}
		</button>
	);
}
