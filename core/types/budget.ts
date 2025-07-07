import { Life } from './life'

export enum BudgetType {
  EXPENSE = 'expense',
  TRANSFER = 'transfer'
}

export interface budget {
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

export interface BudgetWithSpent extends budget {
  spentAmount: number
}

export interface CreateBudgetData {
  life: Life
  type: BudgetType
  name: string
  amount: number
  dayOfMonth?: number
}

export interface UpdateBudgetData {
  life: Life
  type: BudgetType
  name: string
  amount: number
  dayOfMonth?: number
} 