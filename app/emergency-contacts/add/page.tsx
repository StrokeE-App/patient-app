'use client';

import Button from '@/components/Button';
import Input from '@/components/Input';
import {EmergencyContact} from '@/types';
import {ArrowBigLeft} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function AddEmergencyContactPage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [relationship, setRelationship] = useState('');
	const [contacts, setContacts] = useState<EmergencyContact[]>([]);
	useEffect(() => {
		const contacts = localStorage.getItem('emergencyContacts');
		if (contacts) {
			setContacts(JSON.parse(contacts));
		}
	}, []);
	const handleAddContact = () => {
		if (name && phone && relationship) {
			const newContact = {
				id: contacts.length + 1,
				name,
				phone,
				relationship,
			};
			setContacts([...contacts, newContact]);
			localStorage.setItem('emergencyContacts', JSON.stringify([...contacts, newContact]));
			router.push('/emergency-contacts');
		}
	};
	return (
		<>
			<div className="text-customRed mt-4 ml-4">
				<Link href="/emergency-contacts">
					<ArrowBigLeft size={48} />
				</Link>
			</div>
			<div className="flex flex-col items-center justify-center">
				<h1 className="text-4xl font-bold text-center">Nuevo Contacto</h1>
				<div className="flex flex-col items-center gap-4 mt-8">
					<Input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
					<Input type="tel" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} required />
					<Input type="text" placeholder="Parentesco" value={relationship} onChange={(e) => setRelationship(e.target.value)} required />
					<Button className="rounded-lg bg-customRed !text-customWhite" onClick={handleAddContact}>
						Agregar Contacto
					</Button>
				</div>
			</div>
		</>
	);
}
