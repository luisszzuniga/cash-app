import { Life } from '../types/life'
import { BudgetType, type BudgetCategory, type CreateBudgetCategoryData, type UpdateBudgetCategoryData } from '../types/budget'

export class BudgetService {
  constructor(private prisma: any) {}

  async create(data: CreateBudgetCategoryData): Promise<BudgetCategory> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized')
    }

    const budgetCategory = await this.prisma.budget.create({
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
      id: budgetCategory.id.toString(),
      life: this.mapLife(budgetCategory.life),
      type: this.mapBudgetType(budgetCategory.type),
      name: budgetCategory.name,
      amount: Number(budgetCategory.amount) / 100, // Convertir de centimes en euros
      dayOfMonth: budgetCategory.prelevementDay ? Number(budgetCategory.prelevementDay) : undefined,
      isActive: !budgetCategory.deletedAt,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async update(id: string, data: UpdateBudgetCategoryData): Promise<BudgetCategory> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized')
    }

    const budgetCategory = await this.prisma.budget.update({
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
      id: budgetCategory.id.toString(),
      life: this.mapLife(budgetCategory.life),
      type: this.mapBudgetType(budgetCategory.type),
      name: budgetCategory.name,
      amount: Number(budgetCategory.amount) / 100, // Convertir de centimes en euros
      dayOfMonth: budgetCategory.prelevementDay ? Number(budgetCategory.prelevementDay) : undefined,
      isActive: !budgetCategory.deletedAt,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async findById(id: string): Promise<BudgetCategory | null> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized')
    }

    const budgetCategory = await this.prisma.budget.findUnique({
      where: { id: BigInt(id) }
    })

    if (!budgetCategory) {
      return null
    }

    return {
      id: budgetCategory.id.toString(),
      life: this.mapLife(budgetCategory.life),
      type: this.mapBudgetType(budgetCategory.type),
      name: budgetCategory.name,
      amount: Number(budgetCategory.amount) / 100, // Convertir de centimes en euros
      dayOfMonth: budgetCategory.prelevementDay ? Number(budgetCategory.prelevementDay) : undefined,
      isActive: !budgetCategory.deletedAt,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async findActiveCategories(): Promise<BudgetCategory[]> {
    if (!this.prisma) {
      throw new Error('Prisma client not initialized')
    }

    const budgetCategories = await this.prisma.budget.findMany({
      where: { deletedAt: null },
      orderBy: [
        { life: 'asc' },
        { type: 'asc' },
        { name: 'asc' }
      ]
    })

    return budgetCategories.map((category: any) => ({
      id: category.id.toString(),
      life: this.mapLife(category.life),
      type: this.mapBudgetType(category.type),
      name: category.name,
      amount: Number(category.amount) / 100, // Convertir de centimes en euros
      dayOfMonth: category.prelevementDay ? Number(category.prelevementDay) : undefined,
      isActive: !category.deletedAt,
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