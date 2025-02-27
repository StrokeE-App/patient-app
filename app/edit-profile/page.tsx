'use client';

import React from 'react';
import {ArrowBigLeft} from 'lucide-react';
import Link from 'next/link';

// Components
import Input from '@/components/Input';

export default function EditProfilePage() {
	return (
		<div>
			<div className="text-customRed mt-4 ml-4">
				<Link href="/dashboard">
					<ArrowBigLeft size={48} />
				</Link>
			</div>

			<div className="flex flex-col items-center mt-4">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Perfil</h1>
			</div>

			<div className="flex flex-col items-center mt-4 p-4 gap-5">
				<Input placeholder="Nombre" disabled={true} value="Pepito" />
				<Input placeholder="Apellido" disabled={true} value="Pepito" />
				<Input placeholder="Número celular" disabled={true} value="Pepito" />
				<Input placeholder="Edad" disabled={true} type="number" value="Pepito" />
				<Input placeholder="Fecha de Nacimiento" disabled={true} value="02/29/2024" />
				<Input placeholder="Peso" disabled={true} type="number" value="63" />
				<Input placeholder="Estatura" disabled={true} type="number" value="170" />
				<Input placeholder="Medicamentos" disabled={true} value="dolex" />
				<Input placeholder="Condiciones" disabled={true} value="gripa, dolor de cabeza" />

				<Input placeholder="Email" disabled={true} value="Pérez" />
				<Input placeholder="Contraseña" disabled={true} value="prueba123" type="password" />
			</div>

			<div className="flex justify-center mt-8">
				<button className="bg-customRed text-white px-8 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent">
					Guardar Cambios
				</button>
			</div>
		</div>
	);
}
