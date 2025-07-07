export enum TransactionType {
  TRANSFER = 'transfer',
  EXPENSE = 'expense',
  INCOME = 'income',
  YIELD = 'yield',
  DIVIDEND = 'dividend',
  SECURITY_OPERATION = 'security_operation',
  BROKER_FEE = 'broker_fee'
}

export interface TransactionTypeConfig {
  label: string
  color: 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'neutral' | 'info'
  icon?: string
}

export const TRANSACTION_TYPE_CONFIG: Record<TransactionType, TransactionTypeConfig> = {
  [TransactionType.TRANSFER]: {
    label: 'Transfert',
    color: 'primary',
    icon: 'i-heroicons-arrow-right-left'
  },
  [TransactionType.EXPENSE]: {
    label: 'Dépense',
    color: 'error',
    icon: 'i-heroicons-arrow-down'
  },
  [TransactionType.INCOME]: {
    label: 'Revenu',
    color: 'success',
    icon: 'i-heroicons-arrow-up'
  },
  [TransactionType.YIELD]: {
    label: 'Rendement',
    color: 'warning',
    icon: 'i-heroicons-chart-bar'
  },
  [TransactionType.DIVIDEND]: {
    label: 'Dividendes',
    color: 'secondary',
    icon: 'i-heroicons-currency-dollar'
  },
  [TransactionType.SECURITY_OPERATION]: {
    label: 'Opération sur titres',
    color: 'neutral',
    icon: 'i-heroicons-building-library'
  },
  [TransactionType.BROKER_FEE]: {
    label: 'Frais de courtier',
    color: 'info',
    icon: 'i-heroicons-credit-card'
  }
}

// Fonction utilitaire pour obtenir la configuration d'un type de transaction
export function getTransactionTypeConfig(type: TransactionType): TransactionTypeConfig {
  return TRANSACTION_TYPE_CONFIG[type]
}

// Fonction utilitaire pour obtenir tous les types de transaction
export function getAllTransactionTypes(): TransactionType[] {
  return Object.values(TransactionType)
} 