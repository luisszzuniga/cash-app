<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <div class="flex flex-col gap-4 mb-6">
      <UFormField label="Email" name="email">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="votre@email.com"
          size="xl"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Mot de passe" name="password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Votre mot de passe"
          size="xl"
          class="w-full"
        />
      </UFormField>
    </div>

    <UButton
      type="submit"
      :loading="isLoading"
      block
      color="primary"
      size="xl"
      class="w-full"
    >
      Se connecter
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { login } = useAuth();
const toast = useToast()

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

const isLoading = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  
  try {
    const result = await login(event.data);
    if (result.success) {
      toast.add({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté',
        color: 'success'
      })
      await navigateTo('/dashboard')
    } else {
      toast.add({
        title: 'Erreur de connexion',
        description: result.message || 'Erreur lors de la connexion',
        color: 'error'
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script> 