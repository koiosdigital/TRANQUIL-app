<template>
  <div
    class="bg-zinc-900 p-4 rounded-2xl drop-shadow-2xl flex flex-col justify-between aspect-square items-center"
  >
    <div class="flex flex-col items-center">
      <div class="text-base font-semibold text-slate-100 text-center">{{ pattern.name }}</div>
      <div class="text-xs text-slate-500 text-center">by {{ pattern.creator }}</div>
    </div>
    <img
      v-if="token"
      :src="`${cloudAPI.apiBaseURL}/patterns/${pattern.uuid}/thumb.png?auth_token=${token}`"
      alt="Pattern thumbnail"
      class="w-50 aspect-square rounded-full object-cover border-2 border-zinc-700"
      loading="lazy"
    />
    <div class="flex justify-between items-center w-full">
      <span class="text-xs text-slate-500">{{ formattedDate }}</span>
      <span class="flex items-center gap-1 text-xs text-slate-500">
        <HandThumbUpIcon class="h-4 w-4 text-slate-500" />
        {{ Math.round(pattern.popularity) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useCloudAPIStore, type Pattern } from '@/stores/cloud-api'
import { HandThumbUpIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{ pattern: Pattern }>()

const cloudAPI = useCloudAPIStore()
const token = ref('')

onMounted(async () => {
  token.value = await cloudAPI.getToken()
})

function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (isNaN(seconds)) return ''
  if (seconds < 60) return `${seconds} seconds ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
  const years = Math.floor(months / 12)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

const formattedDate = computed(() => timeAgo(props.pattern.date))
</script>
