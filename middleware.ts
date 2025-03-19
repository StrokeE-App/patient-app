import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

// Config
import {publicRoutes, roleRoutes, commonRoutes} from '@/config/routes';

export async function middleware(request: NextRequest) {
	// Get authentication token
	const token = request.cookies.get('authToken');

	// Extract the path
	const path = request.nextUrl.pathname;

	// Allow access to public routes without authentication
	if (publicRoutes.some((route) => path === route || path.startsWith(`${route}/`))) {
		return NextResponse.next();
	}

	// Redirect to login if no token and trying to access protected route
	if (!token) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// Get user role
	const role = request.cookies.get('userRole')?.value;

	// Check if the path is accessible based on role
	if (role) {
		// Allow access to common routes for all authenticated users
		if (commonRoutes.some((route) => path === route || path.startsWith(`${route}/`))) {
			return NextResponse.next({
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
			});
		}

		// Check if the current path is allowed for the user's role
		const allowedRoutes = roleRoutes[role as keyof typeof roleRoutes] || [];
		const hasAccess = allowedRoutes.some((route) => path === route || path.startsWith(`${route}/`));

		if (!hasAccess) {
			// If patient, redirect to dashboard
			if (role === 'patient') {
				return NextResponse.redirect(new URL('/dashboard', request.url));
			}
			// If emergency contact, redirect to emergency panel
			else if (role === 'emergencyContact') {
				return NextResponse.redirect(new URL('/emergency-panel', request.url));
			}
		}
	}

	// If we reach here, allow the request with the auth token
	return NextResponse.next({
		headers: {
			Authorization: `Bearer ${token.value}`,
		},
	});
}

// Add the paths that need authentication
export const config = {
	matcher: [
		'/dashboard/:path*',
		'/patients/:path*',
		'/test',
		'/emergency/:path*',
		'/emergency-panel/:path*',
		'/edit-profile/:path*',
		'/emergency-contacts/:path*',
		'/register-emergency-contact/:path*',
	],
};
