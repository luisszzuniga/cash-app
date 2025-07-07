<template>
  <div class="space-y-4">
    <UBreadcrumb :items="breadcrumbItems" />
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-gray-900">
          Tableau de bord
        </h1>
      </template>

      <div v-if="user" class="space-y-6">

        <!-- KPIs -->
        <KPIGrid>
          <KPICard
            :view="KPIView.GLOBAL"
            title="Solde Global"
            subtitle="Tous les comptes"
            description="Total de tous vos comptes"
          />
            <KPICard
              :view="KPIView.TYPE_ONLY"
              :account-type="AccountType.BANK"
              title="Comptes Bancaires"
              subtitle="Tous les comptes bancaires"
              description="Total des comptes courants"
            />
            <KPICard
              :view="KPIView.TYPE_ONLY"
              :account-type="AccountType.SAVINGS"
              title="Épargne"
              subtitle="Tous les comptes d'épargne"
              description="Total de l'épargne"
            />
            <KPICard
              :view="KPIView.TYPE_ONLY"
              :account-type="AccountType.PORTFOLIO"
              title="Portefeuilles"
              subtitle="Valeur de vos portefeuilles"
              description="Total de vos portefeuilles"
            />
        </KPIGrid>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Actions rapides</h3>
          </template>
          <div class="flex gap-4">
            <AddAccountForm
              trigger-label="Nouveau Compte"
              trigger-color="primary"
              trigger-variant="soft"
              trigger-icon="i-heroicons-plus-circle"
            />
            <AddIncomeForm
              trigger-label="Nouveau Revenu"
              trigger-color="success"
              trigger-variant="soft"
              trigger-icon="i-heroicons-plus-circle"
            />
            <BudgetCategoryForm
              trigger-label="Nouvelle Catégorie"
              trigger-color="warning"
              trigger-variant="soft"
              trigger-icon="i-heroicons-chart-pie"
            />
            <UButton
              color="error"
              variant="soft"
              icon="i-heroicons-arrow-right-on-rectangle"
              @click="handleLogout"
            >
              Déconnexion
            </UButton>
          </div>
        </UCard>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { Life } from '@/core/types/life'
import { AccountType } from '@/core/types/account'
import AddAccountForm from '~/components/accounts/AddAccountForm.vue'
import AddIncomeForm from '~/components/transactions/AddIncomeForm.vue'
import BudgetCategoryForm from '~/components/budgets/BudgetCategoryForm.vue'
import KPICard from '~/components/ui/KPICard.vue'
import { KPIView } from '~/core/types/kpi'
import KPIGrid from '~/components/ui/KPIGrid.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
});

const { user, clear } = useAuth();
const toast = useToast()

const handleLogout = async () => {
  await clear();
  toast.add({
    title: 'Déconnexion réussie',
    description: 'Vous avez été déconnecté avec succès',
    color: 'success'
  })
  await navigateTo('/');
};

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    {
      label: 'Accueil',
      icon: 'i-heroicons-home',
      to: '/dashboard'
    }
  ];

  return items;
});
</script>
