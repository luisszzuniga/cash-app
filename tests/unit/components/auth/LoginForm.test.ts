import { describe, it, expect, vi } from 'vitest';
import { loginSchema } from '@/core/schemas/auth.schema';

// Test simple pour valider que les schémas fonctionnent
describe('Auth Schema Validation', () => {
  it('should validate login schema', () => {
    
    // Test avec des données valides
    const validData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    expect(() => loginSchema.parse(validData)).not.toThrow();
  });

  it('should reject invalid email', () => {
    
    const invalidData = {
      email: 'invalid-email',
      password: 'password123'
    };
    
    expect(() => loginSchema.parse(invalidData)).toThrow();
  });

  it('should reject empty password', () => {
    
    const invalidData = {
      email: 'test@example.com',
      password: ''
    };
    
    expect(() => loginSchema.parse(invalidData)).toThrow();
  });
}); 