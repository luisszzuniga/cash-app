<template>
  <UCard class="h-full flex flex-col">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UBadge
            :color="budget.type === 'expense' ? 'error' : 'primary'"
            variant="soft"
            size="sm"
          >
            {{ budget.type === 'expense' ? 'Dépense' : 'Transfert' }}
          </UBadge>

          <UBadge
            :color="budget.life === 'pro' ? 'primary' : 'secondary'"
            variant="soft"
            size="sm"
          >
            {{ budget.life === 'pro' ? 'Professionnel' : 'Personnel' }}
          </UBadge>

          <UTooltip text="Ce budget sera copié le mois prochain">
            <UIcon
              v-if="budget.shouldBeCopiedNextMonth"
              name="i-heroicons-arrow-path"
              class="text-blue-500"
            />
          </UTooltip>
        </div>
        <div class="flex gap-1">
          <UButton
            color="primary"
            variant="ghost"
            icon="i-heroicons-pencil-square"
            size="xs"
            @click="editBudget"
          />
          <UButton
            color="error"
            variant="ghost"
            icon="i-heroicons-trash"
            size="xs"
            @click="deleteBudget"
          />
        </div>
      </div>
    </template>

    <div class="text-center flex flex-col items-center flex-1">
      <h3 class="font-semibold text-gray-900 mb-2 w-full">
        {{ budget.name }}
      </h3>
      
      <!-- Doughnut Chart -->
      <div class="relative w-32 h-32 mx-auto mb-4 flex-shrink-0">
        <svg class="w-full h-full" viewBox="0 0 100 100">
          <!-- Cercle de fond -->
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="8"
          />

          <!-- Portion consommée -->
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            :stroke="consumptionColor"
            stroke-width="8"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            stroke-linecap="round"
            :class="isOverBudget ? 'stroke-red-300' : ''"
          />
          
          <!-- Texte central -->
          <text
            x="50"
            y="45"
            text-anchor="middle"
            class="text-xs font-semibold fill-gray-700"
          >
            {{ consumptionPercentage }}%
          </text>
          <text
            x="50"
            y="58"
            text-anchor="middle"
            class="text-xs fill-gray-500"
          >
            {{ formatCurrency(budget.amount) }}
          </text>
        </svg>
      </div>

      <!-- Informations détaillées -->
      <div class="space-y-2 text-sm w-full">
        <div class="flex justify-between">
          <span class="text-gray-600">Prévu :</span>
          <span class="font-medium">{{ formatCurrency(budget.amount) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Dépensé :</span>
          <span class="font-medium" :class="spentAmountClass">
            {{ formatCurrency(spentAmount) }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Reste :</span>
          <span class="font-medium" :class="remainingAmountClass">
            {{ formatCurrency(remainingAmount) }}
          </span>
        </div>
        
        <div v-if="budget.dayOfMonth" class="text-xs text-gray-500">
          Prélèvement le {{ budget.dayOfMonth }} du mois
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { budget } from '~/core/types/budget'

interface Props {
  budget: budget & {
    shouldBeCopiedNextMonth?: boolean
    spentAmount?: number
  }
}

const props = defineProps<Props>()

// Émettre les événements pour les actions
const emit = defineEmits<{
  edit: [budget: budget]
  delete: [budget: budget]
}>()

// Calculs pour le doughnut
const circumference = 2 * Math.PI * 40 // r = 40
const spentAmount = computed(() => {
  // Les dépenses sont stockées en valeurs négatives, on prend la valeur absolue
  return Math.abs(props.budget.spentAmount || 0)
})
const consumptionPercentage = computed(() => {
  if (props.budget.amount === 0) return 0
  return Math.min(100, Math.round((spentAmount.value / props.budget.amount) * 100))
})

const strokeDashoffset = computed(() => {
  const percentage = consumptionPercentage.value / 100
  return circumference * (1 - percentage)
})

// Couleurs selon le pourcentage de consommation
const consumptionColor = computed(() => {
  const percentage = consumptionPercentage.value
  if (percentage <= 50) return '#10b981' // Vert
  if (percentage <= 100) return '#f59e0b' // Orange
  return '#ef4444' // Rouge
})

const isOverBudget = computed(() => consumptionPercentage.value > 100)

// Classes pour les montants
const spentAmountClass = computed(() => {
  const percentage = consumptionPercentage.value
  if (percentage > 100) return 'text-red-600'
  if (percentage > 50) return 'text-orange-600'
  return 'text-green-600'
})

const remainingAmount = computed(() => props.budget.amount - spentAmount.value)

const remainingAmountClass = computed(() => {
  if (remainingAmount.value < 0) return 'text-red-600'
  return 'text-gray-900'
})

// Formater la monnaie
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount)
}

// Actions
const editBudget = () => {
  emit('edit', props.budget)
}

const deleteBudget = () => {
  emit('delete', props.budget)
}
</script> 