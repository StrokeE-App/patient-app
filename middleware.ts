import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

// Define route permissions by role
const roleRoutes = {
  patient: ['/dashboard', '/edit-profile', '/emergency-contacts', '/test'],
  emergencyContact: ['/emergency-panel'],
};

// Pages accessible to all authenticated users
const commonRoutes = ['/'];

export async function middleware(request: NextRequest) {
  // Get authentication token
  const token = request.cookies.get('authToken');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Get user role
  const role = request.cookies.get('userRole')?.value;
  
  // Extract the path
  const path = request.nextUrl.pathname;
  
  // Check if the path is accessible based on role
  if (role) {
    // Allow access to common routes for all authenticated users
    if (commonRoutes.some(route => path === route || path.startsWith(`${route}/`))) {
      return NextResponse.next({
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
    }

    // Check if the current path is allowed for the user's role
    const allowedRoutes = roleRoutes[role as keyof typeof roleRoutes] || [];
    const hasAccess = allowedRoutes.some(route => 
      path === route || path.startsWith(`${route}/`)
    );

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
    '/emergency-contacts/:path*'
  ],
};
