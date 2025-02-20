'use client';

import Link from 'next/link';
import Button from './Button';

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
	return (
		<div className="w-[90vw] sm:w-[20vw] min-w-[18rem] flex justify-between items-center mt-4 p-4 bg-customLightGray rounded-lg shadow-sm gap-6">
			<div>
				<p>{name}</p>
				<p className="font-bold">({relationship})</p>
				<p>{phone}</p>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Link href={`/emergency-contacts/edit/${emergencyContactId}`}>
					<Button
						className="min-w-[5.6rem] rounded-lg bg-transparent border-2 border-customRed !text-customRed"
						onClick={() => console.log('Editar Contacto')}
					>
						Editar
					</Button>
				</Link>
				<Button className="min-w-[5.6rem] rounded-lg" onClick={() => console.log('Eliminar Contacto')}>
					Eliminar
				</Button>
			</div>
		</div>
	);
}
