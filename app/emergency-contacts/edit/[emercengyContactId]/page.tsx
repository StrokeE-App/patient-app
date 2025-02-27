'use client';
import {useEffect, useState, useMemo} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

// Components
import toast from 'react-hot-toast';
import {ArrowBigLeft} from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';

// API
import apiClient from '@/api/api';

// Context
import {useAuth} from '@/context/AuthContext';

// Utils
import {isValidEmail, isValidPhoneNumber} from '@/utils/validations';

export default function EditEmergencyContactPage({params}: {params: Promise<{emercengyContactId: string}>}) {
	const router = useRouter();
	const [contactId, setContactId] = useState<string | null>(null);
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

	// Unwrap params promise
	useEffect(() => {
		async function unwrapParams() {
			const resolvedParams = await params;
			setContactId(resolvedParams.emercengyContactId);
		}
		unwrapParams();
	}, [params]);

	// Load contact data
	useEffect(() => {
		if (contactId === null) return;
		if (!user) return;

		const getPatientData = async () => {
			const loadingToast = toast.loading('Cargando Contacto de Emergencia...');
			try {
				const response = await apiClient.get(`/patient/emergency-contacts/${user.uid}/${contactId}`);
				const contactData = response.data.data;
				setFirstName(contactData.firstName);
				setLastName(contactData.lastName);
				setPhoneNumber(contactData.phoneNumber);
				setRelationship(contactData.relationship);
				setEmail(contactData.email);
				toast.success('Contacto de Emergencia cargado.', {id: loadingToast});
			} catch (error) {
				toast.error('Error al cargar el Contacto de Emergencia.', {id: loadingToast});
				console.error(error);
			}
		};

		getPatientData();
	}, [contactId, user]);

	// Edit contact data in the database and redirect to emergency contacts page
	const handleEditContact = async () => {
		if (user && contactId && firstName && lastName && phoneNumber && relationship && email) {
			// Validate phone number format (10 digits)
			if (!isValidPhoneNumber(phoneNumber)) {
				toast.error('Número de teléfono inválido.');
				return;
			}

			// Validate email format
			if (!isValidEmail(email)) {
				toast.error('Email inválido.');
				return;
			}

			const loadingToast = toast.loading('Editando Contacto de Emergencia...');

			try {
				await apiClient.put(`/patient/emergency-contacts/${user.uid}/${contactId}`, {
					contact: {
						firstName,
						lastName,
						phoneNumber,
						email,
						relationship,
					},
				});
				toast.success('Contacto de Emergencia editado.', {id: loadingToast});
				router.push('/emergency-contacts');
			} catch (error) {
				toast.error('Error al editar el Contacto de Emergencia.', {id: loadingToast});
				console.error(error);
			}
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
				<form className="flex flex-col items-center gap-4 mt-8 w-[90vw] max-w-[40rem]">
					<Input type="text" placeholder="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
					<Input type="text" placeholder="Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
					<Input type="text" placeholder="Parentesco" value={relationship} onChange={(e) => setRelationship(e.target.value)} required />
					<Input type="tel" placeholder="Teléfono" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
					<Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					<Button onClick={handleEditContact} className="rounded-lg bg-customRed !text-customWhite" disabled={isDisabled}>
						Editar Contacto
					</Button>
				</form>
			</div>
		</>
	);
}
