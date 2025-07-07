<template>
  <div class="space-y-4">
    <!-- Tableau des transactions -->
    <UCard>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left p-3 font-medium">Libellé</th>
              <th v-if="!hideAccountColumn" class="text-left p-3 font-medium">Compte</th>
              <th class="text-left p-3 font-medium">Montant</th>
              <th class="text-left p-3 font-medium">Type</th>
              <th class="text-left p-3 font-medium">Catégorie</th>
              <th class="text-left p-3 font-medium">Date</th>
              <th class="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading" class="border-b">
              <td colspan="7" class="text-center p-4 text-gray-500">
                Chargement...
              </td>
            </tr>
            <tr v-else-if="transactions.length === 0" class="border-b">
              <td colspan="7" class="text-center p-4 text-gray-500">
                Aucune transaction trouvée
              </td>
            </tr>
            <tr 
              v-for="transaction in transactions" 
              :key="transaction.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="p-3">
                <span class="font-medium">{{ transaction.label || 'Sans libellé' }}</span>
              </td>
              <td v-if="!hideAccountColumn" class="p-3">
                <span class="text-sm text-gray-600">{{ transaction.account?.name || '-' }}</span>
              </td>
              <td class="p-3">
                <span 
                  class="font-semibold"
                  :class="transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ formatCurrency(transaction.amount) }}
                </span>
              </td>
              <td class="p-3">
                <TransactionTypeBadge :type="transaction.type" />
              </td>
              <td class="p-3">
                <UBadge
                  v-if="transaction.budget?.name"
                  color="neutral"
                  variant="soft"
                  size="sm"
                >
                  {{ transaction.budget.name }}
                </UBadge>
                <span v-else class="text-gray-400">–</span>
              </td>
              <td class="p-3">
                <span class="text-sm text-gray-600">
                  {{ formatDate(transaction.date) }}
                </span>
              </td>
              <td class="p-3">
                <UButton
                  color="error"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  size="xs"
                  @click="confirmDelete(transaction)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-4 py-3 border-t">
        <div class="text-sm text-gray-500">
          {{ paginationInfo }}
        </div>
        <UPagination
          v-model="currentPage"
          :page-count="totalPages"
          :total="totalTransactions"
        />
      </div>
    </UCard>

    <!-- Modale de confirmation de suppression -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Confirmer la suppression</h3>
          </template>

          <p class="text-gray-600">
            Êtes-vous sûr de vouloir supprimer la transaction 
            <strong>"{{ transactionToDelete?.label }}"</strong> 
            du {{ formatDate(transactionToDelete?.date) }} ?
          </p>
          <p class="text-sm text-gray-500 mt-2">
            Cette action est irréversible.
          </p>

          <template #footer>
            <div class="flex gap-3">
              <UButton
                variant="outline"
                @click="showDeleteModal = false"
              >
                Annuler
              </UButton>
              <UButton
                color="error"
                :loading="isDeleting"
                @click="deleteTransaction"
              >
                Supprimer
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { TransactionType } from '~/core/types/transaction'
import TransactionTypeBadge from '~/components/ui/TransactionTypeBadge.vue'

// Types
interface Transaction {
  id: string
  label: string
  amount: number
  type: TransactionType
  date: string
  account?: {
    id: string
    name: string
  }
  budget?: {
    id: string
    name: string
  }
}

interface Props {
  // Pour masquer la colonne compte (quand on est dans une page compte)
  hideAccountColumn?: boolean
  // Pour filtrer par compte spécifique
  accountId?: string
}

const props = withDefaults(defineProps<Props>(), {
  hideAccountColumn: false
})

// État réactif
const currentPage = ref(1)
const isLoading = ref(false)
const isDeleting = ref(false)
const showDeleteModal = ref(false)
const transactionToDelete = ref<Transaction | null>(null)

// Données
const transactions = ref<Transaction[]>([])
const totalTransactions = ref(0)
const totalPages = computed(() => Math.ceil(totalTransactions.value / 15))

// Informations de pagination
const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * 15 + 1
  const end = Math.min(currentPage.value * 15, totalTransactions.value)
  return `${start}-${end} sur ${totalTransactions.value} transactions`
})

// Fonctions
const loadTransactions = async () => {
  isLoading.value = true
  
  try {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: '15',
      sortBy: 'date',
      sortOrder: 'desc'
    })

    // Ajouter le filtre par compte si spécifié
    if (props.accountId && props.accountId.trim() !== '') {
      params.append('accountId', props.accountId)
    }

    console.log('🔍 Paramètres envoyés à l\'API:', Object.fromEntries(params))

    const response = await $fetch<{
      transactions: Transaction[]
      total: number
    }>(`/api/transactions?${params}`)

    console.log('📊 Réponse de l\'API:', response)

    transactions.value = response.transactions
    totalTransactions.value = response.total
  } catch (error) {
    console.error('❌ Erreur lors du chargement des transactions:', error)
    const toast = useToast()
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger les transactions',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const refreshData = () => {
  currentPage.value = 1
  loadTransactions()
}

const confirmDelete = (transaction: Transaction) => {
  transactionToDelete.value = transaction
  showDeleteModal.value = true
}

const deleteTransaction = async () => {
  if (!transactionToDelete.value) return

  isDeleting.value = true
  
  try {
    await $fetch(`/api/transactions/${transactionToDelete.value.id}`, {
      method: 'DELETE'
    })

    const toast = useToast()
    toast.add({
      title: 'Transaction supprimée',
      description: 'La transaction a été supprimée avec succès',
      color: 'success'
    })

    showDeleteModal.value = false
    transactionToDelete.value = null
    
    // Recharger les données
    await loadTransactions()
    
    // Émettre l'événement pour recharger les soldes
    const { emit } = useEvents()
    emit('reload-transactions')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    const toast = useToast()
    toast.add({
      title: 'Erreur',
      description: 'Impossible de supprimer la transaction',
      color: 'error'
    })
  } finally {
    isDeleting.value = false
  }
}

// Utilitaires
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(Math.abs(amount))
}

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

// Watchers
watch(currentPage, () => {
  loadTransactions()
})

// Charger les données initiales
onMounted(() => {
  loadTransactions()
})
</script> 