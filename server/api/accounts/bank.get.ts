import { TransactionService } from '~/core/services/transaction.service'
import { Life } from '~/core/types/life'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const transactionService = new TransactionService(prisma)

  try {
    const life = query.life as string
    
    if (!life || !Object.values(Life).includes(life as Life)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Paramètre "life" requis et doit être "pro" ou "perso"'
      })
    }

    const accounts = await transactionService.findBankAccountsByLife(life as Life)
    return accounts
  } catch (error: any) {
    console.error('Erreur lors de la récupération des comptes bancaires:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des comptes bancaires'
    })
  }
}) 