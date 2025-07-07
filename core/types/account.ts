import { Life } from './life'
import type { LifeType } from './life'

export enum AccountType {
  BANK = 'bank',
  SAVINGS = 'savings',
  PORTFOLIO = 'portfolio'
}

export type AccountTypeValue = `${AccountType}`

export interface Account {
  id: string
  name: string
  type: AccountType
  life: Life
  balance: number
  currency: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SidebarAccountGroup {
  type: AccountType
  label: string
  icon: string
  description: string
  accounts: Account[]
}

export interface SidebarLifeSection {
  life: Life
  label: string
  icon: string
  accountGroups: SidebarAccountGroup[]
}

export interface SidebarData {
  lifeSections: SidebarLifeSection[]
} 