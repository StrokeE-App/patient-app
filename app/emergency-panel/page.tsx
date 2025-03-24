'use client';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

// Components
import SettingsMenu from '@/components/SettingsMenu';
import Input from '@/components/Input';
import ConfirmModal from '@/components/ConfirmModal';

// Contexts
import {useAuth} from '@/context/AuthContext';

// API
import apiClient from '@/api/api';

// Types
import {Patient, EmergencyContact} from '@/types/emergencyContact';
import {AxiosError} from 'axios';

// Verification Code Modal Component
function VerificationCodeModal({isOpen, onClose, onSubmit}: {isOpen: boolean; onClose: () => void; onSubmit: (code: string) => Promise<void>}) {
	const [verificationCode, setVerificationCode] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {value} = e.target;
		// Only allow numbers and limit to 6 characters
		const numericValue = value.replace(/[^0-9]/g, '');
		setVerificationCode(numericValue.slice(0, 6));
	};

	const handleSubmit = async () => {
		if (verificationCode.length !== 6) {
			toast.error('El código de verificación debe tener 6 dígitos.');
			return;
		}

		setIsSubmitting(true);
		try {
			await onSubmit(verificationCode);
			setVerificationCode('');
			onClose();
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
				<h3 className="text-xl font-semibold mb-4">Agregar nuevo paciente</h3>
				<p className="text-gray-600 mb-4">Ingresa el código de verificación de 6 dígitos proporcionado por el paciente.</p>

				<Input
					name="verificationCode"
					placeholder="Código de verificación (6 dígitos)"
					type="text"
					value={verificationCode}
					onChange={handleVerificationCodeChange}
					required
					maxLength={6}
				/>

				<div className="flex justify-end gap-4 mt-6">
					<button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
						Cancelar
					</button>
					<button
						onClick={handleSubmit}
						disabled={isSubmitting || verificationCode.length !== 6}
						className="px-4 py-2 bg-customRed text-white rounded-lg hover:bg-customRed/80 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
					>
						{isSubmitting ? 'Agregando...' : 'Agregar Paciente'}
					</button>
				</div>
			</div>
		</div>
	);
}

