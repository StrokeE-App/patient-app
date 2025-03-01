'use client';

import React, {useEffect, useState} from 'react';
import {ArrowBigLeft} from 'lucide-react';
import Link from 'next/link';

// Components
import Input from '@/components/Input';
import DatePicker from '@/components/DatePicker';

// API
import apiClient from '@/api/api';

// Context
import {useAuth} from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {isValidEmail, isValidPhoneNumber} from '@/utils/validations';
import {EditPatientData} from '@/types';

export default function EditProfilePage() {
	const [isLoading, setIsLoading] = useState(false);
	const [patient, setPatient] = useState<EditPatientData>({
		firstName: '',
		lastName: '',
		phoneNumber: '',
		age: 0,
		birthDate: '',
		weight: 0,
		height: 0,
		medications: '',
		conditions: '',
	});
	const [patientCredentials, setPatientCredentials] = useState({
		email: '',
		password: '',
	});

	const {user} = useAuth();

	// Helper function to format date to DD/MM/AAAA
	function formatDate(date: Date): string {
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	}

	// Fetch patient data from database
	useEffect(() => {
		const getPatientData = async () => {
			if (!user) return;

			const loadingToast = toast.loading('Cargando datos...');
			try {
				setIsLoading(true);
				const response = await apiClient.get(`/patient/${user.uid}`);
				const patient = response.data.data;
				setPatient({
					...patient,
					patiendId: undefined,
				});
				setPatientCredentials({
					email: patient.email,
					password: '',
				});
				setIsLoading(false);
				toast.success('Datos cargados.', {id: loadingToast});
			} catch (error) {
				toast.error('Error al cargar los datos.');
				console.log(error);
				setIsLoading(false);
			}
		};

		getPatientData();
	}, [user]);

	// Handle input changes and update patient state
	const handleOnChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setPatient((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	// New handler for date picker
	const handleBirthDateChange = (date: Date | null) => {
		setPatient((prevState) => ({
			...prevState,
			birthDate: date ? date.toISOString().split('T')[0] : '',
		}));
	};

	// Edit profile in database
	const handleEditProfile = async () => {
		if (!user) return;

		// Validate phone number format (10 digits)
		if (!isValidPhoneNumber(patient.phoneNumber)) {
			toast.error('Número de teléfono inválido.');
			return;
		}

		// Validate email format
		if (!isValidEmail(patientCredentials.email)) {
			toast.error('Correo electrónico inválido.');
			return;
		}

		// Format date to DD/MM/AAAA
		const birthDate = formatDate(new Date(patient.birthDate));

		console.log(patient);
		console.log(birthDate);

		// Convert medications and conditions to arrays if they are strings
		let patientMedications: string | string[] = patient.medications;
		let patientConditions: string | string[] = patient.conditions;
		if (typeof patient.medications === 'string') {
			patientMedications = patient.medications.split(',').map((med: string) => med.trim());
		}
		if (typeof patient.conditions === 'string') {
			patientConditions = patient.conditions.split(',').map((cond: string) => cond.trim());
		}

		const loadingToast = toast.loading('Actualizando perfil...');
		try {
			await apiClient.put(`/patient/update/${user.uid}`, {
				...patient,
				medications: patientMedications,
				conditions: patientConditions,
				birthDate,
				patientId: undefined,
				email: undefined,
				password: undefined,
			});
			toast.success('Perfil actualizado.', {id: loadingToast});
		} catch (error) {
			toast.error('Error al actualizar el perfil.', {id: loadingToast});
			console.error(error);
		}
	};

	console.log(patient);

	if (!user) return null;

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-customRed"></div>
			</div>
		);
	}

	return (
		<div>
			<div className="text-customRed mt-4 ml-4">
				<Link href="/dashboard">
					<ArrowBigLeft size={48} />
				</Link>
			</div>

			<div className="flex flex-col items-center mt-4">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Perfil</h1>
			</div>

			<div className="flex flex-col items-center mt-4 p-4 gap-5">
				<Input name="firstName" placeholder="Nombre" value={patient.firstName} withLabel onChange={handleOnChangeData} />
				<Input name="lastName" placeholder="Apellido" value={patient.lastName} withLabel onChange={handleOnChangeData} />
				<Input name="phoneNumber" placeholder="Número celular" value={patient.phoneNumber} withLabel onChange={handleOnChangeData} />
				<Input name="age" placeholder="Edad" type="number" value={patient.age} withLabel onChange={handleOnChangeData} />
				<DatePicker
					name="birthDate"
					selected={patient.birthDate ? new Date(patient.birthDate) : null}
					onChange={handleBirthDateChange}
					withLabel
					label="Fecha de nacimiento"
				/>
				<Input name="weight" placeholder="Peso (kg)" type="number" value={patient.weight} withLabel onChange={handleOnChangeData} />
				<Input name="height" placeholder="Estatura (m)" type="number" value={patient.height} withLabel onChange={handleOnChangeData} />
				<Input name="medications" placeholder="Medicamentos" value={patient.medications} withLabel onChange={handleOnChangeData} />
				<Input name="conditions" placeholder="Condiciones" value={patient.conditions} withLabel onChange={handleOnChangeData} />
				<br />
				<br />
				<Input name="email" placeholder="Email" disabled={true} value={patientCredentials.email} withLabel onChange={handleOnChangeData} />
				<Input name="password " placeholder="Nueva Contraseña" disabled={true} value="" type="password" withLabel onChange={handleOnChangeData} />
			</div>

			<div className="flex justify-center my-8">
				<button
					onClick={handleEditProfile}
					className="bg-customRed text-white px-8 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
				>
					Guardar Cambios
				</button>
			</div>
		</div>
	);
}
