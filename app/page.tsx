'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {StrokeeLogo} from '@/components/StrokeeLogo';

export default function HomePage() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && role) {
      // Redirect based on role
      if (role === 'patient') {
        router.push('/dashboard');
      } else if (role === 'emergencyContact') {
        router.push('/emergency-panel');
      }
    } else if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, role, router]);

  // Show loading state while authentication is being checked
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <StrokeeLogo />
      <h1 className="text-2xl font-bold mb-4">Bienvenido a StrokeE.</h1>
      <div className="animate-pulse text-blue-600">Cargando...</div>
    </div>
  );
}
