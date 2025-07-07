import { BudgetService } from '~/core/services/budget.service'
import { BudgetFormSchema } from '~/core/schemas/budget.schema'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const budgetService = new BudgetService(prisma)

  try {
    // Valider les données avec Zod
    const validatedData = BudgetFormSchema.parse(body)

    // Vérifier que la catégorie existe
    const existingBudget = await budgetService.findById(id!)
    if (!existingBudget) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Catégorie de budget non trouvée'
      })
    }

    // Mettre à jour la catégorie de budget
    const updatedBudget = await budgetService.update(id!, validatedData)

    return updatedBudget
  } catch (error: any) {
    console.error('Erreur lors de la modification de la catégorie de budget:', error)
    
    if (error.statusCode === 404) {
      throw error
    }
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la modification de la catégorie de budget'
    })
  }
}) 