import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { life, type } = query

    // Construire les filtres
    const where: any = {}
    
    if (life) {
      where.life = life
    }
    
    if (type) {
      where.type = type
    }

    const budget = await prisma.budget.findMany({
      where,
      orderBy: {
        name: 'asc'
      }
    })

    const budgetJson = JSON.stringify(budget, (key, value) =>
      typeof value === "bigint" ? Number(value) : value,
    );

    return budgetJson
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories de budget:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 