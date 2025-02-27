'use client';

import {useState} from 'react';
import Link from 'next/link';

// Components
import Button from './Button';
import ConfirmModal from './ConfirmModal';
import toast from 'react-hot-toast';

// API
import apiClient from '@/api/api';

// Context
import {useAuth} from '@/context/AuthContext';

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
	const {user} = useAuth();

	// Delete emergency contact from the database
	const handleDeleteContact = async () => {
		if (!user) return;

		const loadingToast = toast.loading('Eliminando contacto de emergencia...');
		try {
			await apiClient.delete(`/patient/emergency-contacts/${user.uid}/${emergencyContactId}`);
			toast.success('Contacto eliminado correctamente', {id: loadingToast});

			// Redirect to the emergency contacts page
			setTimeout(() => {
				window.location.href = '/emergency-contacts';
			}, 1000);
		} catch (error) {
			toast.error('Error al eliminar el contacto de emergencia', {id: loadingToast});
			console.error(error);
		}
	};

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
