<template>
  <UCard class="h-full">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          Aperçu des Budgets
        </h3>
        <UBadge
          v-if="life"
          :color="life === 'pro' ? 'primary' : 'secondary'"
          variant="soft"
          size="sm"
        >
          {{ life === 'pro' ? 'Professionnel' : 'Personnel' }}
        </UBadge>
      </div>
    </template>

    <div v-if="pending" class="flex justify-center items-center h-64">
      <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin" />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500 text-4xl mx-auto mb-4" />
      <p class="text-gray-600">Erreur lors du chargement des données</p>
    </div>

    <div v-else-if="!props.budgets || props.budgets.length === 0" class="text-center py-8">
      <UIcon name="i-heroicons-chart-pie" class="text-gray-400 text-4xl mx-auto mb-4" />
      <p class="text-gray-600">Aucun budget trouvé pour cette période</p>
    </div>

    <div v-else class="flex flex-col lg:flex-row gap-6">
      <!-- Graphique SVG Doughnut -->
      <div class="flex-1">
        <div class="relative h-64 flex items-center justify-center">
          <svg
            :width="200"
            :height="200"
            class="transform -rotate-90"
            viewBox="0 0 200 200"
          >
            <!-- Cercle de fond -->
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="20"
            />
            
            <!-- Segments du doughnut -->
            <g v-for="(budget, index) in doughnutSegments" :key="budget.id">
              <path
                :d="budget.pathData"
                fill="none"
                :stroke="budget.color"
                stroke-width="20"
                stroke-linecap="round"
                class="transition-all duration-500 ease-out cursor-pointer hover:stroke-opacity-80"
                @mouseenter="handleMouseEnter($event, budget)"
                @mouseleave="hoveredSegment = null"
              />
            </g>
          </svg>
          
          <!-- Texte central -->
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <div class="text-2xl font-bold text-gray-900">
              {{ formatCurrency(totalBudget) }}
            </div>
            <div class="text-xs text-gray-500">
              {{ getMonthName(props.month) }} {{ props.year }}
            </div>
          </div>
          
          <!-- Tooltip au hover -->
          <div
            v-if="hoveredSegment"
            class="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg z-10 pointer-events-none"
            :style="tooltipPosition"
          >
            <div class="font-semibold">{{ getBudgetName(hoveredSegment.id) }}</div>
            <div class="text-gray-300">{{ hoveredSegment.percentage }}%</div>
            <div class="text-gray-300">{{ formatCurrency(hoveredSegment.amount) }}</div>
          </div>
        </div>
      </div>

      <!-- Informations et légende -->
      <div class="flex-1 space-y-4">
        <!-- Budget total -->
        <div class="text-center lg:text-left">
          <h4 class="text-sm font-medium text-gray-500 mb-1">Budget Total / Mois</h4>
          <div class="text-3xl font-bold text-gray-900">
            {{ formatCurrency(totalBudget) }}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            {{ getMonthName(props.month) }} {{ props.year }}
          </div>
        </div>

        <!-- Légende des catégories -->
        <div class="space-y-2">
          <h4 class="text-sm font-medium text-gray-500">Répartition par catégorie</h4>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div
              v-for="(budget, index) in props.budgets"
              :key="budget.id"
              class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: chartColors[index % chartColors.length] }"
                ></div>
                <span class="text-sm font-medium text-gray-900">{{ budget.name }}</span>
                <UBadge
                  :color="budget.type === 'expense' ? 'error' : 'primary'"
                  variant="soft"
                  size="xs"
                >
                  {{ budget.type === 'expense' ? 'Dépense' : 'Transfert' }}
                </UBadge>
              </div>
              <span class="text-sm font-semibold text-gray-700">
                {{ formatCurrency(budget.amount) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
          <div class="text-center">
            <div class="text-sm text-gray-500">Dépenses</div>
            <div class="text-lg font-semibold text-red-600">
              {{ formatCurrency(expenseTotal) }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-500">Transferts</div>
            <div class="text-lg font-semibold text-blue-600">
              {{ formatCurrency(transferTotal) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { BudgetCategoryWithSpent } from '~/core/types/budget'

interface Props {
  life?: 'pro' | 'perso'
  year: number
  month: number
  budgets: BudgetCategoryWithSpent[]
  pending?: boolean
  error?: any
}

const props = defineProps<Props>()

// Couleurs pour le graphique
const chartColors = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
]

// Calculs
const totalBudget = computed(() => {
  return props.budgets?.reduce((sum: number, budget: BudgetCategoryWithSpent) => sum + budget.amount, 0) || 0
})

const expenseTotal = computed(() => {
  return props.budgets?.reduce((sum: number, budget: BudgetCategoryWithSpent) => {
    return budget.type === 'expense' ? sum + budget.amount : sum
  }, 0) || 0
})

const transferTotal = computed(() => {
  return props.budgets?.reduce((sum: number, budget: BudgetCategoryWithSpent) => {
    return budget.type === 'transfer' ? sum + budget.amount : sum
  }, 0) || 0
})

// Calcul des segments du doughnut
const doughnutSegments = computed(() => {
  if (!props.budgets || props.budgets.length === 0) return []
  
  const radius = 80
  const circumference = 2 * Math.PI * radius
  
  // Cas spécial : un seul budget = cercle complet
  if (props.budgets.length === 1) {
    const budget = props.budgets[0]
    return [{
      id: budget.id,
      color: chartColors[0],
      pathData: `M 100 20 A 80 80 0 1 1 99.99 20`, // Cercle complet
      percentage: '100.0',
      amount: budget.amount
    }]
  }
  
  let currentAngle = 0
  
  return props.budgets.map((budget, index) => {
    const percentage = budget.amount / totalBudget.value
    const angle = percentage * 2 * Math.PI
    
    // Calculer les coordonnées du début et fin de l'arc
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    
    // Calculer les points de contrôle pour l'arc SVG
    const startX = 100 + radius * Math.cos(startAngle)
    const startY = 100 + radius * Math.sin(startAngle)
    const endX = 100 + radius * Math.cos(endAngle)
    const endY = 100 + radius * Math.sin(endAngle)
    
    // Déterminer si l'arc est grand (plus de 180 degrés)
    const largeArcFlag = angle > Math.PI ? 1 : 0
    
    // Créer le path SVG pour l'arc
    const pathData = [
      `M ${startX} ${startY}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`
    ].join(' ')
    
    currentAngle += angle
    
    return {
      id: budget.id,
      color: chartColors[index % chartColors.length],
      pathData,
      percentage: (percentage * 100).toFixed(1),
      amount: budget.amount
    }
  })
})

// Formater la monnaie
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount)
}

// Obtenir le nom du mois
const getMonthName = (month: number) => {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]
  return monthNames[month - 1] || ''
}

// Tooltip
const hoveredSegment = ref<{
  id: string
  color: string
  pathData: string
  percentage: string
  amount: number
} | null>(null)

const tooltipPosition = ref({
  left: '0px',
  top: '0px'
})

const getBudgetName = (id: string) => {
  const budget = props.budgets.find(b => b.id === id)
  return budget?.name || ''
}

const handleMouseEnter = (event: MouseEvent, budget: any) => {
  hoveredSegment.value = budget
  
  // Positionner le tooltip près du curseur
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const containerRect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  
  tooltipPosition.value = {
    left: `${event.clientX - containerRect.left + 10}px`,
    top: `${event.clientY - containerRect.top - 40}px`
  }
}
</script> 