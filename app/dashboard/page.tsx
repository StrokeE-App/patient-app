'use client';

import {useEffect} from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

// Components
import SettingsMenu from '@/components/SettingsMenu';
import {StrokeeLogo} from '@/components/StrokeeLogo';

// API
import apiClient from '@/api/api';

// Context
import {useAuth} from '@/context/AuthContext';

// Types
import {AxiosError} from 'axios';

export default function Dashboard() {
	const {user, mongoUser, isLoading} = useAuth();

	useEffect(() => {
		const setVh = () => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		};
		setVh();
		window.addEventListener('resize', setVh);
		return () => window.removeEventListener('resize', setVh);
	}, []);

	const handleStartEmergency = async () => {
		if (!user || !mongoUser) return;

		const loadingToast = toast.loading('Enviando alerta de emergencia...');
		try {
			await apiClient.post('/patient/start-emergency', {
				patientId: user.uid,
				role: 'patient',
				phoneNumber: mongoUser.phoneNumber,
			});
			toast.success('Alerta de emergencia enviada.', {id: loadingToast});
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data.message, {id: loadingToast});
			} else {
				toast.error('Error al enviar la alerta de emergencia.', {id: loadingToast});
			}
			console.log(error);
		}
	};

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-customRed"></div>
			</div>
		);
	}

	// Don't render anything if not authenticated or no MongoDB user data
	if (!user || !mongoUser) {
		return null;
	}

	return (
		<main style={{minHeight: 'calc(var(--vh, 1vh) * 100)'}} className="p-4 flex flex-col justify-between">
			{/* Header */}
			<SettingsMenu />

			{/* Main Content */}
			<div className="mt-12 px-4 flex flex-col items-center w-full">
				{/* <h1 className="text-3xl font-bold text-gray-900 mb-8">En proceso</h1> */}

				{/* Panic Button */}
				<div
					onClick={handleStartEmergency}
					className="mb-8 relative flex justify-center items-center hover:scale-105 transition-transform duration-300 ease-out cursor-pointer"
				>
					<Image src="/images/panic-button.svg" alt="Botón de pánico" width={250} height={250} />
				</div>

				<p className="text-gray-600 mb-6">
					Reconoce un ACV con la regla <b>RAPIDO</b>
				</p>

				<div className="flex justify-center items-center pb-2">
					<Image src="/images/RAPIDO_BLACK.png" alt="Escala RAPIDO para detectar un ACV" width={600} height={300} />
				</div>

				{/* 				<ul className='list-disc list-inside mb-8'>
					<li>
					<b>B</b>alance (Equilibrio): Pérdida repentina del equilibrio o coordinación.
					</li>
					<li><b>E</b>yes (Vista): Visión borrosa o pérdida de visión en uno o ambos ojos.</li>
					<li><b>F</b>ace (Cara): Caída o asimetría en un lado de la cara.</li>
					<li><b>A</b>rms (Brazos): Dificultad para levantar un brazo o debilidad en un lado del cuerpo.</li>
					<li><b>S</b>peech (Habla): Dificultad para hablar o comprender el lenguaje.</li>
					<li><b>T</b>ime (Tiempo): ¡Cada segundo cuenta! Llama a emergencias de inmediato.</li>
				</ul> */}
			</div>

			{/* Footer */}
			<StrokeeLogo />
		</main>
	);
}
