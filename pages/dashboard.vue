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

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Actions rapides</h3>
          </template>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
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
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

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
