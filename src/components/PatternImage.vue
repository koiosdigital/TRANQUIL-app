<template>
  <div
    class="w-full aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden rounded-full border-zinc-700 border"
  >
    <img
      v-if="pattern && token"
      :src="`${cloudAPI.apiBaseURL}/patterns/${pattern.uuid}/thumb.png?auth_token=${token}`"
      :alt="pattern.name"
      class="object-cover w-full h-full"
    />
    <div v-else class="text-slate-400">No Image</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import { useCloudAPIStore } from '@/stores/cloud-api'
import { Pattern } from '@/cloud-api-types'

defineProps<{ pattern: Pattern }>()
const cloudAPI = useCloudAPIStore()

const token = ref('')

onMounted(async () => {
  token.value = await cloudAPI.getToken()
})
</script>
