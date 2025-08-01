<template>
  <button
    :type="type"
    :class="[
      'w-full flex items-center justify-center gap-2 font-semibold py-2 rounded-md transition-colors disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-zinc-900',
      variant === 'secondary'
        ? 'bg-zinc-800 text-slate-200 hover:bg-zinc-700'
        : 'bg-slate-200 text-zinc-900 hover:bg-slate-300',
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
type ButtonType = 'button' | 'submit' | 'reset'

defineProps<{
  type?: ButtonType
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}>()
</script>
