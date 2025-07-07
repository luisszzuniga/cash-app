import { SidebarService } from '~/core/services/sidebar.service'
import { AccountService } from '~/core/services/account.service'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Récupérer tous les comptes actifs de l'utilisateur
    const accountService = new AccountService(prisma)
    const accounts = await accountService.findActiveAccounts()
    
    // Construire les données de la sidebar
    const sidebarData = SidebarService.buildSidebarData(accounts)
    
    return sidebarData
  } catch (error) {
    console.error('Erreur lors de la récupération des données de la sidebar:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des données de la sidebar'
    })
  }
}) 