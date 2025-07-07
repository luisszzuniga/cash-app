import { describe, it, expect, vi } from 'vitest';
import { loginSchema } from '@/core/schemas/auth.schema';

describe('Auth API', () => {
  it('should validate login schema', () => {
    
    // Test avec des données valides
    const validData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    expect(() => loginSchema.parse(validData)).not.toThrow();
  });

  it('should reject invalid login data', () => {
    
    const invalidData = {
      email: 'invalid-email',
      password: ''
    };
    
    expect(() => loginSchema.parse(invalidData)).toThrow();
  });
}); 