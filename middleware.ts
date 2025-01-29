import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('authToken');

	if (!token) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	try {
		// Validate token with your backend
		// const response = await fetch('YOUR_BACKEND_URL/auth/validate', {
		//   method: 'POST',
		//   headers: {
		//     'Authorization': `Bearer ${token.value}`,
		//     'Content-Type': 'application/json',
		//   },
		// });

		// if (!response.ok) {
		//   // Clear invalid token
		//   const response = NextResponse.redirect(new URL('/login', request.url));
		//   response.cookies.delete('authToken');
		//   return response;
		// }

		// Token is valid, proceed with request
		return NextResponse.next({
			headers: {
				Authorization: `Bearer ${token.value}`,
			},
		});
	} catch (error) {
		// Network error or other issues
		return NextResponse.redirect(new URL('/login', request.url));
	}
}

// Add the paths that need authentication
export const config = {
	matcher: ['/dashboard/:path*', '/patients/:path*', '/test', '/emergency/:path*'], // Add your protected routes here
};
