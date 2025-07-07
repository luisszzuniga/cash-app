<template>
  <div class="space-y-6">
    <!-- En-tête de page -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Transactions
        </h1>
        <p class="text-gray-600">
          Gérez et visualisez toutes vos opérations financières
        </p>
      </div>
    </div>

    <!-- Tableau des transactions -->
    <TransactionsTable />
  </div>
</template>

<script setup lang="ts">
// Définir les métadonnées de la page
definePageMeta({
  title: 'Transactions',
  description: 'Gérez et visualisez toutes vos opérations financières',
  layout: 'default'
})
</script> 