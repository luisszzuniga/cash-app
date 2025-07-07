import { Life } from '../types/life'
import { AccountType, type Account } from '../types/account'

export class AccountService {
  constructor(private prisma: any) {}

  async findActiveAccounts(): Promise<Account[]> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized')
    }

    const accounts = await this.prisma.account.findMany({
      orderBy: [
        { life: 'asc' },
        { type: 'asc' },
        { name: 'asc' }
      ]
    })

    // Transformer les données de la BDD vers notre interface Account
    return accounts.map((account: any) => ({
      id: account.id.toString(),
      name: account.name,
      type: this.mapAccountType(account.type),
      life: this.mapLife(account.life),
      balance: account.balance,
      currency: 'EUR', // Par défaut pour l'instant
      description: account.description,
      isActive: true, // Tous les comptes sont actifs pour l'instant
      createdAt: new Date(), // Pas de createdAt dans le schéma actuel
      updatedAt: new Date()  // Pas de updatedAt dans le schéma actuel
    }))
  }

  private mapAccountType(dbType: string): AccountType {
    switch (dbType) {
      case 'bank':
        return AccountType.BANK
      case 'savings':
        return AccountType.SAVINGS
      case 'portfolio':
        return AccountType.PORTFOLIO
      default:
        return AccountType.BANK
    }
  }

  private mapLife(dbLife: string): Life {
    switch (dbLife) {
      case 'pro':
        return Life.PRO
      case 'perso':
        return Life.PERSO
      default:
        return Life.PERSO
    }
  }

  async findById(id: string): Promise<Account | null> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized')
    }

    const account = await this.prisma.account.findUnique({
      where: { id: BigInt(id) }
    })

    if (!account) {
      return null
    }

    return {
      id: account.id.toString(),
      name: account.name,
      type: this.mapAccountType(account.type),
      life: this.mapLife(account.life),
      balance: account.balance,
      currency: 'EUR',
      description: account.description,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
} 