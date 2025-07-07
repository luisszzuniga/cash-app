import { AccountService } from '~/core/services/account.service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID du compte requis'
      })
    }

    const accountService = new AccountService(prisma)
    const account = await accountService.findById(id)
    
    if (!account) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Compte non trouvé'
      })
    }

    return account
  } catch (error) {
    console.error('Erreur lors de la récupération du compte:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération du compte'
    })
  }
}) 