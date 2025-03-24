import {getCookie, setCookie, deleteCookie} from '@/utils/cookies';

describe('Cookie Utils', () => {
	beforeEach(() => {
		// Clear all cookies before each test
		document.cookie.split(';').forEach((cookie) => {
			const [name] = cookie.split('=');
			deleteCookie(name.trim());
		});
	});

	describe('setCookie', () => {
		it('sets a basic cookie', () => {
			setCookie('test', 'value');
			expect(document.cookie).toContain('test=value');
		});

		it('handles special characters in value', () => {
			setCookie('test', 'value with spaces and !@#$%');
			expect(document.cookie).toContain('test=value with spaces and !@#$%');
		});
	});

	describe('getCookie', () => {
		it('gets cookie value', () => {
			setCookie('test', 'value');
			expect(getCookie('test')).toBe('value');
		});

		it('returns undefined for non-existent cookie', () => {
			expect(getCookie('nonexistent')).toBeUndefined();
		});

		it('handles multiple cookies', () => {
			setCookie('cookie1', 'value1');
			setCookie('cookie2', 'value2');
			expect(getCookie('cookie1')).toBe('value1');
			expect(getCookie('cookie2')).toBe('value2');
		});
	});

	describe('deleteCookie', () => {
		it('deletes existing cookie', () => {
			setCookie('test', 'value');
			deleteCookie('test');
			expect(getCookie('test')).toBeUndefined();
		});

		it('handles deleting non-existent cookie', () => {
			deleteCookie('nonexistent');
			expect(document.cookie).not.toContain('nonexistent');
		});

		it('deletes cookie with specific path', () => {
			setCookie('test', 'value', {path: '/test'});
			deleteCookie('test', '/test');
			expect(getCookie('test')).toBeUndefined();
		});
	});
});
