<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          Navigation temporelle
        </h3>
        <UButton
          color="primary"
          variant="ghost"
          icon="i-heroicons-arrow-path"
          size="sm"
          :loading="isRefreshing"
          @click="refreshData"
        >
          Actualiser
        </UButton>
      </div>
    </template>

    <div class="flex items-center justify-center gap-4">
      <UButton
        color="primary"
        variant="outline"
        icon="i-heroicons-chevron-left"
        @click="previousMonth"
      >
        Mois précédent
      </UButton>

      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          {{ currentMonthLabel }}
        </div>
        <div class="text-sm text-gray-500">
          {{ currentYear }}
        </div>
      </div>

      <UButton
        color="primary"
        variant="outline"
        icon="i-heroicons-chevron-right"
        @click="nextMonth"
      >
        Mois suivant
      </UButton>
    </div>

    <div class="mt-4 flex justify-center gap-2">
      <UButton
        color="primary"
        variant="soft"
        size="sm"
        @click="goToCurrentMonth"
      >
        Aujourd'hui
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  initialYear?: number
  initialMonth?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialYear: () => new Date().getFullYear(),
  initialMonth: () => new Date().getMonth() + 1
})

const emit = defineEmits<{
  'month-changed': [year: number, month: number]
  'refresh': []
}>()

// État réactif
const currentYear = ref(props.initialYear)
const currentMonth = ref(props.initialMonth)
const isRefreshing = ref(false)

// Labels pour les mois
const monthLabels = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

const currentMonthLabel = computed(() => {
  return monthLabels[currentMonth.value - 1]
})

// Navigation
const previousMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
  emit('month-changed', currentYear.value, currentMonth.value)
}

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
  emit('month-changed', currentYear.value, currentMonth.value)
}

const goToCurrentMonth = () => {
  const now = new Date()
  currentYear.value = now.getFullYear()
  currentMonth.value = now.getMonth() + 1
  emit('month-changed', currentYear.value, currentMonth.value)
}

const refreshData = async () => {
  isRefreshing.value = true
  emit('refresh')
  
  // Simuler un délai pour l'UI
  await new Promise(resolve => setTimeout(resolve, 500))
  isRefreshing.value = false
}

// Écouter les événements de rechargement
const { on } = useEvents()
on('reload-transactions', () => {
  refreshData()
})
on('reload-budgets', () => {
  refreshData()
})
</script> 