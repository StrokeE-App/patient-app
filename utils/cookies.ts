// Get cookie by name from document.cookie
export const getCookie = (name: string): string | undefined => {
	if (typeof document === 'undefined') return undefined; // Handle server-side rendering
	
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		const cookieValue = parts.pop()?.split(';').shift();
		return cookieValue;
	}
	return undefined;
};

// Set a cookie with a given name, value, and options
export const setCookie = (name: string, value: string, options: { path?: string, expires?: Date, maxAge?: number, secure?: boolean, sameSite?: 'strict' | 'lax' | 'none' } = {}): void => {
	if (typeof document === 'undefined') return; // Handle server-side rendering
	
	let cookie = `${name}=${value}`;
	
	if (options.path) cookie += `; path=${options.path}`;
	if (options.expires) cookie += `; expires=${options.expires.toUTCString()}`;
	if (options.maxAge) cookie += `; max-age=${options.maxAge}`;
	if (options.secure) cookie += '; secure';
	if (options.sameSite) cookie += `; samesite=${options.sameSite}`;
	
	document.cookie = cookie;
};

// Delete a cookie by setting its expiration date to the past
export const deleteCookie = (name: string, path = '/'): void => {
	if (typeof document === 'undefined') return; // Handle server-side rendering
	
	document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
};
