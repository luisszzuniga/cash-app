<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <UHeader
      v-if="loggedIn"
      :links="navigationLinks"
      class="border-b border-gray-200"
    >
      <template #logo>
        <div class="flex items-center space-x-2">
          <UIcon name="i-heroicons-currency-dollar" class="w-8 h-8 text-primary-500" />
          <span class="text-xl font-bold text-gray-900">Cash App</span>
        </div>
      </template>

      <template #right>
        <UDropdown
          :items="userMenuItems"
          :popper="{ placement: 'bottom-end' }"
        >
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-user-circle"
          >
            {{ user?.email }}
          </UButton>
        </UDropdown>
      </template>
    </UHeader>

    <!-- Contenu principal -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <UFooter
      v-if="loggedIn"
      class="border-t border-gray-200"
    >
      <template #left>
        <p class="text-sm text-gray-500">
          © 2024 Cash App. Tous droits réservés.
        </p>
      </template>
      
      <template #right>
        <div class="flex space-x-4">
          <UButton
            variant="link"
            color="gray"
            size="sm"
          >
            Confidentialité
          </UButton>
          <UButton
            variant="link"
            color="gray"
            size="sm"
          >
            Conditions
          </UButton>
        </div>
      </template>
    </UFooter>
  </div>
</template>

<script setup lang="ts">
const { loggedIn, user, clear } = useAuth();

// Navigation links
const navigationLinks = computed(() => [
  {
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/dashboard'
  },
  {
    label: 'Comptes',
    icon: 'i-heroicons-credit-card',
    to: '/accounts'
  },
  {
    label: 'Transactions',
    icon: 'i-heroicons-arrow-path',
    to: '/transactions'
  },
  {
    label: 'Budgets',
    icon: 'i-heroicons-chart-pie',
    to: '/budgets'
  }
]);

// User menu items
const userMenuItems = computed(() => [
  [
    {
      label: 'Profil',
      icon: 'i-heroicons-user-circle',
      to: '/profile'
    },
    {
      label: 'Paramètres',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/settings'
    }
  ],
  [
    {
      label: 'Se déconnecter',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: () => handleLogout()
    }
  ]
]);

// Logout handler
const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    clear();
    await navigateTo('/login');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};
</script> 