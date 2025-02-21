'use client';

import Button from '@/components/Button';
import Input from '@/components/Input';
import {EmergencyContact} from '@/types';
import {ArrowBigLeft} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState, useMemo} from 'react';

export default function AddEmergencyContactPage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [relationship, setRelationship] = useState('');
	const [email, setEmail] = useState('');
	const [contacts, setContacts] = useState<EmergencyContact[]>([]);

	// Load contacts from localStorage
	useEffect(() => {
		const contacts = localStorage.getItem('emergencyContacts');
		if (contacts) {
			setContacts(JSON.parse(contacts));
		}
	}, []);

	// Disable button if any of the fields are empty
	const isDisabled = useMemo(() => {
		return !(name && phone && relationship && email);
	}, [name, phone, relationship, email]);

	// Add new contact to localStorage and redirect to emergency contacts page
	const handleAddContact = () => {
		if (name && phone && relationship && email) {
			const newContact = {
				id: contacts.length + 1,
				name,
				phone,
				relationship,
				email,
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
				<div className="flex flex-col items-center gap-4 mt-8 w-[90vw] max-w-[40rem]">
					<Input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
					<Input type="text" placeholder="Parentesco" value={relationship} onChange={(e) => setRelationship(e.target.value)} required />
					<Input type="tel" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} required />
					<Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					<Button className="rounded-lg bg-customRed !text-customWhite" disabled={isDisabled} onClick={handleAddContact}>
						Agregar Contacto
					</Button>
				</div>
			</div>
		</>
	);
}
