import { TransactionService } from '~/core/services/transaction.service'
import { addIncomeFormSchema } from '~/core/schemas/transaction.schema'
import { EventService } from '~/core/services/event.service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const eventService = new EventService(prisma)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const transactionService = new TransactionService(prisma)

  try {
    // Valider les données avec Zod
    const validatedData = addIncomeFormSchema.parse(body)

    // Ajouter le revenu
    const transaction = await transactionService.addIncome({
      accountId: validatedData.accountId,
      label: validatedData.label,
      amount: validatedData.amount,
      date: new Date(validatedData.date || new Date())
    })

    return transaction
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout du revenu:', error)
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }

    if (error.message === 'Compte non trouvé') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Compte non trouvé'
      })
    }

    if (error.message === 'Seuls les comptes bancaires peuvent recevoir des revenus') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Seuls les comptes bancaires peuvent recevoir des revenus'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'ajout du revenu'
    })
  }
}) 