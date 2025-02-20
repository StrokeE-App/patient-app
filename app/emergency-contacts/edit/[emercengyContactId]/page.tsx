'use client';

import Button from '@/components/Button';
import Input from '@/components/Input';
import {EmergencyContact} from '@/types';
import {ArrowBigLeft} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function EditEmergencyContactPage({params}: {params: Promise<{emercengyContactId: string}>}) {
	const router = useRouter();
	const [contactId, setContactId] = useState<number | null>(null);
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [relationship, setRelationship] = useState('');
	const [email, setEmail] = useState('');
	const [contacts, setContacts] = useState<EmergencyContact[]>([]);
	// Unwrap params promise
	useEffect(() => {
		async function unwrapParams() {
			const resolvedParams = await params;
			setContactId(Number(resolvedParams.emercengyContactId));
		}
		unwrapParams();
	}, [params]);

	// Load and pre-fill contact data once contactId is available
	useEffect(() => {
		if (contactId === null) return;
		const storedContacts = localStorage.getItem('emergencyContacts');
		if (storedContacts) {
			const parsedContacts: EmergencyContact[] = JSON.parse(storedContacts);
			setContacts(parsedContacts);
			const contact = parsedContacts.find((c) => c.id === contactId);
			if (contact) {
				setName(contact.name);
				setPhone(contact.phone);
				setRelationship(contact.relationship);
				setEmail(contact.email);
			}
		}
	}, [contactId]);

	const handleEditContact = () => {
		if (contactId !== null && name && phone && relationship && email) {
			const updatedContacts = contacts.map((contact) => (contact.id === contactId ? {...contact, name, phone, relationship, email} : contact));
			setContacts(updatedContacts);
			localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
			router.push('/emergency-contacts');
		}
	};

	// Optionally render a loading state if contactId is not yet set
	if (contactId === null) return <div>Cargando...</div>;

	return (
		<>
			<div className="text-customRed mt-4 ml-4">
				<Link href="/emergency-contacts">
					<ArrowBigLeft size={48} />
				</Link>
			</div>
			<div className="flex flex-col items-center justify-center">
				<h1 className="text-4xl font-bold text-center">Editar Contacto</h1>
				<div className="flex flex-col items-center gap-4 mt-8 w-[90vw] max-w-[40rem]">
					<Input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
					<Input type="text" placeholder="Parentesco" value={relationship} onChange={(e) => setRelationship(e.target.value)} required />
					<Input type="tel" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} required />
					<Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					<Button className="rounded-lg bg-customRed !text-customWhite" onClick={handleEditContact}>
						Editar Contacto
					</Button>
				</div>
			</div>
		</>
	);
}
