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
    .regex(/^FR\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{3}\s?\d{3}$/, 'Format RIB invalide (FRXX XXXX XXXX XXXX XXXX XXXX XXX)')
    .optional(),
  balance: z.number()
    .min(0, 'Le solde ne peut pas être négatif')
    .max(1000000000, 'Le solde ne peut pas dépasser 1 000 000 000')
})

export type CreateAccountData = z.output<typeof createAccountSchema>

export const createAccountFormSchema = createAccountSchema.extend({
  life: z.nativeEnum(Life).default(Life.PRO),
  type: z.nativeEnum(AccountType).default(AccountType.BANK),
  balance: z.number().default(0)
})

export type CreateAccountFormData = z.output<typeof createAccountFormSchema> 