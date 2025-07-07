import { PrismaClient } from '@prisma/client'
import { EventService } from '~/core/services/event.service'

const prisma = new PrismaClient()
const eventService = new EventService(prisma)

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de transaction requis'
      })
    }

    // Vérifier que la transaction existe
    const transaction = await prisma.transaction.findUnique({
      where: { id: BigInt(id) },
      include: {
        account: true
      }
    })

    if (!transaction) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Transaction non trouvée'
      })
    }

    // Supprimer la transaction (soft delete)
    await prisma.transaction.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() }
    })

    // Recalculer le solde du compte
    await eventService.triggerBalanceRecalculation(transaction.accountId.toString())

    return {
      success: true,
      message: 'Transaction supprimée avec succès'
    }
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la suppression de la transaction'
    })
  }
}) 