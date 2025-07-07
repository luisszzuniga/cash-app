import { Life } from '../types/life'
import { BudgetType, type budget, type CreateBudgetData, type UpdateBudgetData } from '../types/budget'

export class BudgetService {
  constructor(private prisma: any) {}

  async create(data: CreateBudgetData): Promise<budget> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized')
    }

    const budget = await this.prisma.budget.create({
      data: {
        life: data.life,
        type: data.type,
        name: data.name,
        amount: BigInt(Math.round(data.amount * 100)), // Convertir en centimes
        prelevementDay: data.dayOfMonth ? BigInt(data.dayOfMonth) : null,
        year: BigInt(new Date().getFullYear()),
        month: BigInt(new Date().getMonth() + 1),
        shouldBeCopiedNextMonth: true,
        shouldShowAlert: false
      }
    })

    return {
      id: budget.id.toString(),
      life: this.mapLife(budget.life),
      type: this.mapBudgetType(budget.type),
      name: budget.name,
      amount: Number(budget.amount) / 100, // Convertir de centimes en euros
      dayOfMonth: budget.prelevementDay ? Number(budget.prelevementDay) : undefined,
      isActive: !budget.deletedAt,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async update(id: string, data: UpdateBudgetData): Promise<budget> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized')
    }

    const budget = await this.prisma.budget.update({
      where: { id: BigInt(id) },
      data: {
        life: data.life,
        type: data.type,
        name: data.name,
        amount: BigInt(Math.round(data.amount * 100)), // Convertir en centimes
        prelevementDay: data.dayOfMonth ? BigInt(data.dayOfMonth) : null
      }
    })

    return {
      id: budget.id.toString(),
      life: this.mapLife(budget.life),
      type: this.mapBudgetType(budget.type),
      name: budget.name,
      amount: Number(budget.amount) / 100, // Convertir de centimes en euros
      dayOfMonth: budget.prelevementDay ? Number(budget.prelevementDay) : undefined,
      isActive: !budget.deletedAt,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async findById(id: string): Promise<budget | null> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized')
    }

    const budget = await this.prisma.budget.findUnique({
      where: { id: BigInt(id) }
    })

    if (!budget) {
      return null
    }

    return {
      id: budget.id.toString(),
      life: this.mapLife(budget.life),
      type: this.mapBudgetType(budget.type),
      name: budget.name,
      amount: Number(budget.amount) / 100, // Convertir de centimes en euros
      dayOfMonth: budget.prelevementDay ? Number(budget.prelevementDay) : undefined,
      isActive: !budget.deletedAt,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async findActive(): Promise<budget[]> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized')
    }

    const budgets = await this.prisma.budget.findMany({
      where: { deletedAt: null },
      orderBy: [
        { life: 'asc' },
        { type: 'asc' },
        { name: 'asc' }
      ]
    })

    return budgets.map((budget: any) => ({
      id: budget.id.toString(),
      life: this.mapLife(budget.life),
      type: this.mapBudgetType(budget.type),
      name: budget.name,
      amount: Number(budget.amount) / 100, // Convertir de centimes en euros
      dayOfMonth: budget.prelevementDay ? Number(budget.prelevementDay) : undefined,
      isActive: !budget.deletedAt,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  }

  async findByMonthAndYear(year: number, month: number, life?: 'pro' | 'perso'): Promise<budget[]> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized')
    }

    const whereClause: any = {
      deletedAt: null,
      year: BigInt(year),
      month: BigInt(month)
    }

    if (life) {
      whereClause.life = life
    }

    const budgets = await this.prisma.budget.findMany({
      where: whereClause,
      orderBy: [
        { life: 'asc' },
        { type: 'asc' },
        { name: 'asc' }
      ]
    })

    return budgets.map((budget: any) => ({
      id: budget.id.toString(),
      life: this.mapLife(budget.life),
      type: this.mapBudgetType(budget.type),
      name: budget.name,
      amount: Number(budget.amount) / 100, // Convertir de centimes en euros
      dayOfMonth: budget.prelevementDay ? Number(budget.prelevementDay) : undefined,
      isActive: !budget.deletedAt,
      shouldBeCopiedNextMonth: budget.shouldBeCopiedNextMonth,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
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

  private mapBudgetType(dbType: string): BudgetType {
    switch (dbType) {
      case 'expense':
        return BudgetType.EXPENSE
      case 'transfer':
        return BudgetType.TRANSFER
      default:
        return BudgetType.EXPENSE
    }
  }
} 