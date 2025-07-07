<template>
  <div class="space-y-4">
    <UBreadcrumb :items="breadcrumbItems" />
    
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-gray-900">
          Budgets {{ lifeLabel }}
        </h1>
      </template>
    </UCard>

    <!-- Grille des graphiques de budgets filtrée par vie -->
    <BudgetChartsGrid :life="life" />
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import BudgetChartsGrid from '~/components/budgets/BudgetChartsGrid.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
});

const route = useRoute();
const life = route.params.life as 'pro' | 'perso';

const lifeLabel = computed(() => {
  return life === 'pro' ? 'Professionnels' : 'Personnels';
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
    },
    {
      label: lifeLabel.value,
      icon: 'i-heroicons-chart-pie',
      to: `/budgets/${life}`
    }
  ];

  return items;
});
</script> 