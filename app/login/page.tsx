'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {useAuth} from '@/context/AuthContext';
import {LoginForm} from '@/components/LoginForm';
import {StrokeeLogo} from '@/components/StrokeeLogo';

export default function Login() {
	const router = useRouter();
	const {isAuthenticated, isLoading, role} = useAuth();
	
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			// Redirect based on role
			if (role === 'emergencyContact') {
				router.push('/emergency-panel');
			} else {
				// Default to dashboard for patients or any other role
				router.push('/dashboard');
			}
		}
	}, [isLoading, isAuthenticated, router, role]);
	
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-8 gap-8">
			<StrokeeLogo />
			{isLoading ? (
				<div className="w-6 h-6 border-2 border-customRed border-t-transparent rounded-full animate-spin" />
			) : (
				<>
					<LoginForm placeholder="Correo " />
					<div className="mt-4 text-center">
						<p className="text-gray-600">
							¿No tienes una cuenta?{' '}
							<Link href="/register" className="text-customRed font-semibold">
								Regístrate
							</Link>
						</p>
					</div>
				</>
			)}
		</main>
	);
}
