type InputProps = {
	type?: string;
	placeholder?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	disabled?: boolean;
};

export default function Input({
	type = 'text',
	placeholder = 'Ingrese un valor',
	value = '',
	onChange,
	required = false,
	disabled = false,
}: InputProps) {
	return (
		<input
			type={type}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent max-w-[40rem]"
			required={required}
			disabled={disabled}
		/>
	);
}
