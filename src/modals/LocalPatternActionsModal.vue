<template>
  <div class="bg-zinc-900 p-4 rounded-2xl flex flex-col justify-between items-center gap-4">
    <div class="flex flex-col items-center">
      <div class="text-xs text-slate-500 text-center">by {{ pattern.creator }}</div>
    </div>
    <img
      v-if="token"
      :src="`${cloudAPI.apiBaseURL}/patterns/${pattern.uuid}/thumb.png?auth_token=${token}`"
      alt="Pattern thumbnail"
      class="w-60 aspect-square rounded-full object-cover border-2 border-zinc-700 bg-zinc-950"
      loading="lazy"
    />
    <div class="flex justify-between items-center w-full">
      <span class="text-xs text-slate-500">{{ formattedDate }}</span>
      <span class="flex items-center gap-1 text-xs text-slate-500">
        <HandThumbUpIcon class="h-4 w-4 text-slate-500" />
        {{ Math.round(pattern.popularity) }}
      </span>
    </div>
    <div class="flex flex-row gap-4 mt-6 w-full justify-center">
      <IconButton color="primary" title="Play" @click="playPattern">
        <PlayIcon class="h-6 w-6" />
      </IconButton>
      <IconButton
        color="secondary"
        title="Delete"
        @click="deletePattern"
        v-if="player.state.pattern_uuid !== pattern.uuid"
      >
        <TrashIcon class="h-6 w-6" />
      </IconButton>
      <IconButton color="primary" title="Cancel" @click="addToPlaylist">
        <PlusIcon class="h-6 w-6" />
      </IconButton>
    </div>

    <Modal v-model="showAddToPlaylist" title="Add to Playlist" dismissable>
      <PlaylistAddPatternModal :pattern="pattern" @close="showAddToPlaylist = false" />
    </Modal>

    <Modal v-model="showOverplayConfirmation" title="Overplay Confirmation" dismissable>
      <PatternOverplayConfirmationModal
        :pattern="pattern"
        @close="showOverplayConfirmation = false"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCloudAPIStore } from '@/stores/cloud-api'
import { HandThumbUpIcon, PlayIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import IconButton from '@/components/IconButton.vue'
import Modal from '@/components/Modal.vue'
import PlaylistAddPatternModal from '@/modals/PlaylistAddPatternModal.vue'
import { Pattern } from '@/cloud-api-types'
import { PlayerStatus, usePlayerStore } from '@/stores/player'
import { useLoaderStore } from '@/stores/loader'
import { localFileManager } from '@/stores/local-manifest'
import PatternOverplayConfirmationModal from './PatternOverplayConfirmationModal.vue'

const props = defineProps<{ pattern: Pattern }>()
const emit = defineEmits(['close'])

const cloudAPI = useCloudAPIStore()
const token = ref('')
const showAddToPlaylist = ref(false)
const showOverplayConfirmation = ref(false)

const player = usePlayerStore()
const loader = useLoaderStore()
const localManifest = localFileManager()

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

const playPattern = async () => {
  if (
    player.state.playback_state === PlayerStatus.Playing ||
    player.state.playback_state === PlayerStatus.Paused
  ) {
    showOverplayConfirmation.value = true
    return
  }
  await player.play(props.pattern.uuid)
  emit('close')
}

const deletePattern = async () => {
  loader.showLoader('delete', 'Deleting pattern...')
  await localManifest.deletePattern(props.pattern.uuid)
  loader.hideLoader('delete')
  emit('close')
}

const addToPlaylist = () => {
  showAddToPlaylist.value = true
}
</script>
