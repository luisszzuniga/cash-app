<template>
  <UModal v-model:open="open">
    <UButton
        :label="triggerLabel"
        :color="triggerColor"
        :variant="triggerVariant"
        :icon="triggerIcon"
    />

    <template #content="{ close }">
      <div class="p-4">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            Nouveau Compte
          </h3>
          <p class="text-sm text-gray-500">
            Créez un nouveau compte bancaire, d'épargne ou portefeuille
          </p>
        </div>

        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Vie" name="life">
            <USelect
              v-model="state.life"
              :items="lifeOptions"
              placeholder="Sélectionnez une vie"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Type" name="type">
            <USelect
              v-model="state.type"
              :items="typeOptions"
              placeholder="Sélectionnez un type"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Nom" name="name">
            <UInput
              v-model="state.name"
              placeholder="Compte Courant"
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
              placeholder="FRXX XXXX XXXX XXXX XXXX XXXX XXX"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Solde initial" name="balance">
            <UInput
              v-model="state.balance"
              type="number"
              placeholder="0"
              :min="0"
              :max="1000000000"
              step="0.01"
              class="w-full"
            />
          </UFormField>

          <div class="flex gap-3 pt-4">
            <UButton
              type="button"
              variant="outline"
              @click="close"
            >
              Annuler
            </UButton>
            <UButton
              type="submit"
              :loading="isLoading"
              color="primary"
            >
              Créer le compte
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { createAccountFormSchema, type CreateAccountFormData } from '~/core/schemas/account.schema'
import { Life } from '~/core/types/life'
import { AccountType } from '~/core/types/account'

// Props pour personnaliser le bouton trigger et pré-remplir les champs
interface Props {
  triggerLabel?: string
  triggerColor?: 'primary' | 'info' | 'error' | 'success' | 'secondary' | 'warning' | 'neutral'
  triggerVariant?: 'soft' | 'link' | 'solid' | 'outline' | 'subtle' | 'ghost'
  triggerIcon?: string
  defaultLife?: Life
  defaultType?: AccountType
  defaultName?: string
  defaultDescription?: string
  defaultRib?: string
  defaultBalance?: number
}

const props = withDefaults(defineProps<Props>(), {
  triggerLabel: 'Nouveau Compte',
  triggerColor: 'primary',
  triggerVariant: 'soft',
  triggerIcon: 'i-heroicons-plus-circle',
  defaultLife: Life.PRO,
  defaultType: AccountType.BANK,
  defaultBalance: 0
})

const schema = createAccountFormSchema

const state = reactive<Partial<CreateAccountFormData>>({
  life: props.defaultLife,
  type: props.defaultType,
  name: props.defaultName,
  description: props.defaultDescription,
  rib: props.defaultRib,
  balance: props.defaultBalance
})

// Fonction pour réinitialiser le formulaire aux valeurs par défaut
const resetForm = () => {
  state.life = props.defaultLife
  state.type = props.defaultType
  state.name = props.defaultName
  state.description = props.defaultDescription
  state.rib = props.defaultRib
  state.balance = props.defaultBalance
}

// Surveiller les changements de props pour mettre à jour le formulaire
watch(() => props.defaultLife, (newValue) => {
  state.life = newValue
})
watch(() => props.defaultType, (newValue) => {
  state.type = newValue
})
watch(() => props.defaultName, (newValue) => {
  state.name = newValue
})
watch(() => props.defaultDescription, (newValue) => {
  state.description = newValue
})
watch(() => props.defaultRib, (newValue) => {
  state.rib = newValue
})
watch(() => props.defaultBalance, (newValue) => {
  state.balance = newValue
})

const isLoading = ref(false)
const toast = useToast()
const open = ref(false)

// Surveiller l'ouverture/fermeture de la modale pour réinitialiser le formulaire
watch(open, (isOpen) => {
  if (!isOpen) {
    // Réinitialiser le formulaire quand la modale se ferme
    resetForm()
  }
})

// Options pour les selects
const lifeOptions = [
  { label: 'Professionnel', value: Life.PRO },
  { label: 'Personnel', value: Life.PERSO }
]

const typeOptions = [
  { label: 'Bancaire', value: AccountType.BANK },
  { label: 'Épargne', value: AccountType.SAVINGS },
  { label: 'Portefeuille d\'actions', value: AccountType.PORTFOLIO }
]

async function onSubmit(event: FormSubmitEvent<CreateAccountFormData>) {
  isLoading.value = true

  try {
    const response = await $fetch('/api/accounts', {
      method: 'POST',
      body: event.data
    })

    toast.add({
      title: 'Compte créé avec succès',
      description: `Le compte "${event.data.name}" a été créé`,
      color: 'success'
    })

    open.value = false
    resetForm()

    // Émettre l'événement pour recharger les comptes
    const { emit } = useEvents()
    emit('reload-accounts')
    emit('reload-transactions')

    await navigateTo('/dashboard')
  } catch (error: any) {
    toast.add({
      title: 'Erreur lors de la création',
      description: error.data?.message || 'Erreur lors de la création du compte',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script> 