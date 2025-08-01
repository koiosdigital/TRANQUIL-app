<template>
  <Modal v-model="show">
    <div class="p-6">
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
              @click="download(track.uuid)"
            >
              Download
            </button>
            <span v-else class="text-green-400 text-xs">Downloaded</span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps } from 'vue'
import Modal from '@/components/Modal.vue'
import PatternImage from '@/components/PatternImage.vue'
import { useCloudAPIStore } from '@/stores/cloud-api'
import { localFileManager } from '@/stores/local-manifest'

const props = defineProps<{ show: boolean; playlist: any }>()
const show = ref(props.show)
const tracks = ref<any[]>([])
const loading = ref(false)
const cloudAPI = useCloudAPIStore()
const localManifest = localFileManager()

watch(
  () => props.show,
  (val) => (show.value = val)
)
watch(() => props.playlist, loadTracks, { immediate: true })

function isDownloaded(uuid: string) {
  return !!localManifest.getPatternByUUID(uuid)
}

async function loadTracks() {
  if (!props.playlist) return
  loading.value = true
  tracks.value = await cloudAPI.getPatternsByUUIDs(props.playlist.patterns)
  loading.value = false
}

async function download(uuid: string) {
  await cloudAPI.downloadPattern(uuid)
  // Optionally reload tracks to update download status
  loadTracks()
}
</script>
