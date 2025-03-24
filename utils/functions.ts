// Helper function to format date to DD/MM/AAAA
export function formatDate(date: Date): string {
	// Add 1 day to the date
	const newDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

	const day = newDate.getDate().toString().padStart(2, '0');
	const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
	const year = newDate.getFullYear();

	return `${year}-${month}-${day}`;
}

// Helper to convert a UTC ISO string to a local Date with same year/month/day
export function convertUTCToLocal(dateStr: string): Date {
	const d = new Date(dateStr);
	return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}
