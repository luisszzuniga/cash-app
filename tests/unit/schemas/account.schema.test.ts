import { describe, it, expect } from 'vitest'
import { editAccountFormSchema } from '~/core/schemas/account.schema'

describe('editAccountFormSchema', () => {
  it('should validate valid data', () => {
    const validData = {
      name: 'Compte Courant',
      description: 'Mon compte principal',
      rib: 'FR76 1234 5678 9012 3456 7890 123'
    }

    const result = editAccountFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should validate data without optional fields', () => {
    const validData = {
      name: 'Compte Courant'
    }

    const result = editAccountFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject empty name', () => {
    const invalidData = {
      name: '',
      description: 'Description'
    }

    const result = editAccountFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le nom est requis')
    }
  })

  it('should reject name too long', () => {
    const invalidData = {
      name: 'a'.repeat(256),
      description: 'Description'
    }

    const result = editAccountFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le nom ne peut pas dépasser 255 caractères')
    }
  })

  it('should reject description too long', () => {
    const invalidData = {
      name: 'Compte Courant',
      description: 'a'.repeat(1001)
    }

    const result = editAccountFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('La description ne peut pas dépasser 1000 caractères')
    }
  })

  it('should reject invalid RIB format', () => {
    const invalidData = {
      name: 'Compte Courant',
      rib: 'INVALID_RIB'
    }

    const result = editAccountFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Format RIB invalide (ex: FR76 1234 5678 9012 3456 7890 123)')
    }
  })

  it('should accept valid RIB format', () => {
    const validData = {
      name: 'Compte Courant',
      rib: 'FR76 1234 5678 9012 3456 7890 123'
    }

    const result = editAccountFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
}) 