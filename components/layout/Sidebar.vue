<template>
  <UNavigationMenu 
    orientation="vertical" 
    :items="navigationItems" 
    class="data-[orientation=vertical]:w-64 h-full border-r border-gray-200"
  />
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { SidebarData } from '~/core/types/account'

// Récupérer les données de la sidebar
const { data: sidebarData, pending, error, refresh } = await useLazyAsyncData(
  'sidebar',
  () => $fetch('/api/sidebar')
)

// Écouter l'événement de rechargement des comptes
const { on } = useEvents()
on('reload-accounts', () => {
  refresh()
})

// Construire les items de navigation
const navigationItems = computed<NavigationMenuItem[][]>(() => {
  if (!sidebarData.value) return []

  const items: NavigationMenuItem[][] = [
    [
      {
        label: 'Dashboard',
        icon: 'i-heroicons-home',
        to: '/dashboard',
      }
    ]
  ]

  // Ajouter les sections de vie (Pro/Perso)
  sidebarData.value.lifeSections.forEach(lifeSection => {
    const lifeChildren: NavigationMenuItem[] = []

    lifeChildren.push({
        label: 'Tous',
        icon: 'i-heroicons-banknotes',
        to: `/accounts/life/${lifeSection.life}`
    })

    // Ajouter les groupes de comptes pour cette vie
    lifeSection.accountGroups.forEach(accountGroup => {
      const accountChildren: NavigationMenuItem[] = accountGroup.accounts.map(account => ({
        label: account.name,
        icon: 'i-heroicons-banknotes',
        description: account.description || `${account.balance} ${account.currency}`,
        to: `/accounts/type/${accountGroup.type}/view/${account.id}`
      }))

      accountChildren.unshift({
        label: 'Tous',
        icon: 'i-heroicons-banknotes',
        to: `/accounts/life/${lifeSection.life}/type/${accountGroup.type}`
      })

      lifeChildren.push({
        label: accountGroup.label,
        icon: accountGroup.icon,
        description: accountGroup.description,
        children: accountChildren
      })
    })

    items[0].push({
      label: lifeSection.label,
      icon: lifeSection.icon,
      children: lifeChildren
    })
  })

  // Ajouter les budgets
  items[0].push({
    label: 'Budgets',
    icon: 'i-heroicons-chart-pie',
    children: [
      {
        label: 'Tous',
        icon: 'i-heroicons-chart-pie',
        to: '/budgets'
      },
      {
        label: 'Pro',
        icon: 'i-heroicons-briefcase',
        description: 'Budgets professionnels',
        to: '/budgets/pro'
      },
      {
        label: 'Perso',
        icon: 'i-heroicons-user',
        description: 'Budgets personnels',
        to: '/budgets/perso'
      }
    ]
  })

  return items
})
</script> 