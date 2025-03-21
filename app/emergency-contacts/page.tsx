'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';

// Components
import Button from '@/components/Button';
import EmergencyContactCard from '@/components/EmergencyContactCard';
import {ArrowBigLeft, CirclePlus} from 'lucide-react';
import toast from 'react-hot-toast';

// Mocks
// import {emergencyContactsList} from '@/mocks/emergency';
import {EmergencyContact} from '@/types';

// API
import apiClient from '@/api/api';

// Context
import {useAuth} from '@/context/AuthContext';

export default function EmergencyContactsPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
	const {user} = useAuth();

	useEffect(() => {
		// const emergencyContacts = localStorage.getItem('emergencyContacts');
		// if (emergencyContacts) {
		// 	setEmergencyContacts(JSON.parse(emergencyContacts));
		// } else {
		// 	setEmergencyContacts(emergencyContactsList);
		// 	localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContactsList));
		// }

		if (!user) return;

		const fetchEmergencyContacts = async () => {
			const loadingToast = toast.loading('Cargando Contactos de Emergencia...');
			try {
				setIsLoading(true);
				const response = await apiClient.get(`/patient/emergency-contacts/all/${user.uid}`);
				setEmergencyContacts(response.data.data);
				setIsLoading(false);
				toast.success('Contactos de Emergencia cargados.', {id: loadingToast});
			} catch (error) {
				setIsLoading(false);
				toast.error('Error al cargar los Contactos de Emergencia.', {id: loadingToast});
				console.error(error);
			}
		};

		fetchEmergencyContacts();
	}, [user]);

	console.log(emergencyContacts);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-customRed"></div>
			</div>
		);
	}

	return (
		<>
			<div className="text-customRed mt-4 ml-4">
				<Link href="/dashboard">
					<ArrowBigLeft size={48} />
				</Link>
			</div>

			<div className="flex flex-col items-center mt-4">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Tus Contactos</h1>
			</div>

			<div className="flex flex-col items-center mt-4 p-4 gap-5">
				{emergencyContacts.map((contact, index) => (
					<EmergencyContactCard
						key={index}
						emergencyContactId={contact.emergencyContactId}
						name={`${contact.firstName} ${contact.lastName}`}
						phone={contact.phoneNumber}
						relationship={contact.relationship}
						email={contact.email}
						canInvite={!contact.canActivateEmergency}
					/>
				))}
			</div>

			<div className="flex justify-center my-8">
				<Link href="/emergency-contacts/add">
					<Button className="w-[90vw] sm:w-[20vw] min-w-[18rem] !bg-customDarkGray focus:ring-black">
						Agregar Contacto
						<CirclePlus />
					</Button>
				</Link>
			</div>
		</>
	);
}
