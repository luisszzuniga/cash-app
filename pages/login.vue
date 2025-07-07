<template>
  <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 h-screen">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900">
            Connexion à votre compte
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Accédez à votre espace personnel
          </p>
        </div>
      </template>

      <LoginForm />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue';

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
});
</script> 