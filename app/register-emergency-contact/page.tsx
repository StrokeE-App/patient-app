'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {AxiosError} from 'axios';

// Components
import Input from '@/components/Input';
import {StrokeeLogo} from '@/components/StrokeeLogo';

// API
import apiClient from '@/api/api';

// Utils
import {isValidEmail, isValidPhoneNumber} from '@/utils/validations';

interface ApiErrorResponse {
	message: string;
}

export default function RegisterEmergencyContactPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		phoneNumber: '',
		verification_code: '',
	});

	// Handle input changes
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle verification code change
	const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {value} = e.target;
		// Only allow numbers and limit to 6 characters
		const numericValue = value.replace(/[^0-9]/g, '');
		setFormData((prev) => ({
			...prev,
			verification_code: numericValue.slice(0, 6),
		}));
	};

	// Register emergency contact
	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();

		// Form validations
		if (!formData.email || !formData.password || !formData.phoneNumber || !formData.verification_code) {
			toast.error('Por favor complete todos los campos.');
			return;
		}

		// Validate phone number format
		if (!isValidPhoneNumber(formData.phoneNumber)) {
			toast.error('Número de teléfono inválido.');
			return;
		}

		// Validate email format
		if (!isValidEmail(formData.email)) {
			toast.error('Correo electrónico inválido.');
			return;
		}

		// Validate password
		if (formData.password.length < 6) {
			toast.error('La contraseña debe tener al menos 6 caracteres.');
			return;
		}

		// Validate password confirmation
		if (formData.password !== formData.confirmPassword) {
			toast.error('Las contraseñas no coinciden.');
			return;
		}

		// Validate verification code
		if (formData.verification_code.length !== 6) {
			toast.error('El código de verificación debe tener 6 dígitos.');
			return;
		}

		setIsLoading(true);
		const loadingToast = toast.loading('Creando cuenta...');

		try {
			await apiClient.post('/emergency-contact/register-emergency-contact-to-start-emergency', {
				email: formData.email,
				password: formData.password,
				phoneNumber: formData.phoneNumber,
				verification_code: formData.verification_code,
			});

			toast.success('¡Cuenta creada con éxito!', {id: loadingToast});
			router.push('/login');
		} catch (error: unknown) {
			let errorMessage = 'Error al crear la cuenta.';
			const axiosError = error as AxiosError<ApiErrorResponse>;
			if (axiosError?.response?.data?.message) {
				errorMessage = axiosError.response.data.message;
			}
			toast.error(errorMessage, {id: loadingToast});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="flex min-h-screen flex-col items-center p-6 pb-20">
			<div className="w-full max-w-md">
				<div className="flex justify-center my-6">
					<StrokeeLogo />
				</div>

				<h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Registro de Contacto de Emergencia</h1>

				<form onSubmit={handleRegister} className="space-y-6">
					<div className="space-y-4">
						<Input name="email" placeholder="Correo electrónico" type="email" value={formData.email} withLabel onChange={handleInputChange} required />

						<Input name="password" placeholder="Contraseña" type="password" value={formData.password} withLabel onChange={handleInputChange} required />

						<Input
							name="confirmPassword"
							placeholder="Confirmar contraseña"
							type="password"
							value={formData.confirmPassword}
							withLabel
							onChange={handleInputChange}
							required
						/>

						<Input name="phoneNumber" placeholder="Número de teléfono" value={formData.phoneNumber} withLabel onChange={handleInputChange} required />

						<Input
							name="verification_code"
							placeholder="Código de verificación (6 dígitos)"
							type="text"
							value={formData.verification_code}
							withLabel
							onChange={handleVerificationCodeChange}
							required
							maxLength={6}
						/>
						<p className="text-xs text-gray-500 pl-2 -mt-2">Ingrese el código de verificación proporcionado en el correo.</p>
					</div>

					<div className="flex flex-col items-center gap-4 mt-8">
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-customRed text-white px-8 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
						</button>

						<p className="text-gray-600">
							¿Ya tienes una cuenta?{' '}
							<Link href="/login" className="text-customRed font-semibold">
								Inicia sesión
							</Link>
						</p>
					</div>
				</form>
			</div>
		</main>
	);
}
