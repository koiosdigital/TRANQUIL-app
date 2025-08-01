<template>
  <label class="inline-flex items-center cursor-pointer select-none">
    <input type="checkbox" class="sr-only" :checked="modelValue" @change="onChange" :id="id" />
    <span
      class="w-10 h-6 flex items-center bg-zinc-700 rounded-full p-1 duration-300 ease-in-out"
      :class="modelValue ? 'bg-sky-400' : 'bg-zinc-700'"
    >
      <span
        class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"
        :class="modelValue ? 'translate-x-4' : ''"
      ></span>
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; id?: string }>()
const emit = defineEmits(['update:modelValue'])

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
