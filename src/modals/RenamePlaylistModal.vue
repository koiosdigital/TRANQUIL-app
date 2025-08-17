<template>
  <div class="flex flex-col gap-4 p-2">
    <BaseInput
      v-model="playlistName"
      type="text"
      placeholder="Rename playlist"
      class="w-full"
      id="playlist-rename-input"
    />
    <div class="flex gap-2 justify-end">
      <BaseButton variant="secondary" @click="$emit('close')">Cancel</BaseButton>
      <BaseButton variant="primary" :disabled="!playlistName.trim()" @click="onRename">
        Save
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps<{ initialName: string; patterns?: any[] }>()
const emit = defineEmits(['close', 'save'])
const playlistName = ref(props.initialName)
const patterns = ref(props.patterns || [])

watch(
  () => props.initialName,
  (val) => {
    playlistName.value = val
  }
)

function onRename() {
  if (!playlistName.value.trim()) return
  emit('save', playlistName.value.trim())
}
</script>
