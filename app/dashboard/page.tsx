'use client';

import {useEffect} from 'react';
import SettingsMenu from '@/components/SettingsMenu';
import Image from 'next/image';
import {StrokeeLogo} from '@/components/StrokeeLogo';

export default function Dashboard() {
	useEffect(() => {
		const setVh = () => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		};
		setVh();
		window.addEventListener('resize', setVh);
		return () => window.removeEventListener('resize', setVh);
	}, []);

	return (
		<main style={{minHeight: 'calc(var(--vh, 1vh) * 100)'}} className=" p-4 flex flex-col justify-between">
			{/* Header */}
			<SettingsMenu />

			{/* Main Content */}
			<div className="mt-12 px-4 flex flex-col items-center w-full">
				{/* <h1 className="text-3xl font-bold text-gray-900 mb-8">En proceso</h1> */}

				{/* Panic Button */}
				<div className="relative flex justify-center items-center hover:scale-105 transition-transform duration-300 ease-out cursor-pointer">
					<Image src="/images/panic-button.svg" alt="Botón de pánico" width={250} height={250} />
				</div>
			</div>

			{/* Footer */}
			<StrokeeLogo />
		</main>
	);
}
