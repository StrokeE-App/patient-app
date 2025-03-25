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
	manifest: '/manifest.json',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'StrokeE',
	},
	viewport: {
		width: 'device-width',
		initialScale: 1,
		maximumScale: 1,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es" className="bg-customWhite">
			<head>
				<link rel="apple-touch-icon" sizes="192x192" href="/strokee-192x192.png" />
				<link rel="apple-touch-icon" sizes="512x512" href="/strokee-512x512.png" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="theme-color" content="#000000" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-customWhite`}>
				<AuthProvider>{children}</AuthProvider>
				<Toaster position="top-center" />
			</body>
		</html>
	);
}
