<template>
  <div class="min-h-screen bg-gray-50 flex gap-x-4 p-4">
    <div class="h-full">
      <Sidebar />
    </div>
    <!-- Contenu principal -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue';


</script> 