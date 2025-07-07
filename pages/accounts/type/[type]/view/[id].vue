<template>
  <div class="space-y-4">
    <UBreadcrumb :items="breadcrumbItems" />
    
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ account?.name || 'Chargement...' }}
          </h1>
        </div>
      </template>

      <KPIGrid>
        <KPICard
          :view="KPIView.INDIVIDUAL_ACCOUNT"
          :account-id="id"
          title="Solde Global"
          subtitle="Tous les comptes"
          description="Total de tous vos comptes pour ce compte"
        />
      </KPIGrid>

      <EditAccountForm v-if="account" :account="account" class="mt-4" />
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
import EditAccountForm from '~/components/accounts/EditAccountForm.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
});

const route = useRoute();
const type = route.params.type as string;
const id = route.params.id as string;

// Récupérer les données du compte
const { data: account, pending, error, refresh } = await useLazyAsyncData(
  `account-${id}`,
  () => $fetch(`/api/accounts/${id}`)
);

const { on } = useEvents()
on('reload-accounts', async () => {
  refresh()
})

// Construire le breadcrumb dynamique
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    {
      label: 'Accueil',
      icon: 'i-heroicons-home',
      to: '/dashboard'
    }
  ];

  if (account.value) {
    // Ajouter la section de vie (Pro/Perso)
    const lifeLabel = account.value.life === 'pro' ? 'Professionnels' : 'Personnels';

    // Ajouter le type de compte
    const typeLabels = {
      'bank': 'Comptes Bancaires ' + lifeLabel,
      'savings': 'Comptes Épargne ' + lifeLabel,
      'portfolio': 'Portefeuilles ' + lifeLabel
    };
    const typeLabel = typeLabels[account.value.type] || 'Comptes';
    items.push({
      label: typeLabel,
      icon: 'i-heroicons-banknotes',
      to: `/accounts/life/${account.value.life}/type/${account.value.type}`
    });

    // Ajouter le nom du compte (dernier élément, pas de lien)
    items.push({
      label: account.value.name,
      icon: 'i-heroicons-credit-card'
    });
  }

  return items;
});
</script> 