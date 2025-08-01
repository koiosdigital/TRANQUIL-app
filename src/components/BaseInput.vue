<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-200 mb-1">{{
      label
    }}</label>
    <input
      :id="id"
      :type="type"
      :autocomplete="autocomplete"
      :required="required"
      :placeholder="placeholder"
      :class="['w-full rounded-md border px-4 py-2 focus:outline-none', inputClass]"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{
  modelValue?: string
  label?: string
  id: string
  type?: string
  autocomplete?: string
  required?: boolean
  placeholder?: string
  inputClass?: string
}>()

defineEmits(['update:modelValue'])
</script>
