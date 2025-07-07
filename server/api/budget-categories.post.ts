import { BudgetService } from '~/core/services/budget.service'
import { budgetCategoryFormSchema } from '~/core/schemas/budget.schema'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const budgetService = new BudgetService(prisma)

  try {
    // Valider les données avec Zod
    const validatedData = budgetCategoryFormSchema.parse(body)

    // Créer la catégorie de budget
    const budgetCategory = await budgetService.create(validatedData)

    return budgetCategory
  } catch (error: any) {
    console.error('Erreur lors de la création de la catégorie de budget:', error)
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la création de la catégorie de budget'
    })
  }
}) 