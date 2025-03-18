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

export default function EmergencyPanel() {
	const {role, user} = useAuth();
	const router = useRouter();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
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
				const response = await apiClient.get<{data: EmergencyContact[]}>(`/emergency-contact/${user.uid}`);
				const patients = response.data.data.map((contact) => ({
					id: contact.patientDetails[0].patientId,
					name: `${contact.patientDetails[0].firstName} ${contact.patientDetails[0].lastName}`,
					relationship: 'Paciente', // Since we don't have relationship in the API response
					conditions: contact.patientDetails[0].conditions,
					medications: contact.patientDetails[0].medications,
				}));
				setAssignedPatients(patients);
				setFilteredPatients(patients);
				setIsLoading(false);
			} catch (error) {
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

		try {
			await apiClient.post('/patient/start-emergency', {
				patientId: selectedPatient.id,
				role: 'emergencyContact',
				emergencyContactId: user.uid,
			});
			toast.success('Alerta de emergencia enviada.');
			setShowConfirmModal(false);
		} catch (error) {
			toast.error('Error al enviar la alerta de emergencia.');
			console.error(error);
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
								<div key={patient.id} className="border rounded-lg p-4 flex justify-between items-center">
									<div>
										<h3 className="font-medium">{patient.name}</h3>
										<p className="text-sm text-gray-500">Condiciones: {patient.conditions.join(', ')}</p>
										<p className="text-sm text-gray-500">Medicamentos: {patient.medications.join(', ')}</p>
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
		</div>
	);
}
