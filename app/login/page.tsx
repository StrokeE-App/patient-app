'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/context/AuthContext';
import {LoginForm} from '@/components/LoginForm';
import {StrokeeLogo} from '@/components/StrokeeLogo';

export default function Login() {
	const router = useRouter();
	const {isAuthenticated, isLoading} = useAuth();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push('/dashboard');
		}
	}, [isLoading, isAuthenticated, router]);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-8 gap-8">
			<StrokeeLogo />

			{isLoading ? (
				<div className="w-6 h-6 border-2 border-customRed border-t-transparent rounded-full animate-spin" />
			) : (
				<LoginForm placeholder="Correo" />
			)}
		</main>
	);
}
