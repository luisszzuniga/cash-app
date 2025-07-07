<template>
  <div class="space-y-4">
    <UBreadcrumb :items="breadcrumbItems" />
    
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-gray-900">
          Tous les Budgets
        </h1>
      </template>
    </UCard>

    <!-- Grille des graphiques de budgets -->
    <BudgetChartsGrid />
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import BudgetChartsGrid from '~/components/budgets/BudgetChartsGrid.vue'
import BudgetCategoryForm from '~/components/budgets/BudgetCategoryForm.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
});

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    {
      label: 'Accueil',
      icon: 'i-heroicons-home',
      to: '/dashboard'
    },
    {
      label: 'Budgets',
      icon: 'i-heroicons-chart-pie',
      to: '/budgets'
    }
  ];

  return items;
});
</script> 