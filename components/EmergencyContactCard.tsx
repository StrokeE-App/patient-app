'use client';

import {useState} from 'react';
import Link from 'next/link';
import Button from './Button';
import ConfirmModal from './ConfirmModal';
import {EmergencyContact} from '@/types';
import toast from 'react-hot-toast';

type EmergencyContactCardProps = {
	name?: string;
	phone?: string;
	relationship?: string;
	emergencyContactId: number;
};

export default function EmergencyContactCard({
	name = 'Pepito Pérez',
	phone = '+57 123 456 7890',
	relationship = 'Padre',
	emergencyContactId,
}: EmergencyContactCardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleDeleteContact = () => {
		const storedContacts = localStorage.getItem('emergencyContacts');
		if (storedContacts) {
			const parsedContacts: EmergencyContact[] = JSON.parse(storedContacts);
			const updatedContacts = parsedContacts.filter((contact) => contact.id !== emergencyContactId);
			localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
			setIsModalOpen(false);
		}
		// Add a toast notification to confirm the deletion
		toast.success('Contacto eliminado correctamente');

		// Redirect to the emergency contacts page
		setTimeout(() => {
			window.location.href = '/emergency-contacts';
		}, 2000);
	};

	console.log(emergencyContactId);

	return (
		<>
			<div className="w-[90vw] sm:w-[20vw] min-w-[18rem] flex justify-between items-center mt-4 p-4 bg-customLightGray rounded-lg shadow-sm gap-6">
				<div>
					<p>{name}</p>
					<p className="font-bold">({relationship})</p>
					<p>{phone}</p>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Link href={`/emergency-contacts/edit/${emergencyContactId}`}>
						<Button className="min-w-[5.6rem] rounded-lg bg-transparent border-2 border-customRed !text-customRed">Editar</Button>
					</Link>
					<Button className="min-w-[5.6rem] rounded-lg" onClick={() => setIsModalOpen(true)}>
						Eliminar
					</Button>
				</div>
			</div>
			<ConfirmModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={() => handleDeleteContact()}
				title="¿Estás seguro de que deseas eliminar este contacto?"
			/>
		</>
	);
}
