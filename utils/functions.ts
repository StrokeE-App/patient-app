// Helper function to format date to DD/MM/AAAA
export function formatDate(date: Date): string {
	const day = (date.getDate() + 1).toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${year}-${month}-${day}`;
}

// Helper to convert a UTC ISO string to a local Date with same year/month/day
export function convertUTCToLocal(dateStr: string): Date {
	const d = new Date(dateStr);
	return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}