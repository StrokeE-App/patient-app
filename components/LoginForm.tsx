'use client';

import {useState} from 'react';
import {SignIn} from '@/firebase/config';
import toast from 'react-hot-toast';

type LoginFormProps = {
	placeholder?: string;
};

export function LoginForm({placeholder = 'Usuario'}: LoginFormProps) {
	const [username, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		const loadingToast = toast.loading('Iniciando sesión...');

		try {
			await SignIn(username, password);
			toast.success('¡Bienvenido!', {id: loadingToast});
		} catch {
			toast.error('Usuario o contraseña incorrectos', {id: loadingToast});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
			<div className="space-y-4">
				<div>
					<input
						type="email"
						placeholder={placeholder}
						value={username}
						onChange={(e) => setUserName(e.target.value)}
						className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
						required
					/>
				</div>
				<div>
					<input
						type="password"
						placeholder="Contraseña"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
						required
					/>
				</div>
			</div>
			<button
				type="submit"
				disabled={isLoading}
				className="w-full px-4 py-3 text-white bg-customRed rounded-full hover:bg-gustomRed focus:outline-none focus:ring-2 focus:ring-customRed focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isLoading ? 'Cargando...' : 'Iniciar Sesión'}
			</button>
		</form>
	);
}
