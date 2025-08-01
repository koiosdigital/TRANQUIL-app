<template>
  <div class="text-center space-y-4">
    <div class="w-60 aspect-square rounded-full mx-auto">
      <PatternImage v-if="pattern" :pattern="pattern" />
    </div>
    <div>
      Do you want to start playback of <span class="font-semibold">{{ pattern?.name }}</span
      >? The current pattern will be stopped.
    </div>
    <div class="flex flex-row gap-2 justify-center mt-6">
      <BaseButton @click="onCancel" :disabled="loading" type="button" variant="secondary">
        Cancel
      </BaseButton>
      <BaseButton @click="onContinue" :disabled="loading">Continue</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pattern } from '@/cloud-api-types'
import BaseButton from '@/components/BaseButton.vue'
import PatternImage from '@/components/PatternImage.vue'
import { usePlayerStore } from '@/stores/player'
import { ref } from 'vue'

const props = defineProps<{ pattern: Pattern }>()
const emit = defineEmits(['close'])

const loading = ref(false)

const player = usePlayerStore()

async function onContinue() {
  loading.value = true
  await player.stop()
  await player.play(props.pattern.uuid)
  loading.value = false
  emit('close')
}

function onCancel() {
  emit('close')
}
</script>
