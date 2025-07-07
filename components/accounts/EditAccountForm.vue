<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">
        Modifier le compte
      </h3>
      <p class="text-sm text-gray-500">
        Mettez à jour les informations de votre compte
      </p>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Nom" name="name">
        <UInput
          v-model="state.name"
          placeholder="Nom du compte"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Description" name="description">
        <UTextarea
          v-model="state.description"
          placeholder="Description optionnelle du compte"
          :rows="3"
          class="w-full"
        />
      </UFormField>

      <UFormField label="RIB" name="rib">
        <UInput
          v-model="state.rib"
          placeholder="FR76 1234 5678 9012 3456 7890 123"
          class="w-full"
        />
      </UFormField>

      <div class="flex gap-3 pt-4">
        <UButton
          type="button"
          variant="outline"
          @click="$router.back()"
        >
          Annuler
        </UButton>
        <UButton
          type="submit"
          :loading="isLoading"
          color="primary"
        >
          Mettre à jour
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { editAccountFormSchema, type EditAccountFormData } from '~/core/schemas/account.schema'
import type { Account } from '~/core/types/account'

interface Props {
  account: Account
}

const props = defineProps<Props>()

const schema = editAccountFormSchema

// État réactif pré-rempli avec les données du compte
const state = reactive<Partial<EditAccountFormData>>({
  name: props.account.name,
  description: props.account.description || '',
  rib: props.account.rib || ''
})

const isLoading = ref(false)
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<EditAccountFormData>) {
  isLoading.value = true

  try {
    const response = await $fetch(`/api/accounts/${props.account.id}`, {
      method: 'PUT' as any,
      body: event.data
    })

    toast.add({
      title: 'Compte mis à jour avec succès',
      description: `Le compte "${event.data.name}" a été modifié`,
      color: 'success'
    })

    // Émettre l'événement pour recharger les comptes
    const { emit } = useEvents()
    emit('reload-accounts')

    // Rediriger vers la page précédente
    await navigateTo(`/accounts/type/${props.account.type}/view/${props.account.id}`)
  } catch (error: any) {
    console.log(error)
    toast.add({
      title: 'Erreur lors de la modification',
      description: error.data?.message || 'Erreur lors de la modification du compte',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script> 