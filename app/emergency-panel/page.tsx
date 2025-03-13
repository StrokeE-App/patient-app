'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Image from 'next/image';
import ConfirmStrokeComponent from '@/components/ConfirmStrokeComponent';
import SettingsMenu from '@/components/SettingsMenu';
import Input from '@/components/Input';

export default function EmergencyPanel() {
  const { role, user } = useAuth();
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [assignedPatients, setAssignedPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  // Redirect if user is not an emergency contact
  useEffect(() => {
    if (role && role !== 'emergencyContact') {
      router.push('/dashboard');
    }
  }, [role, router]);
  
  // Mock function to fetch assigned patients - replace with actual API call
  useEffect(() => {
    // TODO: Replace with actual API call to get patients assigned to this emergency contact
    const fetchAssignedPatients = async () => {
      try {
        // Mock data for now
        const patients = [
          { id: 1, name: 'John Doe', relationship: 'Father' },
          { id: 2, name: 'Jane Smith', relationship: 'Mother' },
          { id: 3, name: 'Alice Johnson', relationship: 'Sister' },
          { id: 4, name: 'Bob Johnson', relationship: 'Brother' },
        ];
        setAssignedPatients(patients);
        setFilteredPatients(patients);
      } catch (error) {
        console.error('Error fetching assigned patients:', error);
      }
    };
    fetchAssignedPatients();
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPatients(assignedPatients);
    } else {
      const filtered = assignedPatients.filter(
        patient => 
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          patient.relationship.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, assignedPatients]);

  const handleEmergencyActivation = (patient: any) => {
    setSelectedPatient(patient);
    setShowConfirmModal(true);
  };
  
  const handleConfirmEmergency = async () => {
    try {
      // TODO: Implement actual API call to trigger emergency
      console.log(`Emergency triggered for patient: ${selectedPatient.name}`);
      
      // Mock success for now
      alert(`Emergency alert sent for ${selectedPatient.name}`);
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error triggering emergency:', error);
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
          Reconoce un ACV con la regla <b>BEFAST</b>
          </p>

          <ul className='list-disc list-inside'>
            <li>
            <b>B</b>alance (Equilibrio): Pérdida repentina del equilibrio o coordinación.
            </li>
            <li><b>E</b>yes (Vista): Visión borrosa o pérdida de visión en uno o ambos ojos.</li>
            <li><b>F</b>ace (Cara): Caída o asimetría en un lado de la cara.</li>
            <li><b>A</b>rms (Brazos): Dificultad para levantar un brazo o debilidad en un lado del cuerpo.</li>
            <li><b>S</b>peech (Habla): Dificultad para hablar o comprender el lenguaje.</li>
            <li><b>T</b>ime (Tiempo): ¡Cada segundo cuenta! Llama a emergencias de inmediato.</li>
          </ul>
          <br />
        
        
        
        
        
        
          
          {/* Search input for filtering patients */}
          <div className="mb-6 hover:scale-105 transition-transform duration-300 ease-out">
            <Input
              type="text"
              placeholder="Buscar paciente por nombre o parentesco..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            //   className="w-full"
            //   icon={
            //     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            //       <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            //     </svg>
            //   }
            />
          </div>
          
          {filteredPatients.length > 0 ? (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{patient.name}</h3>
                    <p className="text-sm text-gray-500">Parentesco: {patient.relationship}</p>
                  </div>
                  <div 
                    onClick={() => handleEmergencyActivation(patient)}
                    className="cursor-pointer hover:scale-105 transition-transform duration-300 ease-out"
                  >
                    <Image 
                      src="/images/panic-button.svg" 
                      alt="Emergency" 
                      width={128} 
                      height={128} 
                      className="mr-2" 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron pacientes con ese criterio de búsqueda.</p>
            </div>
          )}

          {assignedPatients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No tienes pacientes conectados a tu cuenta.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* {showConfirmModal && selectedPatient && (
        <ConfirmStrokeComponent
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmEmergency}
          title={`¿Confirmar emergencia para ${selectedPatient.name}?`}
          description="¿Estás seguro de que deseas activar una alerta de emergencia? Esto notificará a los servicios de emergencia."
        />
      )} */}
    </div>
  );
}