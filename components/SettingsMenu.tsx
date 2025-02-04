'use client';

import {Settings, X} from 'lucide-react';
import {useState, useEffect} from 'react';
import {SignOut} from '@/firebase/config';

export default function SettingsMenu() {
	const [isOpen, setIsOpen] = useState(false);

	// Close panel when pressing Escape key
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, []);

	const handleLogOut = async () => {
		try {
			await SignOut();
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	return (
		<>
			{/* Settings Button */}
			<div
				onClick={() => setIsOpen(true)}
				className="flex justify-center items-center w-[4.6rem] h-[4.6rem] text-customRed cursor-pointer z-20 bg-customRed rounded-lg shadow-lg"
			>
				<Settings className="w-[3.6rem] h-[3.6rem] text-customWhite bg-customRed" />
				{/* <span className="text-lg font-medium">Configuración</span> */}
			</div>

			{/* Overlay */}
			{isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-30" onClick={() => setIsOpen(false)} />}

			{/* Side Panel */}
			<div
				className={`fixed top-0 left-0 h-full w-3/4 max-w-sm bg-white transform transition-transform duration-300 ease-in-out z-40 ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				{/* Panel Header */}
				<div className="relative bg-customRed text-white p-6">
					<h2 className="text-2xl font-medium">Hola,</h2>
					<p className="text-2xl font-black">Paciente!</p>
					<X onClick={() => setIsOpen(false)} className="absolute top-6 right-6 w-6 h-6 cursor-pointer" />
				</div>

				{/* Panel Footer with Logout Button */}
				<div className="absolute bottom-0 left-0 right-0 p-6">
					<button onClick={handleLogOut} className="text-customRed text-lg font-medium hover:text-red-700">
						Cerrar sesión
					</button>
				</div>
			</div>
		</>
	);
}
