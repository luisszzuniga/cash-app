import { PrismaClient } from '@prisma/client'
import { AccountType } from '~/core/types/account'

export class BalanceService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Recalcule le solde d'un compte à partir de toutes ses transactions
   * @param accountId - ID du compte à recalculer
   */
  async recalculateAccountBalance(accountId: string): Promise<void> {
    const account = await this.prisma.account.findUnique({
      where: { id: BigInt(accountId) }
    })

    if (!account) {
      throw new Error(`Compte ${accountId} non trouvé`)
    }

    // Logique différente selon le type de compte
    switch (account.type) {
      case AccountType.BANK:
      case AccountType.SAVINGS:
        // Pour les comptes bancaires et épargne : somme de toutes les transactions
        await this.recalculateBankAccountBalance(accountId)
        break
      
      case AccountType.PORTFOLIO:
        // Pour les portefeuilles : logique plus complexe (à implémenter)
        await this.recalculatePortfolioBalance(accountId)
        break
      
      default:
        throw new Error(`Type de compte non supporté: ${account.type}`)
    }
  }

  /**
   * Recalcule le solde d'un compte bancaire ou épargne
   */
  private async recalculateBankAccountBalance(accountId: string): Promise<void> {
    // Calculer le solde à partir de toutes les transactions
    const transactions = await this.prisma.transaction.findMany({
      where: { 
        accountId: BigInt(accountId),
        deletedAt: null
      }
    })

    const totalBalance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)

    // Mettre à jour le solde du compte
    await this.prisma.account.update({
      where: { id: BigInt(accountId) },
      data: {
        balance: totalBalance
      }
    })
  }

  /**
   * Recalcule le solde d'un portefeuille (logique spécifique)
   */
  private async recalculatePortfolioBalance(accountId: string): Promise<void> {
    // TODO: Implémenter la logique spécifique aux portefeuilles
    // Par exemple : calcul basé sur la valeur des actifs, pas juste la somme des transactions
    
    // Pour l'instant, on utilise la même logique que les comptes bancaires
    await this.recalculateBankAccountBalance(accountId)
  }
} 