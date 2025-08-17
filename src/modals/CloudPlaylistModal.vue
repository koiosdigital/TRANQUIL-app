<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">{{ playlist.name }}</h2>
    <div v-if="loading" class="text-center text-gray-400">Loading tracks...</div>
    <div v-else>
      <div v-if="tracks.length === 0" class="text-center text-gray-400">No tracks found.</div>
      <div class="flex flex-col gap-3">
        <div
          v-for="track in tracks"
          :key="track.uuid"
          class="flex items-center gap-4 bg-zinc-800 rounded p-3"
        >
          <PatternImage :pattern="track" class="w-[60%] rounded" />
          <div class="flex-1">
            <div class="text-white font-semibold">{{ track.name }}</div>
            <div class="text-xs text-zinc-400">{{ track.uuid }}</div>
          </div>
          <button
            v-if="!isDownloaded(track.uuid)"
            class="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Download
          </button>
          <span v-else class="text-green-400 text-xs">Downloaded</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import PatternImage from '@/components/PatternImage.vue'
import { useCloudAPIStore } from '@/stores/cloud-api'
import { localFileManager } from '@/stores/local-manifest'
import { Playlist } from '@/cloud-api-types'

const props = defineProps<{ playlist: Playlist }>()

const tracks = ref<any[]>([])
const loading = ref(false)
const cloudAPI = useCloudAPIStore()
const localManifest = localFileManager()

function isDownloaded(uuid: string) {
  return !!localManifest.getPatternByUUID(uuid)
}

async function loadTracks() {
  if (!props.playlist) return
  loading.value = true
  tracks.value = await cloudAPI.getPatternsByUUIDs(props.playlist.patterns)
  loading.value = false
}
</script>
