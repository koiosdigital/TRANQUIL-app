<template>
  <select
    :value="modelValue"
    @change="onChange"
    :id="id"
    class="w-full rounded-md border border-zinc-700 bg-zinc-800 text-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string | number; id?: string }>()
const emit = defineEmits(['update:modelValue'])

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>
