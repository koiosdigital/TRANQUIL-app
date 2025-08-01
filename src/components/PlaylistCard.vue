<template>
  <div
    class="bg-zinc-900 p-4 rounded-2xl drop-shadow-2xl flex flex-col justify-between aspect-square items-center"
  >
    <div class="flex flex-col items-center">
      <div class="text-base font-semibold text-slate-100 text-center">{{ playlist.name }}</div>
    </div>
    <PatternImage v-if="token" :pattern="featuredPattern" class="w-[60%]!" />
    <div class="text-xs text-slate-500 text-center">{{ playlist.description }}</div>
    <div class="flex justify-start items-center w-full">
      <span class="text-xs text-slate-500">{{ formattedDate }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useCloudAPIStore } from '@/stores/cloud-api'
import PatternImage from './PatternImage.vue'
import { Playlist } from '@/cloud-api-types'

const props = defineProps<{ playlist: Playlist }>()

const cloudAPI = useCloudAPIStore()
const token = ref('')

onMounted(async () => {
  token.value = await cloudAPI.getToken()
})

const featuredPattern = computed(() => {
  return {
    uuid: props.playlist.featured_pattern,
    name: '',
    creator: '',
    date: props.playlist.date,
    popularity: 0,
  }
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

const formattedDate = computed(() => timeAgo(props.playlist.date))
</script>
