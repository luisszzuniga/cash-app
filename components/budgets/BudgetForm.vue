<template>
  <UModal v-model:open="isOpen">
    <UButton
      v-if="showTrigger"
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
import { BudgetFormSchema, type BudgetFormData } from '~/core/schemas/budget.schema'
import { Life } from '~/core/types/life'
import { BudgetType } from '~/core/types/budget'
import type { budget } from '~/core/types/budget'

// Props pour personnaliser le bouton trigger et pré-remplir les champs
interface Props {
  modelValue?: boolean
  triggerLabel?: string
  triggerColor?: 'primary' | 'info' | 'error' | 'success' | 'secondary' | 'warning' | 'neutral'
  triggerVariant?: 'soft' | 'link' | 'solid' | 'outline' | 'subtle' | 'ghost'
  triggerIcon?: string
  showTrigger?: boolean
  // Pour l'édition
  budget?: budget
  // Valeurs par défaut pour la création
  defaultLife?: Life
  defaultType?: BudgetType
  defaultName?: string
  defaultAmount?: number
  defaultDayOfMonth?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  triggerLabel: 'Nouvelle Catégorie',
  triggerColor: 'primary',
  triggerVariant: 'soft',
  triggerIcon: 'i-heroicons-plus-circle',
  showTrigger: true,
  defaultLife: Life.PRO,
  defaultType: BudgetType.EXPENSE,
  defaultAmount: 0,
  defaultDayOfMonth: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'budget-saved': []
}>()

const schema = BudgetFormSchema

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEditing = computed(() => !!props.budget)

// État réactif pré-rempli avec les données existantes ou par défaut
const state = reactive<Partial<BudgetFormData>>({
  life: props.budget?.life || props.defaultLife,
  type: props.budget?.type || props.defaultType,
  name: props.budget?.name || props.defaultName,
  amount: props.budget?.amount || props.defaultAmount,
  dayOfMonth: props.budget?.dayOfMonth || props.defaultDayOfMonth
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
  state.life = props.budget?.life || props.defaultLife
  state.type = props.budget?.type || props.defaultType
  state.name = props.budget?.name || props.defaultName
  state.amount = props.budget?.amount || props.defaultAmount
  state.dayOfMonth = props.budget?.dayOfMonth || props.defaultDayOfMonth
}

// Surveiller l'ouverture/fermeture de la modale
watch(isOpen, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})

// Surveiller les changements de props pour mettre à jour le formulaire
watch(() => props.budget, () => {
  if (props.budget) {
    state.life = props.budget.life
    state.type = props.budget.type
    state.name = props.budget.name
    state.amount = props.budget.amount
    state.dayOfMonth = props.budget.dayOfMonth
  }
})

async function onSubmit(event: FormSubmitEvent<BudgetFormData>) {
  isLoading.value = true

  try {
    let response
    let successMessage

    if (isEditing.value && props.budget) {
      // Modification
      response = await $fetch(`/api/budgets/${props.budget.id}`, {
        method: 'PUT' as any,
        body: event.data
      })
      successMessage = `La catégorie "${event.data.name}" a été modifiée`
    } else {
      // Création
      response = await $fetch('/api/budgets', {
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

    emit('update:modelValue', false)
    resetForm()

    // Émettre l'événement pour recharger les budgets
    const { emit: emitEvents } = useEvents()
    emitEvents('reload-budgets')
    
    // Émettre l'événement local
    emit('budget-saved')
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