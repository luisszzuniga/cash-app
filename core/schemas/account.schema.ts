import * as z from 'zod'
import { Life } from '../types/life'
import { AccountType } from '../types/account'

export const createAccountSchema = z.object({
  life: z.nativeEnum(Life, {
    errorMap: () => ({ message: 'Vie invalide' })
  }),
  type: z.nativeEnum(AccountType, {
    errorMap: () => ({ message: 'Type de compte invalide' })
  }),
  name: z.string()
    .min(1, 'Le nom est obligatoire')
    .max(255, 'Le nom ne peut pas dépasser 255 caractères'),
  description: z.string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional(),
  rib: z.string()
    .optional(),
  balance: z.number()
    .min(0, 'Le solde ne peut pas être négatif')
    .max(1000000000, 'Le solde ne peut pas dépasser 1 000 000 000')
})

export type CreateAccountData = z.output<typeof createAccountSchema>

export const createAccountFormSchema = z.object({
  life: z.nativeEnum(Life, {
    required_error: 'La vie est requise',
    invalid_type_error: 'Vie invalide'
  }),
  type: z.nativeEnum(AccountType, {
    required_error: 'Le type est requis',
    invalid_type_error: 'Type invalide'
  }),
  name: z.string()
    .min(1, 'Le nom est requis')
    .max(255, 'Le nom ne peut pas dépasser 255 caractères'),
  description: z.string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional(),
  rib: z.string()
    .optional(),
  balance: z.number()
    .min(0, 'Le solde ne peut pas être négatif')
    .max(1000000000, 'Le solde ne peut pas dépasser 1 milliard')
})

export const editAccountFormSchema = z.object({
  name: z.string()
    .min(1, 'Le nom est requis')
    .max(255, 'Le nom ne peut pas dépasser 255 caractères'),
  description: z.string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional(),
  rib: z.string()
    .optional(),
})

export type CreateAccountFormData = z.infer<typeof createAccountFormSchema>
export type EditAccountFormData = z.infer<typeof editAccountFormSchema> 