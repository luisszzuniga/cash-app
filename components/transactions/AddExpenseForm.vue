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
            Nouvelle Dépense
          </h3>
          <p class="text-sm text-gray-500">
            Ajoutez une dépense liée à une catégorie de budget
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
              placeholder="Sélectionnez un compte"
              class="w-full"
              :loading="loadingAccounts"
            />
          </UFormField>

          <UFormField label="Catégorie de budget" name="budgetId">
            <USelect
              v-model="state.budgetId"
              :items="budgetOptions"
              placeholder="Sélectionnez une catégorie"
              class="w-full"
              :loading="loading"
            />
          </UFormField>

          <UFormField label="Libellé" name="label">
            <UInput
              v-model="state.label"
              placeholder="Courses, Essence, etc."
              class="w-full"
              maxlength="255"
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
              Ajouter la dépense
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { addExpenseFormSchema, type AddExpenseFormData } from '~/core/schemas/transaction.schema'
import { Life } from '~/core/types/life'

// Types
interface Account {
  id: string
  name: string
  type: string
  life: 'pro' | 'perso'
  balance: number
}

interface Budget {
  id: string
  name: string
  type: 'expense' | 'transfer'
  life: 'pro' | 'perso'
}

// Props pour personnaliser le bouton trigger
interface Props {
  triggerLabel?: string
  triggerColor?: 'primary' | 'info' | 'error' | 'success' | 'secondary' | 'warning' | 'neutral'
  triggerVariant?: 'soft' | 'link' | 'solid' | 'outline' | 'subtle' | 'ghost'
  triggerIcon?: string
  defaultLife?: Life
  defaultAccountId?: string
  defaultBudgetId?: string
  defaultLabel?: string
  defaultAmount?: number
  defaultDate?: string
}

const props = withDefaults(defineProps<Props>(), {
  triggerLabel: 'Nouvelle Dépense',
  triggerColor: 'error',
  triggerVariant: 'soft',
  triggerIcon: 'i-heroicons-minus-circle',
  defaultLife: Life.PRO,
  defaultAmount: 0,
  defaultDate: new Date().toISOString().split('T')[0]
})

const schema = addExpenseFormSchema

const open = ref(false)

// État réactif pré-rempli avec les valeurs par défaut
const state = reactive<Partial<AddExpenseFormData>>({
  life: props.defaultLife,
  accountId: props.defaultAccountId,
  budgetId: props.defaultBudgetId,
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

// État réactif pour les données
const bankAccounts = ref<Account[]>([])
const budgets = ref<Budget[]>([])
const loadingAccounts = ref(false)
const loading = ref(false)

// Fonction pour charger les comptes bancaires
const loadBankAccounts = async () => {
  loadingAccounts.value = true
  try {
    bankAccounts.value = await $fetch<Account[]>(`/api/accounts/bank?life=${state.life}`)
  } catch (error) {
    console.error('Erreur lors du chargement des comptes:', error)
    bankAccounts.value = []
  } finally {
    loadingAccounts.value = false
  }
}

// Fonction pour charger les catégories de budget
const loadBudgets = async () => {
  loading.value = true
  try {
    budgets.value = await $fetch<Budget[]>(`/api/budgets?life=${state.life}&type=expense`)
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
    budgets.value = []
  } finally {
    loading.value = false
  }
}

// Charger les données initiales
await loadBankAccounts()
await loadBudgets()

const accountOptions = computed(() => {
  return bankAccounts.value?.map(account => ({
    label: `${account.name} (${account.balance.toFixed(2)} €)`,
    value: account.id
  })) || []
})

const budgetOptions = computed(() => {
  const json = JSON.parse(budgets.value)
  return json?.map(budget => ({
    label: budget.name,
    value: String(budget.id)
  })) || []
})

// Surveiller les changements de vie pour recharger les données
watch(() => state.life, async (newLife) => {
  if (newLife) {
    await loadBankAccounts()
    await loadBudgets()
    // Réinitialiser les sélections
    state.accountId = undefined
    state.budgetId = undefined
  }
})

// Fonction pour réinitialiser le formulaire
const resetForm = () => {
  state.life = props.defaultLife
  state.accountId = props.defaultAccountId
  state.budgetId = props.defaultBudgetId
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

async function onSubmit(event: FormSubmitEvent<AddExpenseFormData>) {
  isLoading.value = true

  try {
    const response = await $fetch('/api/transactions/expense', {
      method: 'POST' as any,
      body: {
        ...event.data,
        amount: Math.round(event.data.amount * 100) // Convertir en centimes
      }
    })

    toast.add({
      title: 'Dépense ajoutée avec succès',
      description: `${event.data.label || 'Dépense'} (${event.data.amount.toFixed(2)} €) a été ajoutée`,
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
      description: error.data?.message || 'Erreur lors de l\'ajout de la dépense',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script> 