<template>
  <UContainer class="py-6">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-gray-900">
          Tableau de bord
        </h1>
      </template>

      <div v-if="user" class="space-y-6">
        <UAlert
          type="info"
          title="Bienvenue !"
          :description="`Connecté en tant que ${user.email}`"
          icon="i-heroicons-user-circle"
        />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">Comptes</h3>
            </template>
            <div class="text-center">
              <UIcon name="i-heroicons-credit-card" class="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p class="text-2xl font-bold text-gray-900">0</p>
              <p class="text-sm text-gray-500">Comptes actifs</p>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">Transactions</h3>
            </template>
            <div class="text-center">
              <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p class="text-2xl font-bold text-gray-900">0</p>
              <p class="text-sm text-gray-500">Transactions ce mois</p>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">Budgets</h3>
            </template>
            <div class="text-center">
              <UIcon name="i-heroicons-chart-pie" class="w-12 h-12 text-purple-500 mx-auto mb-2" />
              <p class="text-2xl font-bold text-gray-900">0</p>
              <p class="text-sm text-gray-500">Budgets actifs</p>
            </div>
          </UCard>
        </div>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Actions rapides</h3>
          </template>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <UButton
              color="primary"
              variant="soft"
              icon="i-heroicons-plus-circle"
              block
            >
              Nouveau compte
            </UButton>
            <UButton
              color="success"
              variant="soft"
              icon="i-heroicons-arrow-path"
              block
            >
              Nouvelle transaction
            </UButton>
            <UButton
              color="secondary"
              variant="soft"
              icon="i-heroicons-chart-pie"
              block
            >
              Nouveau budget
            </UButton>
            <UButton
              color="warning"
              variant="soft"
              icon="i-heroicons-chart-bar"
              block
            >
              Voir les rapports
            </UButton>
            <UButton
              color="error"
              variant="soft"
              icon="i-heroicons-arrow-right-on-rectangle"
              block
              @click="handleLogout"
            >
              Déconnexion
            </UButton>
          </div>
        </UCard>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
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
</script>
