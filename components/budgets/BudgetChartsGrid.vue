<template>
  <div class="space-y-6">
    <!-- Navigation temporelle -->
    <MonthYearNavigator
      :initial-year="initialYear"
      :initial-month="initialMonth"
      @month-changed="handleMonthChanged"
      @refresh="loadBudgets"
    />

    <!-- Grille des graphiques -->
    <div v-if="pending" class="flex justify-center py-8">
      <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin" />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500 text-4xl mx-auto mb-4" />
      <p class="text-gray-600">Erreur lors du chargement des budgets</p>
      <UButton
        color="primary"
        variant="outline"
        class="mt-4"
        @click="loadBudgets"
      >
        Réessayer
      </UButton>
    </div>

    <div v-else-if="budgets.length === 0" class="text-center py-8">
      <UIcon name="i-heroicons-chart-pie" class="text-gray-400 text-4xl mx-auto mb-4" />
      <p class="text-gray-600">Aucun budget trouvé pour cette période</p>
    </div>

    <div v-if="! pending && ! error && budgets.length > 0" class="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <!-- Grille des graphiques individuels -->
      <div class="xl:col-span-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ClientOnly>
          <BudgetDoughnutChart
            v-for="budget in budgets"
            :key="budget.id"
            :budget="budget"
            @edit="editBudget"
              @delete="deleteBudget"
            />
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Aperçu global des budgets -->
    <div class="xl:col-span-1">
      <ClientOnly>
      <BudgetOverviewChart
        :life="life"
        :year="currentYear"
        :month="currentMonth"
        :budgets="budgets"
        :pending="pending"
        :error="error"
      /></ClientOnly>
    </div>

    <!-- Modal d'ajout/édition de budget -->
    <BudgetForm
      v-model="showAddBudgetModal"
      :budget="editingBudget"
      :show-trigger="true"
      @budget-saved="handleBudgetSaved"
    />
  </div>
</template>

<script setup lang="ts">
import type { budget, BudgetWithSpent } from '~/core/types/budget'
import MonthYearNavigator from '~/components/budgets/MonthYearNavigator.vue'
import BudgetDoughnutChart from '~/components/budgets/BudgetDoughnutChart.vue'
import BudgetOverviewChart from '~/components/budgets/BudgetOverviewChart.vue'
import BudgetForm from '~/components/budgets/BudgetForm.vue'

interface Props {
  life?: 'pro' | 'perso'
  initialYear?: number
  initialMonth?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialYear: () => new Date().getFullYear(),
  initialMonth: () => new Date().getMonth() + 1
})

// État réactif
const currentYear = ref(props.initialYear)
const currentMonth = ref(props.initialMonth)
const showAddBudgetModal = ref(false)
const editingBudget = ref<budget | undefined>(undefined)

// Charger les budgets avec les montants dépensés
const { data: budgets, pending, error, refresh } = await useLazyAsyncData(
  () => `budgets-with-spent-${currentYear.value}-${currentMonth.value}-${props.life || 'all'}`,
  () => $fetch<BudgetWithSpent[]>('/api/budgets/with-spent', {
    params: {
      year: currentYear.value,
      month: currentMonth.value,
      ...(props.life && { life: props.life })
    }
  }),
  {
    default: () => []
  }
)

// Surveiller les changements de props et forcer le rechargement
watch([() => props.life, currentYear, currentMonth], () => {
  refresh()
}, { immediate: true })

// Gestionnaires d'événements
const handleMonthChanged = (year: number, month: number) => {
  currentYear.value = year
  currentMonth.value = month
  loadBudgets()
}

const loadBudgets = () => {
  refresh()
}

const editBudget = (budget: budget) => {
  editingBudget.value = budget
  showAddBudgetModal.value = true
}

const deleteBudget = async (budget: budget) => {
  const confirmed = await confirm(`Êtes-vous sûr de vouloir supprimer le budget "${budget.name}" ?`)
  
  if (confirmed) {
    try {
      await $fetch(`/api/budgets/${budget.id}`, {
        method: 'DELETE'
      })
      
      // Recharger les données
      loadBudgets()
      
      // Émettre l'événement global
      const { emit } = useEvents()
      emit('reload-budgets')
      
      // Notification de succès
      const toast = useToast()
      toast.add({
        title: 'Budget supprimé',
        description: `Le budget "${budget.name}" a été supprimé avec succès.`,
        color: 'success'
      })
    } catch (error) {
      console.error('Erreur lors de la suppression du budget:', error)
      
      const toast = useToast()
      toast.add({
        title: 'Erreur',
        description: 'Impossible de supprimer le budget.',
        color: 'error'
      })
    }
  }
}

const handleBudgetSaved = () => {
  showAddBudgetModal.value = false
  editingBudget.value = undefined
  loadBudgets()
}

// Écouter les événements de rechargement
const { on } = useEvents()
on('reload-transactions', () => {
  loadBudgets()
})
on('reload-budgets', () => {
  loadBudgets()
})
</script> 