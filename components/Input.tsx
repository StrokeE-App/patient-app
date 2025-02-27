type InputProps = {
	name?: string;
	type?: string;
	placeholder?: string;
	value?: string | number;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	disabled?: boolean;
	withLabel?: boolean;
};

export default function Input({
	name = 'input',
	type = 'text',
	placeholder = 'Ingrese un valor',
	value = '',
	onChange,
	required = false,
	disabled = false,
	withLabel = false,
}: InputProps) {
	return (
		<>
			{withLabel && <label htmlFor={name}>{placeholder}</label>}
			<input
				name={name}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent max-w-[40rem]"
				required={required}
				disabled={disabled}
			/>
		</>
	);
}
