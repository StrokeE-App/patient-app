import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {AuthProvider} from '@/context/AuthContext';
import {Toaster} from 'react-hot-toast';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'StrokeE - Patient App',
	description: 'Emergency response system for patients',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es" className="bg-customWhite">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-customWhite`}>
				<AuthProvider>{children}</AuthProvider>
				<Toaster position="top-center" />
			</body>
		</html>
	);
}
