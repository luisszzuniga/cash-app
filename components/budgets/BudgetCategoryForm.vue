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
            {{ isEditing ? 'Modifier' : 'Nouvelle' }} Catégorie de Budget
          </h3>
          <p class="text-sm text-gray-500">
            {{ isEditing ? 'Modifiez' : 'Créez' }} une catégorie de budget pour vos prévisions mensuelles
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
              placeholder="Assurance habitation"
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

          <UFormField label="Jour de prélèvement" name="dayOfMonth">
            <UInput
              v-model="state.dayOfMonth"
              type="number"
              placeholder="Optionnel (1-31)"
              :min="1"
              :max="31"
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
              {{ isEditing ? 'Modifier' : 'Créer' }}
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { budgetCategoryFormSchema, type BudgetCategoryFormData } from '~/core/schemas/budget.schema'
import { Life } from '~/core/types/life'
import { BudgetType } from '~/core/types/budget'
import type { BudgetCategory } from '~/core/types/budget'

// Props pour personnaliser le bouton trigger et pré-remplir les champs
interface Props {
  triggerLabel?: string
  triggerColor?: 'primary' | 'info' | 'error' | 'success' | 'secondary' | 'warning' | 'neutral'
  triggerVariant?: 'soft' | 'link' | 'solid' | 'outline' | 'subtle' | 'ghost'
  triggerIcon?: string
  // Pour l'édition
  budgetCategory?: BudgetCategory
  // Valeurs par défaut pour la création
  defaultLife?: Life
  defaultType?: BudgetType
  defaultName?: string
  defaultAmount?: number
  defaultDayOfMonth?: number
}

const props = withDefaults(defineProps<Props>(), {
  triggerLabel: 'Nouvelle Catégorie',
  triggerColor: 'primary',
  triggerVariant: 'soft',
  triggerIcon: 'i-heroicons-plus-circle',
  defaultLife: Life.PRO,
  defaultType: BudgetType.EXPENSE,
  defaultAmount: 0,
  defaultDayOfMonth: undefined
})

const schema = budgetCategoryFormSchema

const open = ref(false)
const isEditing = computed(() => !!props.budgetCategory)

// État réactif pré-rempli avec les données existantes ou par défaut
const state = reactive<Partial<BudgetCategoryFormData>>({
  life: props.budgetCategory?.life || props.defaultLife,
  type: props.budgetCategory?.type || props.defaultType,
  name: props.budgetCategory?.name || props.defaultName,
  amount: props.budgetCategory?.amount || props.defaultAmount,
  dayOfMonth: props.budgetCategory?.dayOfMonth || props.defaultDayOfMonth
})

const isLoading = ref(false)
const toast = useToast()

// Options pour les selects
const lifeOptions = [
  { label: 'Professionnel', value: Life.PRO },
  { label: 'Personnel', value: Life.PERSO }
]

const typeOptions = [
  { label: 'Dépense', value: BudgetType.EXPENSE },
  { label: 'Transfert', value: BudgetType.TRANSFER }
]

// Fonction pour réinitialiser le formulaire
const resetForm = () => {
  state.life = props.budgetCategory?.life || props.defaultLife
  state.type = props.budgetCategory?.type || props.defaultType
  state.name = props.budgetCategory?.name || props.defaultName
  state.amount = props.budgetCategory?.amount || props.defaultAmount
  state.dayOfMonth = props.budgetCategory?.dayOfMonth || props.defaultDayOfMonth
}

// Surveiller l'ouverture/fermeture de la modale
watch(open, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})

// Surveiller les changements de props pour mettre à jour le formulaire
watch(() => props.budgetCategory, () => {
  if (props.budgetCategory) {
    state.life = props.budgetCategory.life
    state.type = props.budgetCategory.type
    state.name = props.budgetCategory.name
    state.amount = props.budgetCategory.amount
    state.dayOfMonth = props.budgetCategory.dayOfMonth
  }
})

async function onSubmit(event: FormSubmitEvent<BudgetCategoryFormData>) {
  isLoading.value = true

  try {
    let response
    let successMessage

    if (isEditing.value && props.budgetCategory) {
      // Modification
      response = await $fetch(`/api/budget-categories/${props.budgetCategory.id}`, {
        method: 'PUT' as any,
        body: event.data
      })
      successMessage = `La catégorie "${event.data.name}" a été modifiée`
    } else {
      // Création
      response = await $fetch('/api/budget-categories', {
        method: 'POST' as any,
        body: event.data
      })
      successMessage = `La catégorie "${event.data.name}" a été créée`
    }

    toast.add({
      title: isEditing.value ? 'Catégorie modifiée' : 'Catégorie créée',
      description: successMessage,
      color: 'success'
    })

    open.value = false
    resetForm()

    // Émettre l'événement pour recharger les budgets
    const { emit } = useEvents()
    emit('reload-budgets')
  } catch (error: any) {
    toast.add({
      title: 'Erreur',
      description: error.data?.message || `Erreur lors de la ${isEditing.value ? 'modification' : 'création'} de la catégorie`,
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script> 