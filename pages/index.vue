<template>
  <UContainer class="py-12">
      <div class="text-center">
        <UIcon 
          name="i-heroicons-home" 
          class="w-16 h-16 text-primary-500 mx-auto mb-6" 
        />
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue sur Cash App
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Gérez vos finances en toute simplicité
        </p>
        
        <div class="flex justify-center space-x-4">
          <UButton
            to="/dashboard"
            color="primary"
            size="lg"
            icon="i-heroicons-arrow-right"
          >
            Accéder au dashboard
          </UButton>
          <UButton
            to="/login"
            variant="outline"
            size="lg"
            icon="i-heroicons-user"
          >
            Se connecter
          </UButton>
        </div>
              </div>
      </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

// Redirection vers le dashboard si connecté
onMounted(async () => {
  const { loggedIn } = useAuth();
  
  if (loggedIn.value) {
    await navigateTo('/dashboard');
  }
});
</script> 