<template>
  <div
    :class="[
      'mb-4 flex items-center gap-2 px-4 py-3 rounded relative text-center font-medium',
      alertType.bg,
      alertType.border,
      alertType.text,
    ]"
    role="alert"
  >
    <span v-html="alertType.icon" class="w-5 h-5 shrink-0"></span>
    <span class="flex-1"><slot /></span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

type AlertType = 'error' | 'success' | 'info' | 'warning'

const props = defineProps<{
  type?: AlertType
}>()

const alertType = computed(() => {
  switch (props.type) {
    case 'error':
      return {
        bg: 'bg-red-900/80',
        border: 'border border-red-700',
        text: 'text-red-200',
        icon: `<svg fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z'/></svg>`,
      }
    case 'success':
      return {
        bg: 'bg-green-900/80',
        border: 'border border-green-700',
        text: 'text-green-200',
        icon: `<svg fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M4.5 12.75l6 6 9-13.5'/></svg>`,
      }
    case 'warning':
      return {
        bg: 'bg-yellow-900/80',
        border: 'border border-yellow-700',
        text: 'text-yellow-200',
        icon: `<svg fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 9v2m0 4h.01M12 5.5a7 7 0 1 1 0 13.999A7 7 0 0 1 12 5.5Z'/></svg>`,
      }
    default:
      return {
        bg: 'bg-blue-900/80',
        border: 'border border-blue-700',
        text: 'text-blue-200',
        icon: `<svg fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M13 16h-1v-4h-1m1-4h.01'/></svg>`,
      }
  }
})
</script>
