<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="flex items-center gap-4 mb-6">
      <button @click="router.back()" class="text-zinc-400 hover:text-white">← Back</button>
      <h1 class="text-2xl font-bold text-white flex-1">{{ playlist?.name || 'Playlist' }}</h1>
      <button
        v-if="!editing"
        @click="editing = true"
        class="px-3 py-1 rounded bg-indigo-600 text-white font-semibold"
      >
        Edit
      </button>
      <button
        v-else
        @click="saveOrder"
        class="px-3 py-1 rounded bg-green-600 text-white font-semibold"
      >
        Save
      </button>
    </div>
    <div v-if="loading" class="text-center text-gray-400">Loading playlist...</div>
    <div v-else-if="playlist">
      <draggable
        v-model="patterns"
        :disabled="!editing"
        item-key="uuid"
        class="flex flex-col gap-2"
      >
        <template #item="{ element, index }">
          <div class="flex items-center gap-2 bg-zinc-800 rounded p-3">
            <span class="flex-1 text-white">{{ getPatternName(element) }}</span>
            <button
              v-if="editing"
              @click="removePattern(element)"
              class="text-red-400 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        </template>
      </draggable>
      <div v-if="!editing" class="mt-6 text-zinc-400 text-sm">
        Drag to reorder or remove patterns when editing.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlaylistsStore } from '@/stores/playlists'
import { localFileManager } from '@/stores/local-manifest'
import draggable from 'vuedraggable'

const route = useRoute()
const router = useRouter()
const playlistsStore = usePlaylistsStore()
const localManifest = localFileManager()

const uuid = route.params.uuid as string
const loading = ref(true)
const editing = ref(false)
const playlist = ref<any>(null)
const patterns = ref<string[]>([])

function getPatternName(uuid: string) {
  const pattern = localManifest.getPatternByUUID(uuid)
  return pattern ? pattern.name : uuid
}

async function loadPlaylist() {
  loading.value = true
  await playlistsStore.fetchPlaylist(uuid)
  playlist.value = playlistsStore.current
  patterns.value = playlist.value ? [...playlist.value.patterns] : []
  loading.value = false
}

function removePattern(patternUuid: string) {
  patterns.value = patterns.value.filter((p) => p !== patternUuid)
}

async function saveOrder() {
  if (!playlist.value) return
  editing.value = false
  await playlistsStore.reorderPlaylist(playlist.value.uuid, patterns.value)
  await loadPlaylist()
}

onMounted(loadPlaylist)
watch(() => route.params.uuid, loadPlaylist)
</script>
