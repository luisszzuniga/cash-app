<template>
      <div class="space-y-4">
        <UBreadcrumb :items="breadcrumbItems" />
  <UCard>
    <template #header>
      <h1 class="text-2xl font-bold text-gray-900">
        Comptes {{ lifeLabel }}
      </h1>
    </template>

    <KPIGrid>
      <KPICard
        :view="KPIView.LIFE_AND_TYPE"
        :life="computedLife"
        title="Solde Global"
        subtitle="Tous les comptes"
        description="Total de tous vos comptes"
      />
        <KPICard
          :view="KPIView.LIFE_AND_TYPE"
          :life="computedLife"
          :account-type="AccountType.BANK"
          title="Comptes Bancaires"
          subtitle="Tous les comptes bancaires"
          description="Total des comptes courants"
        />
        <KPICard
          :view="KPIView.LIFE_AND_TYPE"
          :life="computedLife"
          :account-type="AccountType.SAVINGS"
          title="Épargne"
          subtitle="Tous les comptes d'épargne"
          description="Total de l'épargne"
        />
        <KPICard
          :view="KPIView.LIFE_AND_TYPE"
          :life="computedLife"
          :account-type="AccountType.PORTFOLIO"
          title="Portefeuilles"
          subtitle="Valeur de vos portefeuilles"
          description="Total de vos portefeuilles"
        />
    </KPIGrid>
  </UCard>
</div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { KPIView } from '~/core/types/kpi'
import { AccountType } from '~/core/types/account'
import KPICard from '~/components/ui/KPICard.vue'
import KPIGrid from '~/components/ui/KPIGrid.vue'
import { Life } from '~/core/types/life'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
});

const route = useRoute();
const life = route.params.life as string;

const lifeLabel = computed(() => {
  return life === 'pro' ? 'Professionnels' : 'Personnels';
});

const computedLife = computed(() => {
  return life === 'pro' ? Life.PRO : Life.PERSO;
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