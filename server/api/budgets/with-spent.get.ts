import { BudgetService } from '~/core/services/budget.service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const year = parseInt(query.year as string) || new Date().getFullYear()
  const month = parseInt(query.month as string) || new Date().getMonth() + 1
  const life = query.life as 'pro' | 'perso' | undefined

  try {
    const budgetService = new BudgetService(prisma)
    
    // Récupérer tous les budgets pour la période donnée
    const budgets = await budgetService.findByMonthAndYear(year, month, life)
    
    // Pour chaque budget, calculer le montant dépensé
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        // Calculer le montant dépensé pour ce budget
        const spentAmount = await prisma.transaction.aggregate({
          where: {
            budgetId: budget.id,
            date: {
              gte: new Date(year, month - 1, 1), // Premier jour du mois
              lt: new Date(year, month, 1) // Premier jour du mois suivant
            },
            type: 'expense' // Seules les dépenses comptent pour la consommation du budget
          },
          _sum: {
            amount: true
          }
        })

        return {
          ...budget,
          spentAmount: spentAmount._sum.amount || 0
        }
      })
    )

    return budgetsWithSpent
  } catch (error) {
    console.error('Erreur lors de la récupération des budgets avec montants dépensés:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des budgets'
    })
  }
}) 