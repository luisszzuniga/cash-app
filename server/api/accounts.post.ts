import { AccountService } from '~/core/services/account.service'
import { createAccountSchema } from '~/core/schemas/account.schema'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Valider les données avec Zod
    const validatedData = createAccountSchema.parse(body)
    
    // Créer le compte
    const accountService = new AccountService(prisma)
    const account = await accountService.create(validatedData)
    
    return account
  } catch (error: any) {
    console.error('Erreur lors de la création du compte:', error)
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la création du compte'
    })
  }
}) 