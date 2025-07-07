// Types pour les vues KPI disponibles
export enum KPIView {
  GLOBAL = 'global',
  LIFE_AND_TYPE = 'life_and_type',
  TYPE_ONLY = 'type_only',
  INDIVIDUAL_ACCOUNT = 'individual_account'
}

export interface KPIResponse {
  value: number
  trend: number
  accountCount?: number
} 