import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    // Paramètres de pagination
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 15
    const offset = (page - 1) * limit
    
    // Paramètres de tri
    const sortBy = (query.sortBy as string) || 'date'
    const sortOrder = (query.sortOrder as string) || 'desc'
    
    // Filtre par compte
    const accountId = query.accountId as string | undefined

    console.log('🔍 Compte demandé:', accountId)

    // Construire les filtres
    const where: any = {
      deletedAt: null
    }

    if (accountId) {
      where.accountId = BigInt(accountId)
    }

    // Construire l'ordre de tri
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Récupérer les transactions
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
            life: true
          }
        },
        budget: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    const total = await prisma.transaction.count({ where })

    console.log('📊 Transactions trouvées:', transactions.length)

    // Sérialiser les données
    const serializedTransactions = transactions.map(transaction => ({
      id: transaction.id.toString(),
      label: transaction.label,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
      account: transaction.account ? {
        id: transaction.account.id.toString(),
        name: transaction.account.name,
        type: transaction.account.type,
        life: transaction.account.life
      } : null,
      budget: transaction.budget ? {
        id: transaction.budget.id.toString(),
        name: transaction.budget.name
      } : null
    }))

    return {
      transactions: serializedTransactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }

  } catch (error) {
    console.error('❌ Erreur:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des transactions'
    })
  }
}) 