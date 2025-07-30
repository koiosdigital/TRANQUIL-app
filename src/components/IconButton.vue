<template>
  <button
    :class="[
      'rounded-full p-2 flex items-center justify-center transition-colors w-12 h-12',
      color === 'secondary'
        ? 'bg-zinc-800 text-slate-200 hover:bg-zinc-700'
        : 'bg-slate-200 text-zinc-900 hover:bg-slate-300',
      'focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-zinc-900',
    ]"
    @click="$emit('click')"
    :title="title"
    type="button"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ color?: 'primary' | 'secondary'; title?: string }>()
</script>
