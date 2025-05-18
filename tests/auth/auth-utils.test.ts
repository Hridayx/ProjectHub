import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { generateToken, verifyPasswordStrength, verifyEmailDomain } from '@/lib/auth-utils';
import { AUTH_ERRORS, ApiErrorResponse } from '@/lib/api-error';

describe('Authentication Utils', () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  describe('generateToken', () => {
    const mockUser = {
      userId: '123',
      email: 'test@mahindrauniversity.edu.in',
      role: 'student' as const,
      isVerified: true,
      username: 'testuser',
    };

    test('should generate a valid JWT token', () => {
      const token = generateToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });    test('should throw error if JWT_SECRET is not defined', () => {
      delete process.env.JWT_SECRET;
      expect(() => generateToken(mockUser)).toThrow(ApiErrorResponse);
    });
  });

  describe('verifyPasswordStrength', () => {
    test('should validate strong passwords', () => {
      expect(verifyPasswordStrength('Test@123Password')).toEqual({
        isValid: true,
      });
    });

    test('should reject passwords shorter than 8 characters', () => {
      expect(verifyPasswordStrength('weak')).toEqual({
        isValid: false,
        message: 'Password must be at least 8 characters long',
      });
    });

    test('should require both uppercase and lowercase letters', () => {
      expect(verifyPasswordStrength('password123!')).toEqual({
        isValid: false,
        message: 'Password must contain both uppercase and lowercase letters',
      });
    });

    test('should require at least one number', () => {
      expect(verifyPasswordStrength('Password!')).toEqual({
        isValid: false,
        message: 'Password must contain at least one number',
      });
    });

    test('should require at least one special character', () => {
      expect(verifyPasswordStrength('Password123')).toEqual({
        isValid: false,
        message: 'Password must contain at least one special character (!@#$%^&*)',
      });
    });
  });

  describe('verifyEmailDomain', () => {
    test('should validate Mahindra University email addresses', () => {
      expect(verifyEmailDomain('test.user@mahindrauniversity.edu.in')).toBe(true);
    });

    test('should reject non-Mahindra University email addresses', () => {
      expect(verifyEmailDomain('test.user@gmail.com')).toBe(false);
      expect(verifyEmailDomain('test.user@otherdomain.com')).toBe(false);
      expect(verifyEmailDomain('invalid-email')).toBe(false);
    });
  });
});
