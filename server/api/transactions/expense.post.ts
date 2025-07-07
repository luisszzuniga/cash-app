import { PrismaClient } from '@prisma/client'
import { addExpenseFormSchema } from '~/core/schemas/transaction.schema'
import { EventService } from '~/core/services/event.service'
import { z } from 'zod'

const prisma = new PrismaClient()
const eventService = new EventService(prisma)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Valider les données avec le schéma centralisé
    const validatedData = addExpenseFormSchema.parse(body)
    
    // Vérifier que le compte existe et appartient à la vie sélectionnée
    const account = await prisma.account.findUnique({
      where: { id: BigInt(validatedData.accountId) }
    })
    
    if (!account) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Compte non trouvé'
      })
    }
    
    if (account.life !== validatedData.life) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le compte ne correspond pas à la vie sélectionnée'
      })
    }
    
    // Vérifier que la catégorie de budget existe et appartient à la vie sélectionnée
    if (validatedData.budgetId) {
      const budgetCategory = await prisma.budget.findUnique({
        where: { id: BigInt(validatedData.budgetId) }
      })
      
      if (!budgetCategory) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Catégorie de budget non trouvée'
        })
      }
      
      if (budgetCategory.life !== validatedData.life) {
        throw createError({
          statusCode: 400,
          statusMessage: 'La catégorie de budget ne correspond pas à la vie sélectionnée'
        })
      }
      
      if (budgetCategory.type !== 'expense') {
        throw createError({
          statusCode: 400,
          statusMessage: 'La catégorie sélectionnée n\'est pas une catégorie de dépense'
        })
      }
    }
    
    // Créer la transaction
    const transaction = await prisma.transaction.create({
      data: {
        type: 'expense',
        amount: - validatedData.amount / 100,
        label: validatedData.label || '',
        date: new Date(validatedData.date || new Date()),
        accountId: BigInt(validatedData.accountId),
        budgetId: validatedData.budgetId ? BigInt(validatedData.budgetId) : null
      },
      include: {
        account: true,
        budget: true
      }
    })
    
    // Déclencher le recalcul du solde du compte via le système d'événements
    await eventService.triggerBalanceRecalculation(validatedData.accountId)
    
    return {
      success: true,
      transaction: {
        id: transaction.id.toString(),
        type: transaction.type,
        amount: transaction.amount,
        label: transaction.label,
        date: transaction.date,
        account: {
          id: transaction.account.id.toString(),
          name: transaction.account.name
        },
        budget: transaction.budget ? {
          id: transaction.budget.id.toString(),
          name: transaction.budget.name
        } : null
      }
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la dépense:', error)
    
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }
    console.log("iciiiiiiiiiii",error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 