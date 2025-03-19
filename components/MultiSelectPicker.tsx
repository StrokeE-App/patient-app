import React from 'react';
import Select, {StylesConfig} from 'react-select';
import CreatableSelect from 'react-select/creatable';

interface OptionType {
	value: string;
	label: string;
}

export type MultiSelectPickerProps = {
	label: string;
	options: string[];
	selected: string[];
	onChange: (selected: string[]) => void;
	placeholder?: string;
	creatable?: boolean;
};

export default function MultiSelectPicker({
	label,
	options,
	selected,
	onChange,
	placeholder = 'Seleccione o escriba para buscar...',
	creatable = false,
}: MultiSelectPickerProps) {
	// Prepare options in react-select format
	const selectOptions: OptionType[] = options.map((opt) => ({value: opt, label: opt}));

	// Convert selected array to react-select format
	const selectedOptions = selected.map(value => {
		// Look for the value in selectOptions
		const existingOption = selectOptions.find(opt => opt.value === value);
		// If it exists, use it; otherwise create a new option for custom entries
		return existingOption || { value, label: value };
	});

	const handleChange = (selectedOptions: readonly OptionType[] | null) => {
		onChange(selectedOptions ? selectedOptions.map((opt) => opt.value) : []);
	};

	const handleCreateOption = (inputValue: string) => {
		const newOption = { value: inputValue, label: inputValue };
		handleChange([...selectedOptions, newOption]);
	};

	// Custom styles with red as the primary color using proper types
	const customStyles: StylesConfig<OptionType, true> = {
		control: (provided) => ({
			...provided,
			boxShadow: 'none', // Remove focus ring
			outline: 'none',
			'&:hover': {borderColor: '#e63946'},
		}),
		option: (provided, state) => ({
			...provided,
			backgroundColor: state.isSelected ? '#e63946' : state.isFocused ? '#fdecea' : undefined,
			color: state.isSelected ? 'white' : 'black',
			outline: 'none',
		}),
		multiValue: (provided) => ({
			...provided,
			backgroundColor: '#e63946',
		}),
		multiValueLabel: (provided) => ({
			...provided,
			color: 'white',
		}),
		multiValueRemove: (provided) => ({
			...provided,
			color: 'white',
			':hover': {backgroundColor: '#b22a35', color: 'white'},
		}),
	};

	return (
		<div className="w-full max-w-[40rem]">
			<div className="mb-2 text-gray-500">{label}</div>
			{creatable ? (
				<CreatableSelect
					isMulti
					options={selectOptions}
					value={selectedOptions}
					onChange={handleChange}
					onCreateOption={handleCreateOption}
					placeholder={placeholder}
					styles={customStyles}
					className="w-full"
					formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
				/>
			) : (
				<Select
					isMulti
					options={selectOptions}
					value={selectedOptions}
					onChange={handleChange}
					placeholder={placeholder}
					styles={customStyles}
					className="w-full"
				/>
			)}
		</div>
	);
}
