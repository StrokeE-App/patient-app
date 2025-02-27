'use client';

import React, {useEffect, useState} from 'react';
import {ArrowBigLeft} from 'lucide-react';
import Link from 'next/link';

// Components
import Input from '@/components/Input';

// API
import apiClient from '@/api/api';

// Context
import {useAuth} from '@/context/AuthContext';

export default function EditProfilePage() {
	const [patient, setPatient] = useState({
		firstName: '',
		lastName: '',
		phoneNumber: '',
		age: 0,
		birthDate: '',
		weight: 0,
		height: 0,
		medications: '',
		conditions: '',
		email: '',
		password: '',
	});
	const {user} = useAuth();

	useEffect(() => {
		const getPatientData = async () => {
			if (!user) return;

			try {
				const response = await apiClient.get(`/patient/${user.uid}`);
				const patient = response.data.data;
				setPatient(patient);
			} catch (error) {
				console.log(error);
			}
		};

		getPatientData();
	}, [user]);

	if (!user) return null;

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
				<Input name="firstName" placeholder="Nombre" value={patient.firstName} withLabel />
				<Input placeholder="Apellido" value={patient.lastName} />
				<Input placeholder="Número celular" value={patient.phoneNumber} />
				<Input placeholder="Edad" type="number" value={patient.age} />
				<Input placeholder="Fecha de Nacimiento" value={patient.birthDate} />
				<Input placeholder="Peso" type="number" value={patient.weight} />
				<Input placeholder="Estatura" type="number" value={patient.height} />
				<Input placeholder="Medicamentos" value={patient.medications} />
				<Input placeholder="Condiciones" value={patient.conditions} />
				<br />
				<br />
				<Input placeholder="Email" disabled={true} value={user.email || ''} />
				<Input placeholder="Nueva Contraseña" disabled={true} value="" type="password" />
			</div>

			<div className="flex justify-center mt-8">
				<button className="bg-customRed text-white px-8 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent">
					Guardar Cambios
				</button>
			</div>
		</div>
	);
}
