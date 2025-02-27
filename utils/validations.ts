export const isValidPhoneNumber = (phoneNumber: string): boolean => {
	return /^\d{10}$/.test(phoneNumber);
};

export const isValidEmail = (email: string): boolean => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
