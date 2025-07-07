<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="text-sm text-gray-500">
            {{ subtitle }}
          </p>
        </div>
      </div>
    </template>

    <div class="text-center">
      <div class="text-3xl font-bold text-gray-900">
        {{ formatCurrency(value) }}
      </div>
      <p v-if="description" class="text-sm text-gray-500 mt-1">
        {{ description }}
      </p>
    </div>

    <template #footer v-if="showFooter">
      <div class="flex items-center justify-between text-sm text-gray-500">
        <span>Dernière mise à jour</span>
        <span>{{ lastUpdate }}</span>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { Life } from '~/core/types/life'
import { AccountType } from '~/core/types/account'
import { KPIView, type KPIResponse } from '~/core/types/kpi'

interface Props {
  view: KPIView
  title: string
  subtitle?: string
  description?: string
  showFooter?: boolean
  // Filtres selon la vue
  life?: Life
  accountType?: AccountType
  accountId?: string
}

const props = withDefaults(defineProps<Props>(), {
  showFooter: true
})

// État réactif
const value = ref(0)
const trend = ref(0)
const lastUpdate = ref('')
const isLoading = ref(false)

// Formater la monnaie
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount)
}

// Construire les paramètres de l'API selon la vue
const buildApiParams = () => {
  const params: Record<string, any> = {}
  
  switch (props.view) {
    case KPIView.GLOBAL:
      // Pas de filtres pour la vue globale
      break
    case KPIView.LIFE_AND_TYPE:
      if (props.life) params.life = props.life
      if (props.accountType) params.type = props.accountType
      break
    case KPIView.TYPE_ONLY:
      if (props.accountType) params.type = props.accountType
      break
    case KPIView.INDIVIDUAL_ACCOUNT:
      if (props.accountId) params.accountId = props.accountId
      break
  }
  
  return params
}



// Charger les données KPI
const loadKPIData = async () => {
  isLoading.value = true
  
  try {
    const params = buildApiParams()
    const response = await $fetch<KPIResponse>('/api/kpi/balance', { params })
    
    value.value = response.value || 0
    lastUpdate.value = new Date().toLocaleString('fr-FR')
  } catch (error) {
    console.error('Erreur lors du chargement du KPI:', error)
    value.value = 0
  } finally {
    isLoading.value = false
  }
}

// Écouter l'événement de rechargement
const { on } = useEvents()
on('reload-transactions', () => {
  loadKPIData()
})

// Charger les données au montage
onMounted(() => {
  loadKPIData()
})

// Surveiller les changements de props pour recharger
watch([() => props.life, () => props.accountType, () => props.accountId], () => {
  loadKPIData()
})
</script> 