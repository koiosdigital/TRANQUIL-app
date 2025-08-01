<template>
  <div class="text-center space-y-4">
    <div class="w-60 aspect-square rounded-full mx-auto">
      <PatternImage v-if="pattern" :pattern="pattern" />
    </div>
    <div>
      Do you want to delete <span class="font-semibold">{{ pattern?.name }}</span> from your device?
    </div>
    <div class="flex flex-row gap-2 justify-center mt-6">
      <BaseButton @click="onCancel" :disabled="deleting" type="button" variant="secondary">
        Cancel
      </BaseButton>
      <BaseButton @click="onDelete" :disabled="deleting">Delete</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pattern } from '@/cloud-api-types'
import BaseButton from '@/components/BaseButton.vue'
import PatternImage from '@/components/PatternImage.vue'
import { localFileManager } from '@/stores/local-manifest'
import { ref } from 'vue'

const props = defineProps<{ pattern: Pattern }>()
const emit = defineEmits(['close'])

const deleting = ref(false)
const localFS = localFileManager()

async function onDelete() {
  deleting.value = true
  await localFS.deletePattern(props.pattern.uuid)
  deleting.value = false
  emit('close')
}

function onCancel() {
  emit('close')
}
</script>
