<template>
  <div class="text-center space-y-4">
    <div>
      Do you want to download <span class="font-semibold">{{ pattern?.name }}</span> to your device?
    </div>
    <div class="flex flex-col gap-2 justify-center mt-6">
      <BaseButton @click="onDownload" :disabled="downloading">Download</BaseButton>
      <BaseButton @click="onCancel" :disabled="downloading" type="button" variant="secondary"
        >Cancel</BaseButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import type { Pattern } from '@/stores/cloud-api'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ pattern: Pattern | null; downloading: boolean }>()
const emit = defineEmits(['download', 'cancel'])

function onDownload() {
  emit('download')
}
function onCancel() {
  emit('cancel')
}
</script>
