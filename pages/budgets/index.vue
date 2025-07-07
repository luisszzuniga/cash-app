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
</div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

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