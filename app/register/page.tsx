'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

// Components
import Input from '@/components/Input';
import DatePicker from '@/components/DatePicker';
import MultiSelectPicker from '@/components/MultiSelectPicker';
import {StrokeeLogo} from '@/components/StrokeeLogo';
import DataProtectionAgreement from '@/components/DataProtectionAgreement';

// API
import apiClient from '@/api/api';

// Utils
import {isValidEmail, isValidPhoneNumber} from '@/utils/validations';
import {convertUTCToLocal, formatDate} from '@/utils/functions';

// Types
import {EditPatientData} from '@/types';

// Mocks
import {conditionsList, medicinesList} from '@/mocks/patientData';
import {useAuth} from '@/context/AuthContext';

export default function RegisterPage() {
	const router = useRouter();
	const {isAuthenticated, isLoading: isLoadingAuth, role} = useAuth();
	const [showAgreement, setShowAgreement] = useState(false);
	const [agreementAccepted, setAgreementAccepted] = useState(false);

	// Redirect to dashboard or emergency panel if user is authenticated
	useEffect(() => {
		if (!isLoadingAuth && isAuthenticated) {
			// Redirect based on role
			if (role === 'emergencyContact') {
				router.push('/emergency-panel');
			} else {
				// Default to dashboard for patients or any other role
				router.push('/dashboard');
			}
		}
	}, [isLoadingAuth, isAuthenticated, router, role]);

	// Register patient
	const [isLoading, setIsLoading] = useState(false);
	const [patient, setPatient] = useState<EditPatientData>({
		firstName: '',
		lastName: '',
		phoneNumber: '',
		age: '',
		birthDate: '',
		weight: '',
		height: '',
		medications: [],
		conditions: [],
	});
	const [credentials, setCredentials] = useState({
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [verificationCode, setVerificationCode] = useState('');

	// Handle input changes and update patient state
	const handleOnChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;

		// Special handling for numeric fields to ensure they're positive
		if (name === 'age' || name === 'weight' || name === 'height') {
			// Allow empty value or positive number
			if (value === '' || parseFloat(value) > 0) {
				setPatient((prevState) => ({
					...prevState,
					[name]: value,
				}));
			}
			// Trim phone number as user types
		} else if (name === 'phoneNumber') {
			setPatient((prevState) => ({
				...prevState,
				[name]: value.trim(),
			}));
		} else {
			setPatient((prevState) => ({
				...prevState,
				[name]: value,
			}));
		}
	};

	// Handle credentials changes
	const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setCredentials((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	// Handle verification code change
	const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {value} = e.target;
		// Only allow numbers and limit to 6 characters
		const numericValue = value.replace(/[^0-9]/g, '');
		setVerificationCode(numericValue.slice(0, 6));
	};

	// Handle date picker change
	const handleBirthDateChange = (date: Date | null) => {
		setPatient((prevState) => ({
			...prevState,
			birthDate: date ? date.toISOString().split('T')[0] : '',
		}));
	};

	// Register patient
	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();

		// Check if agreement is accepted
		if (!agreementAccepted) {
			setShowAgreement(true);
			return;
		}

		// Format date to DD/MM/AAAA
		const birthDate = formatDate(new Date(patient.birthDate));

		console.log(birthDate);

		// Form validations
		if (!patient.firstName || !patient.lastName) {
			toast.error('Por favor ingrese su nombre y apellido.');
			return;
		}

		// Trim phone number to ensure no spaces
		const trimmedPhoneNumber = patient.phoneNumber.trim();

		// Validate phone number format
		if (!isValidPhoneNumber(trimmedPhoneNumber)) {
			toast.error('Número de teléfono inválido.');
			return;
		}

		// Update the patient state with the trimmed phone number
		setPatient((prevState) => ({
			...prevState,
			phoneNumber: trimmedPhoneNumber,
		}));

		// Validate numeric fields
		if (!patient.age || parseFloat(String(patient.age)) <= 0) {
			toast.error('Por favor ingrese una edad válida.');
			return;
		}

		if (!patient.weight || parseFloat(String(patient.weight)) <= 0) {
			toast.error('Por favor ingrese un peso válido.');
			return;
		}

		if (!patient.height || parseFloat(String(patient.height)) <= 0) {
			toast.error('Por favor ingrese una estatura válida.');
			return;
		}

		// Validate email format
		if (!isValidEmail(credentials.email)) {
			toast.error('Correo electrónico inválido.');
			return;
		}

		// Validate password
		if (credentials.password.length < 6) {
			toast.error('La contraseña debe tener al menos 6 caracteres.');
			return;
		}

		// Validate password confirmation
		if (credentials.password !== credentials.confirmPassword) {
			toast.error('Las contraseñas no coinciden.');
			return;
		}

		// Validate verification code
		if (verificationCode.length !== 6) {
			toast.error('El código de verificación debe tener 6 dígitos.');
			return;
		}

		setIsLoading(true);
		const loadingToast = toast.loading('Creando cuenta...');

		try {
			// Register patient through backend endpoint
			await apiClient.post('/patient/register', {
				...patient,
				phoneNumber: trimmedPhoneNumber, // Use trimmed phone number
				// Convert string values to numbers for API submission
				age: parseFloat(String(patient.age)),
				weight: parseFloat(String(patient.weight)),
				height: parseFloat(String(patient.height)),
				email: credentials.email,
				password: credentials.password,
				token: verificationCode,
				emergencyContact: [],
			});

			// Successful registration
			toast.success('¡Cuenta creada con éxito!', {id: loadingToast});

			// Redirect to login page
			router.push('/login');
		} catch (error: unknown) {
			// Handle error responses from the backend
			let errorMessage = 'Error al crear la cuenta.';

			if (axios.isAxiosError(error)) {
				// Backend returned an error response
				if (error.response?.data?.message) {
					errorMessage = error.response.data.message;
				}
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}

			toast.error(errorMessage, {id: loadingToast});
		} finally {
			setIsLoading(false);
		}
	};

	const handleAgreementAccept = () => {
		setAgreementAccepted(true);
		setShowAgreement(false);
	};

	return (
		<main className="flex min-h-screen flex-col items-center p-6 pb-20">
			<DataProtectionAgreement isOpen={showAgreement} onClose={() => setShowAgreement(false)} onAccept={handleAgreementAccept} />
			<div className="w-full max-w-md">
				<div className="flex justify-center my-6">
					<StrokeeLogo />
				</div>

				<h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Crear Cuenta</h1>

				<form onSubmit={handleRegister} className="space-y-6">
					<div className="space-y-4">
						<h2 className="text-xl font-semibold text-gray-700">Información Personal</h2>

						<Input name="firstName" placeholder="Nombre" value={patient.firstName} withLabel onChange={handleOnChangeData} required />

						<Input name="lastName" placeholder="Apellido" value={patient.lastName} withLabel onChange={handleOnChangeData} required />

						<Input name="phoneNumber" placeholder="Número celular" value={patient.phoneNumber} withLabel onChange={handleOnChangeData} required />

						<Input name="age" placeholder="Edad" type="number" value={patient.age} withLabel onChange={handleOnChangeData} required min="1" />

						<DatePicker
							name="birthDate"
							selected={patient.birthDate ? convertUTCToLocal(patient.birthDate) : null}
							onChange={handleBirthDateChange}
							withLabel
							label="Fecha de nacimiento"
							required
						/>

						<Input
							name="weight"
							placeholder="Peso (kg)"
							type="number"
							value={patient.weight}
							withLabel
							onChange={handleOnChangeData}
							required
							min="0.1"
							step="0.01"
						/>

						<Input
							name="height"
							placeholder="Estatura (m)"
							type="number"
							value={patient.height}
							withLabel
							onChange={handleOnChangeData}
							required
							min="0.1"
							step="0.01"
						/>

						<MultiSelectPicker
							label="Medicamentos"
							options={medicinesList}
							selected={patient.medications}
							onChange={(selected) => setPatient({...patient, medications: selected})}
							placeholder="Seleccione o escriba para buscar medicamentos..."
							creatable={true}
						/>

						<MultiSelectPicker
							label="Condiciones"
							options={conditionsList}
							selected={patient.conditions}
							onChange={(selected) => setPatient({...patient, conditions: selected})}
							placeholder="Seleccione o escriba para buscar condiciones..."
							creatable={true}
						/>
					</div>

					<div className="space-y-4 mt-8">
						<h2 className="text-xl font-semibold text-gray-700">Información de Cuenta</h2>

						<Input
							name="email"
							placeholder="Correo electrónico"
							type="email"
							value={credentials.email}
							withLabel
							onChange={handleCredentialsChange}
							required
						/>

						<Input
							name="password"
							placeholder="Contraseña"
							type="password"
							value={credentials.password}
							withLabel
							onChange={handleCredentialsChange}
							required
						/>

						<Input
							name="confirmPassword"
							placeholder="Confirmar contraseña"
							type="password"
							value={credentials.confirmPassword}
							withLabel
							onChange={handleCredentialsChange}
							required
						/>

						<Input
							name="verificationCode"
							placeholder="Código de verificación (6 dígitos)"
							type="text"
							value={verificationCode}
							withLabel
							onChange={handleVerificationCodeChange}
							required
							maxLength={6}
						/>
						<p className="text-xs text-gray-500 pl-2 -mt-2">Ingrese el código de verificación proporcionado en el correo.</p>

						<div className="flex items-start space-x-3 mt-4">
							<input type="checkbox" id="agreement" checked={agreementAccepted} onChange={(e) => setAgreementAccepted(e.target.checked)} className="mt-1" />
							<label htmlFor="agreement" className="text-sm text-gray-600">
								He leído y acepto el{' '}
								<button type="button" onClick={() => setShowAgreement(true)} className="text-customRed hover:underline">
									acuerdo de protección de datos personales
								</button>
							</label>
						</div>
					</div>

					<div className="flex flex-col items-center gap-4 mt-8">
						<button
							type="submit"
							disabled={isLoading || !agreementAccepted}
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
