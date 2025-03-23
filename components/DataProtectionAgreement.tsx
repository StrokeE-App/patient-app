import React from 'react';

interface DataProtectionAgreementProps {
	isOpen: boolean;
	onClose: () => void;
	onAccept: () => void;
}

export default function DataProtectionAgreement({isOpen, onClose, onAccept}: DataProtectionAgreementProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
				<h2 className="text-2xl font-bold mb-4">Autorización para el Tratamiento de Datos Personales</h2>

				<div className="space-y-4 text-gray-700">
					<p>
						De conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013, autorizo a STROKEE para que, en calidad de Responsable del Tratamiento,
						realice el tratamiento de mis datos personales de acuerdo con las siguientes finalidades:
					</p>

					<ul className="list-disc pl-6 space-y-2">
						<li>Registro y gestión de mi información personal en la plataforma STROKEE.</li>
						<li>Procesamiento de mi información médica y de salud para la prestación de servicios de atención médica.</li>
						<li>Comunicación conmigo para fines relacionados con el servicio.</li>
						<li>Compartir mi información con profesionales de la salud autorizados para mi atención.</li>
						<li>Envió de notificaciones y actualizaciones sobre el servicio.</li>
						<li>Mejora y optimización de la plataforma y servicios.</li>
						<li>Cumplimiento de obligaciones legales y regulatorias.</li>
					</ul>

					<p>
						Declaro que la información proporcionada es veraz, completa, exacta, actualizada, verificable y comprensible. Me comprometo a mantenerla
						actualizada y a informar sobre cualquier cambio.
					</p>

					<p>
						Entiendo que puedo ejercer mis derechos de conocer, actualizar, rectificar y solicitar la supresión de mis datos personales, así como revocar la
						presente autorización en cualquier momento, siguiendo los procedimientos establecidos en la Ley 1581 de 2012.
					</p>

					<p>Esta autorización se entiende otorgada por un término indefinido y podrá ser revocada en cualquier momento.</p>
				</div>

				<div className="flex justify-end gap-4 mt-6">
					<button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
						Cancelar
					</button>
					<button onClick={onAccept} className="px-4 py-2 bg-customRed text-white rounded-full hover:bg-red-700">
						Aceptar
					</button>
				</div>
			</div>
		</div>
	);
}
