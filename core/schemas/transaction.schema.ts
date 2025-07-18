import { z } from 'zod'
import { Life } from '~/core/types/life'
import { TransactionType } from '~/core/types/transaction'

// Schéma pour l'ajout d'un revenu
export const addIncomeFormSchema = z.object({
  life: z.nativeEnum(Life, {
    required_error: 'La vie est requise',
    invalid_type_error: 'Vie invalide'
  }),
  accountId: z.string({
    required_error: 'Le compte est requis'
  }).min(1, 'Le compte est requis'),
  label: z.string()
    .min(1, 'Le libellé est requis')
    .max(255, 'Le libellé ne peut pas dépasser 255 caractères'),
  amount: z.number()
    .min(0.01, 'Le montant doit être supérieur à 0')
    .max(1000000000, 'Le montant ne peut pas dépasser 1 milliard'),
  date: z.string().optional().default(() => new Date().toISOString().split('T')[0])
})

export type AddIncomeFormData = z.infer<typeof addIncomeFormSchema>

// Schéma pour l'ajout d'une dépense
export const addExpenseFormSchema = z.object({
  life: z.nativeEnum(Life, {
    required_error: 'La vie est requise',
    invalid_type_error: 'Vie invalide'
  }),
  accountId: z.string({
    required_error: 'Le compte est requis'
  }).min(1, 'Le compte est requis'),
  budgetId: z.string().optional(),
  label: z.string()
    .max(255, 'Le libellé ne peut pas dépasser 255 caractères')
    .optional(),
  amount: z.number()
    .min(0.01, 'Le montant doit être supérieur à 0')
    .max(1000000000, 'Le montant ne peut pas dépasser 1 milliard'),
  date: z.string().optional().default(() => new Date().toISOString().split('T')[0])
})

export type AddExpenseFormData = z.infer<typeof addExpenseFormSchema> 