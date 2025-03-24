import {formatDate, convertUTCToLocal} from '@/utils/functions';

describe('Date Utils', () => {
	describe('formatDate', () => {
		it('formats date correctly', () => {
			const date = new Date('2024-03-23');
			expect(formatDate(date)).toBe('2024-03-23');
		});

		it('handles single digit days and months', () => {
			const date = new Date('2024-01-01');
			expect(formatDate(date)).toBe('2024-01-01');
		});

		it('handles end of month', () => {
			const date = new Date('2024-03-31');
			expect(formatDate(date)).toBe('2024-03-31');
		});

		it('handles leap year', () => {
			const date = new Date('2024-02-29');
			expect(formatDate(date)).toBe('2024-02-29');
		});
	});

	describe('convertUTCToLocal', () => {
		it('converts UTC date to local date', () => {
			const utcDate = '2024-03-23T00:00:00Z';
			const localDate = convertUTCToLocal(utcDate);

			// The exact values will depend on the local timezone
			expect(localDate.getUTCFullYear()).toBe(2024);
			expect(localDate.getUTCMonth()).toBe(2); // March (0-based)
			expect(localDate.getUTCDate()).toBe(23);
		});

		it('handles different timezones correctly', () => {
			const utcDate = '2024-03-23T23:59:59Z';
			const localDate = convertUTCToLocal(utcDate);

			// The date should be the same regardless of timezone
			expect(localDate.getUTCFullYear()).toBe(2024);
			expect(localDate.getUTCMonth()).toBe(2);
			expect(localDate.getUTCDate()).toBe(23);
		});
	});
});
