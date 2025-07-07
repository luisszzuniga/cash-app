import { z } from 'zod'
import { Life } from '~/core/types/life'
import { BudgetType } from '~/core/types/budget'

// Schéma pour la création/modification d'une catégorie de budget
export const budgetCategoryFormSchema = z.object({
  life: z.nativeEnum(Life, {
    required_error: 'La vie est requise',
    invalid_type_error: 'Vie invalide'
  }),
  type: z.nativeEnum(BudgetType, {
    required_error: 'Le type est requis',
    invalid_type_error: 'Type invalide'
  }),
  name: z.string()
    .min(1, 'Le nom est requis')
    .max(255, 'Le nom ne peut pas dépasser 255 caractères'),
  amount: z.number()
    .min(0.01, 'Le montant doit être supérieur à 0')
    .max(1000000000, 'Le montant ne peut pas dépasser 1 milliard'),
  dayOfMonth: z.number()
    .min(1, 'Le jour doit être entre 1 et 31')
    .max(31, 'Le jour doit être entre 1 et 31')
    .optional()
})

export type BudgetCategoryFormData = z.infer<typeof budgetCategoryFormSchema> 