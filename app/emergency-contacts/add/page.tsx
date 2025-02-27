'use client';
import {useState, useMemo} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

// Components
import toast from 'react-hot-toast';
import Button from '@/components/Button';
import Input from '@/components/Input';
import {ArrowBigLeft} from 'lucide-react';

// Context
import {useAuth} from '@/context/AuthContext';

// API
import apiClient from '@/api/api';

export default function AddEmergencyContactPage() {
	const router = useRouter();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [relationship, setRelationship] = useState('');
	const [email, setEmail] = useState('');

	const {user} = useAuth();

	// Disable button if any of the fields are empty
	const isDisabled = useMemo(() => {
		return !(firstName && phoneNumber && relationship && email);
	}, [firstName, phoneNumber, relationship, email]);

	// // Add new contact to localStorage and redirect to emergency contacts page
	// const handleAddContact = () => {
	// 	if (firstName && lastName && phoneNumber && relationship && email) {
	// 		const newContact = {
	// 			id: contacts.length + 1,
	// 			firstName,
	// 			phoneNumber,
	// 			relationship,
	// 			email,
	// 		};
	// 		setContacts([...contacts, newContact]);
	// 		localStorage.setItem('emergencyContacts', JSON.stringify([...contacts, newContact]));
	// 		router.push('/emergency-contacts');
	// 	}
	// };

	// Add new contact to the database and redirect to emergency contacts page
	const handleAddContact = async () => {
		if (firstName && lastName && phoneNumber && relationship && email && user) {
			// Validate phone number format (10 digits)
			if (!/^\d{10}$/.test(phoneNumber)) {
				toast.error('Número de teléfono inválido.');
				return;
			}

			const loadingToast = toast.loading('Agregando Contacto de Emergencia...');
			try {
				await apiClient.post('/patient/emergency-contacts/add', {
					patientId: user.uid,
					contact: {
						firstName,
						lastName,
						phoneNumber,
						email,
						relationship,
					},
				});
				toast.success('Contacto de Emergencia agregado.', {id: loadingToast});
				router.push('/emergency-contacts');
			} catch (error) {
				toast.error('Error al agregar el Contacto de Emergencia.', {id: loadingToast});
				console.error(error);
			}
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
					<Input type="text" placeholder="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
					<Input type="text" placeholder="Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
					<Input type="text" placeholder="Parentesco" value={relationship} onChange={(e) => setRelationship(e.target.value)} required />
					<Input type="tel" placeholder="Teléfono" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
					<Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					<Button className="rounded-lg bg-customRed !text-customWhite" disabled={isDisabled} onClick={handleAddContact}>
						Agregar Contacto
					</Button>
				</div>
			</div>
		</>
	);
}
