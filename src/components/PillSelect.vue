<template>
  <div class="inline-flex rounded-full border border-slate-600 bg-zinc-900 overflow-hidden">
    <button
      v-for="(option, idx) in options"
      :key="option.value"
      :class="[
        'px-4 py-1 transition-colors whitespace-nowrap rounded-full font-medium focus:outline-none',
        option.value === modelValue
          ? 'bg-slate-200 text-zinc-900 z-10 shadow'
          : 'bg-transparent text-slate-200 hover:bg-zinc-800',
        option.value !== modelValue && idx === 0 ? 'rounded-l-full' : '',
        option.value !== modelValue && idx === options.length - 1 ? 'rounded-r-full' : '',
        option.value !== modelValue && idx !== 0 && idx !== options.length - 1
          ? 'rounded-none'
          : '',
      ]"
      @click="$emit('update:modelValue', option.value)"
      type="button"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  options: {
    type: Array as () => Array<{ label: string; value: string | number }>,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    required: true,
  },
})

defineEmits(['update:modelValue'])
</script>
