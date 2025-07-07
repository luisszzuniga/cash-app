<template>
  <UBadge
    :color="config.color"
    :icon="config.icon"
    variant="soft"
    size="sm"
  >
    {{ config.label }}
  </UBadge>
</template>

<script setup lang="ts">
import { TransactionType, getTransactionTypeConfig } from '~/core/types/transaction'

interface Props {
  type: TransactionType
}

const props = defineProps<Props>()

const config = computed(() => getTransactionTypeConfig(props.type))
</script> 