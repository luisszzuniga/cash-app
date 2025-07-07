import { BudgetService } from '~/core/services/budget.service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID du budget requis'
    })
  }

  try {
    const budgetService = new BudgetService(prisma)
    
    // Vérifier que le budget existe
    const existingBudget = await budgetService.findById(id)
    if (!existingBudget) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Budget non trouvé'
      })
    }

    // Supprimer le budget (soft delete)
    await prisma.budget.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() }
    })

    return { success: true, message: 'Budget supprimé avec succès' }
  } catch (error) {
    console.error('Erreur lors de la suppression du budget:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la suppression du budget'
    })
  }
}) 