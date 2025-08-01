<template>
  <div class="w-full flex flex-col">
    <div class="relative w-full flex items-center">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="onInput"
        :id="id"
        class="base-slider w-full h-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-200"
        :style="{
          background: `linear-gradient(to right, #e4e4e7 0%, #e4e4e7 ${percent}%, #3f3f46 ${percent}%, #3f3f46 100%)`,
        }"
      />
    </div>
    <div class="text-xs text-right mt-1 text-slate-400">{{ modelValue }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  modelValue: number
  min: number
  max: number
  step?: number
  id?: string
}>()
const emit = defineEmits(['update:modelValue'])

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', +target.value)
}

const percent = computed(() => {
  const min = props.min
  const max = props.max
  const value = props.modelValue
  return ((value - min) / (max - min)) * 100
})
</script>

<style scoped>
.base-slider {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: transparent;
  height: 0.5rem;
  border-radius: 9999px;
}
.base-slider::-webkit-slider-thumb {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background: #e4e4e7; /* zinc-200 */
  border: 2px solid #e4e4e7; /* zinc-200 */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  transition: background 0.2s;
  margin-top: -0.375rem;
}
.base-slider::-webkit-slider-thumb:hover {
  background: #f4f4f5; /* zinc-100 */
}
.base-slider:focus::-webkit-slider-thumb {
  outline: 2px solid #e4e4e7; /* zinc-200 */
}
input[type='range'].base-slider::-moz-range-thumb {
  background: #e4e4e7;
  border: 2px solid #e4e4e7;
}
input[type='range'].base-slider::-moz-range-track {
  height: 0.5rem;
  border-radius: 9999px;
  background: transparent;
}
input[type='range'].base-slider::-ms-thumb {
  background: #e4e4e7;
  border: 2px solid #e4e4e7;
}
</style>
