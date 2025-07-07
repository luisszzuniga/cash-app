import { AccountService } from '~/core/services/account.service'
import { editAccountFormSchema } from '~/core/schemas/account.schema'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const accountService = new AccountService(prisma)

  try {
    // Valider les données avec Zod
    const validatedData = editAccountFormSchema.parse(body)

    // Vérifier que le compte existe
    const existingAccount = await accountService.findById(id!)
    if (!existingAccount) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Compte non trouvé'
      })
    }

    // Mettre à jour le compte
    const updatedAccount = await accountService.update(id!, validatedData)

    return updatedAccount
  } catch (error: any) {
    console.error('Erreur lors de la modification du compte:', error)
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la modification du compte'
    })
  }
}) 