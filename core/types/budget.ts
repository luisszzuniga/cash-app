import { Life } from './life'

export enum BudgetType {
  EXPENSE = 'expense',
  TRANSFER = 'transfer'
}

export interface BudgetCategory {
  id: string
  life: Life
  type: BudgetType
  name: string
  amount: number
  dayOfMonth?: number
  isActive: boolean
  shouldBeCopiedNextMonth?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BudgetCategoryWithSpent extends BudgetCategory {
  spentAmount: number
}

export interface CreateBudgetCategoryData {
  life: Life
  type: BudgetType
  name: string
  amount: number
  dayOfMonth?: number
}

export interface UpdateBudgetCategoryData {
  life: Life
  type: BudgetType
  name: string
  amount: number
  dayOfMonth?: number
} 