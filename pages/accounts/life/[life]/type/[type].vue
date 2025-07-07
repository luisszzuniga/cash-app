<template>
  <div class="space-y-4">
    <UBreadcrumb :items="breadcrumbItems" />

    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ typeLabel }} {{ lifeLabel }}
        </h1>
      </template>

      <KPIGrid>
        <KPICard
          :view="KPIView.LIFE_AND_TYPE"
          :life="computedLife"
          :account-type="computedType"
          title="Solde Global"
          subtitle="Tous les comptes"
          description="Total de tous vos comptes pour ce compte"
        />
      </KPIGrid>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { KPIView } from '~/core/types/kpi'
import { Life } from '~/core/types/life'
import { AccountType } from '~/core/types/account'
import KPICard from '~/components/ui/KPICard.vue'
import KPIGrid from '~/components/ui/KPIGrid.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
});

const route = useRoute();
const life = route.params.life as string;
const type = route.params.type as string;

const lifeLabel = computed(() => {
  return life === 'pro' ? 'Professionnels' : 'Personnels';
});

const computedLife = computed(() => {
  return life === 'pro' ? Life.PRO : Life.PERSO;
});

const computedType = computed(() => {
  return type === 'bank' ? AccountType.BANK : type === 'savings' ? AccountType.SAVINGS : AccountType.PORTFOLIO;
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
    },
    {
      label: typeLabel.value,
      icon: 'i-heroicons-credit-card',
      to: `/accounts/life/${life}/type/${type}`
    }
  ];

  return items;
});

const typeLabel = computed(() => {
  const labels = {
    'bank': 'Comptes Bancaires',
    'savings': 'Comptes Épargne',
    'portfolio': 'Portefeuilles'
  };
  return labels[type as keyof typeof labels] || 'Comptes';
});
</script> 