import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type DatePickerProps = {
	// Selected date value as a Date or null
	selected: Date | null;
	// Callback when the date changes
	onChange: (date: Date | null) => void;
	// Optional input name
	name?: string;
	// Optional flag to display a label
	withLabel?: boolean;
	// Optional label text
	label?: string;
};

export default function DatePicker({selected, onChange, name, withLabel = false, label = ''}: DatePickerProps) {
	return (
		<div className="w-full max-w-[40rem]">
			{withLabel && label && (
				<div className="flex justify-start pl-2 text-gray-500">
					<label htmlFor={name}>{label}</label>
				</div>
			)}
			<ReactDatePicker
				selected={selected}
				onChange={onChange}
				name={name}
				wrapperClassName="w-full"
				dateFormat="dd/MM/yyyy"
				className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
			/>
		</div>
	);
}
