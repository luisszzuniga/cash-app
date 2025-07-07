import { Life } from '../types/life'
import { AccountType } from '../types/account'
import { TransactionType } from '../types/transaction'
import type { Account } from '../types/account'

export interface Transaction {
  id: string
  accountId: string
  type: TransactionType
  amount: number
  label: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

export class TransactionService {
  constructor(private prisma: any) {}

  async addIncome(data: {
    accountId: string
    label: string
    amount: number
    date: Date
  }): Promise<Transaction> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized')
    }

    // Vérifier que le compte existe et est de type bancaire
    const account = await this.prisma.account.findUnique({
      where: { id: BigInt(data.accountId) }
    })

    if (!account) {
      throw new Error('Compte non trouvé')
    }

    if (account.type !== 'bank') {
      throw new Error('Seuls les comptes bancaires peuvent recevoir des revenus')
    }

    // Créer la transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        accountId: BigInt(data.accountId),
        type: TransactionType.INCOME,
        amount: data.amount,
        label: data.label,
        date: data.date
      }
    })

    // Mettre à jour le solde du compte
    await this.prisma.account.update({
      where: { id: BigInt(data.accountId) },
      data: {
        balance: {
          increment: data.amount
        }
      }
    })

    return {
      id: transaction.id.toString(),
      accountId: transaction.accountId.toString(),
      type: transaction.type,
      amount: transaction.amount,
      label: transaction.label,
      date: transaction.date,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }
  }

  async findBankAccountsByLife(life: Life): Promise<Account[]> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized')
    }

    const accounts = await this.prisma.account.findMany({
      where: {
        life: life,
        type: 'bank'
      },
      orderBy: { name: 'asc' }
    })

    return accounts.map((account: any) => ({
      id: account.id.toString(),
      name: account.name,
      type: this.mapAccountType(account.type),
      life: this.mapLife(account.life),
      balance: account.balance,
      currency: 'EUR',
      description: account.description,
      rib: account.rib || '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
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
} 