// Public routes that don't require authentication
export const publicRoutes = ['/login', '/register', '/register-emergency-contact'];

// Define route permissions by role
export const roleRoutes = {
	patient: ['/dashboard', '/edit-profile', '/emergency-contacts', '/test'],
	emergencyContact: ['/emergency-panel'],
};

// Pages accessible to all authenticated users
export const commonRoutes = ['/'];

// Protected routes that require authentication
export const protectedRoutes = [
	'/dashboard/:path*',
	'/patients/:path*',
	'/test',
	'/emergency/:path*',
	'/emergency-panel/:path*',
	'/edit-profile/:path*',
	'/emergency-contacts/:path*',
	'/register-emergency-contact/:path*',
];
