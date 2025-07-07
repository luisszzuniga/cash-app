import { AccountService } from '~/core/services/account.service'
import { Life } from '~/core/types/life'
import { AccountType } from '~/core/types/account'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const accountService = new AccountService(prisma)

  try {
    // Récupérer tous les comptes actifs
    const accounts = await accountService.findActiveAccounts()
    
    // Appliquer les filtres selon les paramètres
    let filteredAccounts = accounts

    // Filtrer par type de compte selon les paramètres
    if (query.type) {
      const type = query.type as string
      filteredAccounts = filteredAccounts.filter(account => account.type === type)
    } else {
      // Par défaut, inclure tous les types (bancaire, épargne, portefeuille)
      // Pas de filtre supplémentaire
    }

    // Filtrer par vie si spécifié
    if (query.life) {
      const life = query.life as string
      filteredAccounts = filteredAccounts.filter(account => account.life === life)
    }



    // Filtrer par compte individuel si spécifié
    if (query.accountId) {
      const accountId = query.accountId as string
      filteredAccounts = filteredAccounts.filter(account => account.id === accountId)
    }

    // Calculer le total des soldes
    const totalBalance = filteredAccounts.reduce((sum, account) => sum + account.balance, 0)

    return {
      value: totalBalance,
      accountCount: filteredAccounts.length
    }
  } catch (error) {
    console.error('Erreur lors du calcul du KPI:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du calcul du KPI'
    })
  }
}) 