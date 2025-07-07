<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Logo en haut -->
    <div class="flex justify-center pt-8">
      <div class="flex items-center space-x-2">
        <UIcon name="i-heroicons-currency-dollar" class="w-8 h-8 text-primary-500" />
        <span class="text-xl font-bold text-gray-900">Cash App</span>
      </div>
    </div>

    <!-- Contenu principal -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer simple -->
    <footer class="py-8 text-center">
      <p class="text-sm text-gray-500">
        © 2024 Cash App. Tous droits réservés.
      </p>
    </footer>
  </div>
</template> 