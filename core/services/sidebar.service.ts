import { Life } from '../types/life'
import { AccountType, type Account, type SidebarAccountGroup, type SidebarLifeSection, type SidebarData } from '../types/account'

export class SidebarService {
  static getAccountTypeConfig(type: AccountType) {
    const configs = {
      [AccountType.BANK]: {
        label: 'Comptes bancaires',
        icon: 'i-heroicons-credit-card',
        description: 'Gérez vos comptes bancaires'
      },
      [AccountType.SAVINGS]: {
        label: 'Comptes épargne',
        icon: 'i-heroicons-banknotes',
        description: 'Vos comptes d\'épargne'
      },
      [AccountType.PORTFOLIO]: {
        label: 'Portefeuilles',
        icon: 'i-heroicons-chart-bar',
        description: 'Vos investissements'
      }
    }
    return configs[type]
  }

  static getLifeConfig(life: Life) {
    const configs = {
      [Life.PRO]: {
        label: 'Pro',
        icon: 'i-heroicons-briefcase'
      },
      [Life.PERSO]: {
        label: 'Perso',
        icon: 'i-heroicons-user'
      }
    }
    return configs[life]
  }

  static buildSidebarData(accounts: Account[]): SidebarData {
    const lifeSections: SidebarLifeSection[] = []

    // Pour chaque type de vie (pro, perso)
    Object.values(Life).forEach(life => {
      const lifeConfig = this.getLifeConfig(life)
      const lifeAccounts = accounts.filter(account => account.life === life && account.isActive)
      
      if (lifeAccounts.length === 0) return

      const accountGroups: SidebarAccountGroup[] = []

      // Pour chaque type de compte
      Object.values(AccountType).forEach(accountType => {
        const typeAccounts = lifeAccounts.filter(account => account.type === accountType)
        
        if (typeAccounts.length === 0) return

        const typeConfig = this.getAccountTypeConfig(accountType)
        
        accountGroups.push({
          type: accountType,
          label: typeConfig.label,
          icon: typeConfig.icon,
          description: typeConfig.description,
          accounts: typeAccounts
        })
      })

      if (accountGroups.length > 0) {
        lifeSections.push({
          life,
          label: lifeConfig.label,
          icon: lifeConfig.icon,
          accountGroups
        })
      }
    })

    return { lifeSections }
  }
} 