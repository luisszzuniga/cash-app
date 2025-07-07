import { PrismaClient } from '@prisma/client'
import { BalanceService } from './balance.service'

export class EventService {
  private balanceService: BalanceService

  constructor(private prisma: PrismaClient) {
    this.balanceService = new BalanceService(prisma)
  }

  /**
   * Déclenche le recalcul du solde d'un compte après une transaction
   * @param accountId - ID du compte à recalculer
   */
  async triggerBalanceRecalculation(accountId: string): Promise<void> {
    try {
      await this.balanceService.recalculateAccountBalance(accountId)
      console.log(`Solde recalculé pour le compte ${accountId}`)
    } catch (error) {
      console.error(`Erreur lors du recalcul du solde du compte ${accountId}:`, error)
      throw error
    }
  }
} 