export default function EmergencyPanel() {
	const {role, user} = useAuth();
	const router = useRouter();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showVerificationModal, setShowVerificationModal] = useState(false);
	const [assignedPatients, setAssignedPatients] = useState<Patient[]>([]);
	const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Redirect if user is not an emergency contact
	useEffect(() => {
		if (role && role !== 'emergencyContact') {
			router.push('/dashboard');
		}
	}, [role, router]);

	// Fetch assigned patients from API
	useEffect(() => {
		const fetchAssignedPatients = async () => {
			if (!user) return;

			try {
				setIsLoading(true);
				const response = await apiClient.get<{data: {data: EmergencyContact}}>(`/emergency-contact/${user.uid}`);
				const emergencyContact = response.data.data.data;
				// console.log('MY EMERGENCY CONTACT: ', emergencyContact);

				const patients = emergencyContact.patientDetails.map((patient) => ({
					id: patient.patientId,
					name: `${patient.firstName} ${patient.lastName}`,
					relationship: 'Paciente', // Since we don't have relationship in the API response
					conditions: patient.conditions,
					medications: patient.medications,
					phoneNumber: patient.phoneNumber,
					email: patient.email,
					emergencyContactId: patient.emergencyContactId,
				}));
				setAssignedPatients(patients);
				setFilteredPatients(patients);
				setIsLoading(false);
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(error.response?.data.message);
				} else {
					toast.error('Error al obtener los pacientes asignados.');
				}
				console.error('Error fetching assigned patients:', error);
				setIsLoading(false);
			}
		};
		fetchAssignedPatients();
	}, [user]);

	// Filter patients based on search term
	useEffect(() => {
		if (searchTerm.trim() === '') {
			setFilteredPatients(assignedPatients);
		} else {
			const filtered = assignedPatients.filter(
				(patient) =>
					patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.relationship.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredPatients(filtered);
		}
	}, [searchTerm, assignedPatients]);

	const handleEmergencyActivation = (patient: Patient) => {
		setSelectedPatient(patient);
		setShowConfirmModal(true);
	};

	const handleConfirmEmergency = async () => {
		if (!selectedPatient || !user) return;

		const loadingToast = toast.loading('Enviando alerta de emergencia...');
		try {
			await apiClient.post('/patient/start-emergency', {
				patientId: selectedPatient.id,
				role: 'emergencyContact',
				emergencyContactId: selectedPatient.emergencyContactId,
			});
			toast.success('Alerta de emergencia enviada.', {id: loadingToast});
			setShowConfirmModal(false);
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data.message, {id: loadingToast});
			} else {
				toast.error('Error al enviar la alerta de emergencia.', {id: loadingToast});
			}
			console.error(error);
		}
	};

	// Function to handle adding a new patient
	const handleAddPatient = async (verificationCode: string) => {
		if (!user) {
			toast.error('Usuario no autenticado');
			return;
		}

		try {
			await apiClient.post('/emergency-contact/add-patient', {
				userId: user.uid,
				code: verificationCode,
			});
			toast.success('Paciente agregado exitosamente');

			// Refresh the patient list
			const response = await apiClient.get<{data: {data: EmergencyContact}}>(`/emergency-contact/${user.uid}`);
			const emergencyContact = response.data.data.data;
			const patients = emergencyContact.patientDetails.map((patient) => ({
				id: patient.patientId,
				name: `${patient.firstName} ${patient.lastName}`,
				relationship: 'Paciente',
				conditions: patient.conditions,
				medications: patient.medications,
				phoneNumber: patient.phoneNumber,
				email: patient.email,
				emergencyContactId: patient.emergencyContactId,
			}));
			setAssignedPatients(patients);
			setFilteredPatients(patients);
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data.message);
			} else {
				toast.error('Error al agregar el paciente');
			}
			throw error; // Re-throw to handle in the modal
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="flex justify-start items-center p-4">
				<SettingsMenu />
			</div>
			<main className="container mx-auto p-4">
				<div className="bg-white rounded-lg shadow p-6 mb-6 max-w-[37.5rem] mx-auto">
					<h2 className="text-xl font-semibold mb-4">Activa una emergencia para tu familiar o persona cercana.</h2>
					<p className="text-gray-600 mb-6">
						Reconoce un ACV con la regla <b>RAPIDO</b>
					</p>

					<div className="flex justify-center items-center">
						<Image src="/images/RAPIDO_BLACK.png" alt="Escala RAPIDO para detectar un ACV" width={600} height={300} />
					</div>

					{/* 					<ul className="list-disc list-inside">
						<li>
							<b>B</b>alance (Equilibrio): Pérdida repentina del equilibrio o coordinación.
						</li>
						<li>
							<b>E</b>yes (Vista): Visión borrosa o pérdida de visión en uno o ambos ojos.
						</li>
						<li>
							<b>F</b>ace (Cara): Caída o asimetría en un lado de la cara.
						</li>
						<li>
							<b>A</b>rms (Brazos): Dificultad para levantar un brazo o debilidad en un lado del cuerpo.
						</li>
						<li>
							<b>S</b>peech (Habla): Dificultad para hablar o comprender el lenguaje.
						</li>
						<li>
							<b>T</b>ime (Tiempo): ¡Cada segundo cuenta! Llama a emergencias de inmediato.
						</li>
					</ul> */}
					<br />

					{/* Search input for filtering patients */}
					<div className="mb-6 hover:scale-105 transition-transform duration-300 ease-out">
						<Input type="text" placeholder="Buscar paciente por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
					</div>

					{filteredPatients.length > 0 && (
						<div className="space-y-4">
							{filteredPatients.map((patient) => (
								<div
									key={patient.id}
									className="border rounded-lg p-4 flex justify-between items-center flex-col gap-4 text-center sm:flex-row sm:gap-0 sm:text-left"
								>
									<div>
										<h3 className="font-medium">{patient.name}</h3>
										<p className="text-sm text-gray-500">Condiciones: {patient.conditions.join(', ')}</p>
										<p className="text-sm text-gray-500">Medicamentos: {patient.medications.join(', ')}</p>
										<p className="text-sm text-gray-500">Teléfono: {patient.phoneNumber}</p>
										<p className="text-sm text-gray-500">Email: {patient.email}</p>
									</div>
									<div
										onClick={() => handleEmergencyActivation(patient)}
										className="cursor-pointer hover:scale-105 transition-transform duration-300 ease-out"
									>
										<Image src="/images/panic-button.svg" alt="Emergency" width={128} height={128} className="mr-2" />
									</div>
								</div>
							))}
						</div>
					)}

					{isLoading && (
						<div className="text-center py-8">
							<p className="text-gray-500">Cargando pacientes...</p>
						</div>
					)}

					{filteredPatients.length === 0 && assignedPatients.length > 0 && (
						<div className="text-center py-8">
							<p className="text-gray-500">No se encontraron pacientes con ese criterio de búsqueda.</p>
						</div>
					)}

					{assignedPatients.length === 0 && !isLoading && (
						<div className="text-center py-8">
							<p className="text-gray-500">No tienes pacientes conectados a tu cuenta.</p>
						</div>
					)}

					{/* Add new patient section */}
					<div className="mt-4 p-4 border rounded-lg bg-gray-50">
						<h3 className="text-lg font-semibold mb-4">Agregar nuevo paciente</h3>
						<button
							onClick={() => setShowVerificationModal(true)}
							className="w-full px-4 py-2 bg-customRed text-white rounded-lg hover:bg-red-500 transition-colors"
						>
							Agregar Paciente
						</button>
					</div>
				</div>
			</main>
			{showConfirmModal && selectedPatient && (
				<ConfirmModal
					isOpen={showConfirmModal}
					onClose={() => setShowConfirmModal(false)}
					onConfirm={handleConfirmEmergency}
					title={`¿Confirmar emergencia para ${selectedPatient.name}?`}
				/>
			)}

			<VerificationCodeModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} onSubmit={handleAddPatient} />
		</div>
	);
}
