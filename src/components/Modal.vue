<template>
  <div
    class="fixed inset-0 bg-zinc-950/60 flex items-center justify-center z-50"
    @click="handleOverlayClick"
    v-if="visible"
  >
    <div
      class="bg-zinc-900 rounded-lg p-4 pt-12 max-w-5xl w-[90vw] min-h-[100px] relative drop-shadow-2xl"
      @click.stop
    >
      <div class="absolute top-0 left-0 w-full flex items-center justify-between px-8 pt-4 pb-2">
        <h2 v-if="title" class="text-lg font-semibold text-white">{{ title }}</h2>
        <button
          v-if="dismissable"
          class="text-3xl text-gray-400 hover:text-gray-600 focus:outline-none"
          @click="handleDismiss"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
interface ModalProps {
  dismissable?: boolean
  modelValue?: boolean // for v-model
  title?: string
}

const props = defineProps<ModalProps>()

const emit = defineEmits(['update:modelValue'])
const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
  }
)

function handleDismiss() {
  visible.value = false
  emit('update:modelValue', false)
}

function handleOverlayClick() {
  if (props.dismissable) {
    handleDismiss()
  }
}
</script>
