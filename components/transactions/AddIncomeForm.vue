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
            Nouveau Revenu
          </h3>
          <p class="text-sm text-gray-500">
            Ajoutez un revenu sur un compte bancaire
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

          <UFormField label="Compte" name="accountId">
            <USelect
              v-model="state.accountId"
              :items="accountOptions"
              placeholder="Sélectionnez un compte bancaire"
              class="w-full"
              :disabled="!state.life"
            />
          </UFormField>

          <UFormField label="Libellé" name="label">
            <UInput
              v-model="state.label"
              placeholder="Salaire, Facture client, etc."
              class="w-full"
            />
          </UFormField>

          <UFormField label="Montant" name="amount">
            <UInput
              v-model="state.amount"
              type="number"
              placeholder="0.00"
              :min="0.01"
              :max="1000000000"
              step="0.01"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Date" name="date">
            <UInput
              v-model="state.date"
              type="date"
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
              Ajouter le revenu
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { addIncomeFormSchema, type AddIncomeFormData } from '~/core/schemas/transaction.schema'
import { Life } from '~/core/types/life'
import type { Account } from '~/core/types/account'

// Props pour personnaliser le bouton trigger
interface Props {
  triggerLabel?: string
  triggerColor?: 'primary' | 'info' | 'error' | 'success' | 'secondary' | 'warning' | 'neutral'
  triggerVariant?: 'soft' | 'link' | 'solid' | 'outline' | 'subtle' | 'ghost'
  triggerIcon?: string
  defaultLife?: Life
  defaultAccountId?: string
  defaultLabel?: string
  defaultAmount?: number
  defaultDate?: string
}

const props = withDefaults(defineProps<Props>(), {
  triggerLabel: 'Nouveau Revenu',
  triggerColor: 'success',
  triggerVariant: 'soft',
  triggerIcon: 'i-heroicons-plus-circle',
  defaultLife: Life.PRO,
  defaultAmount: 0,
  defaultDate: new Date().toISOString().split('T')[0]
})

const schema = addIncomeFormSchema

const open = ref(false)

// État réactif pré-rempli avec les valeurs par défaut
const state = reactive<Partial<AddIncomeFormData>>({
  life: props.defaultLife,
  accountId: props.defaultAccountId,
  label: props.defaultLabel,
  amount: props.defaultAmount,
  date: props.defaultDate
})

const isLoading = ref(false)
const toast = useToast()

// Options pour les selects
const lifeOptions = [
  { label: 'Professionnel', value: Life.PRO },
  { label: 'Personnel', value: Life.PERSO }
]

// Comptes bancaires filtrés selon la vie sélectionnée
const { data: bankAccounts } = await useLazyAsyncData(
  'bank-accounts',
  () => $fetch<Account[]>(`/api/accounts/bank?life=${state.life}`),
  { default: () => [] }
)

const accountOptions = computed(() => {
  return bankAccounts.value?.map(account => ({
    label: `${account.name} (${account.balance.toFixed(2)} €)`,
    value: account.id
  })) || []
})

// Surveiller les changements de vie pour recharger les comptes
watch(() => state.life, async (newLife) => {
  if (newLife) {
    await refreshNuxtData('bank-accounts')
    // Réinitialiser la sélection de compte
    state.accountId = undefined
  }
})

// Fonction pour réinitialiser le formulaire
const resetForm = () => {
  state.life = props.defaultLife
  state.accountId = props.defaultAccountId
  state.label = props.defaultLabel
  state.amount = props.defaultAmount
  state.date = props.defaultDate
}

// Surveiller l'ouverture/fermeture de la modale
watch(open, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})

async function onSubmit(event: FormSubmitEvent<AddIncomeFormData>) {
  isLoading.value = true

  try {
    const response = await $fetch('/api/transactions/income', {
      method: 'POST' as any,
      body: event.data
    })

    toast.add({
      title: 'Revenu ajouté avec succès',
      description: `${event.data.label} (${event.data.amount.toFixed(2)} €) a été ajouté`,
      color: 'success'
    })

    open.value = false
    resetForm()

    // Émettre l'événement pour recharger les transactions
    const { emit } = useEvents()
    emit('reload-transactions')
  } catch (error: any) {
    toast.add({
      title: 'Erreur lors de l\'ajout',
      description: error.data?.message || 'Erreur lors de l\'ajout du revenu',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script> 