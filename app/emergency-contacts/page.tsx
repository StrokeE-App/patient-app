'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';

// Components
import Button from '@/components/Button';
import EmergencyContactCard from '@/components/EmergencyContactCard';
import {ArrowBigLeft, CirclePlus} from 'lucide-react';

// Mocks
import {emergencyContactsList} from '@/mocks/emergency';
import {EmergencyContact} from '@/types';

export default function EmergencyContactsPage() {
	const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

	useEffect(() => {
		const emergencyContacts = localStorage.getItem('emergencyContacts');
		if (emergencyContacts) {
			setEmergencyContacts(JSON.parse(emergencyContacts));
		} else {
			setEmergencyContacts(emergencyContactsList);
			localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContactsList));
		}
	}, []);

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
					<EmergencyContactCard key={index} name={contact.name} phone={contact.phone} relationship={contact.relationship} />
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
