<template>
      <div class="space-y-4">
        <UBreadcrumb :items="breadcrumbItems" />
  <UCard>
    <template #header>
      <h1 class="text-2xl font-bold text-gray-900">
        Comptes {{ lifeLabel }}
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

const route = useRoute();
const life = route.params.life as string;

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
      label: lifeLabel.value,
      icon: 'i-heroicons-briefcase',
      to: `/accounts/life/${life}`
    }
  ];

  return items;
});
</script> 