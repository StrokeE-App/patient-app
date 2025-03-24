import {isValidEmail, isValidPhoneNumber} from '@/utils/validations';

describe('Validation Utils', () => {
	describe('isValidPhoneNumber', () => {
		it('validates correct phone numbers', () => {
			expect(isValidPhoneNumber('1234567890')).toBe(true);
			expect(isValidPhoneNumber('9876543210')).toBe(true);
		});

		it('rejects invalid phone numbers', () => {
			expect(isValidPhoneNumber('123')).toBe(false);
			expect(isValidPhoneNumber('12345678901')).toBe(false);
			expect(isValidPhoneNumber('abcdefghij')).toBe(false);
			expect(isValidPhoneNumber('')).toBe(false);
		});
	});

	describe('isValidEmail', () => {
		it('validates correct email addresses', () => {
			expect(isValidEmail('test@example.com')).toBe(true);
			expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
			expect(isValidEmail('user+tag@example.com')).toBe(true);
		});

		it('rejects invalid email addresses', () => {
			expect(isValidEmail('')).toBe(false);
			expect(isValidEmail('test@')).toBe(false);
			expect(isValidEmail('@example.com')).toBe(false);
			expect(isValidEmail('test@.com')).toBe(false);
			expect(isValidEmail('test@com.')).toBe(false);
		});
	});
});
