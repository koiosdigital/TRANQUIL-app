<template>
  <div class="p-4">
    <div v-if="playlists.length === 0" class="text-zinc-400 mb-4">No local playlists found.</div>
    <div v-else class="max-h-64 overflow-y-auto flex flex-col gap-2 mb-4">
      <div
        v-for="playlist in playlists"
        :key="playlist.uuid"
        class="flex items-center justify-between bg-zinc-800 rounded p-2 gap-2"
      >
        <div class="w-20 aspect-square rounded-full">
          <PatternImage :pattern="getFeaturedPattern(playlist)!" />
        </div>
        <div class="flex flex-col items-start justify-center">
          <div class="truncate font-medium text-zinc-100">{{ playlist.name }}</div>
          <div class="text-xs text-zinc-400">
            {{ playlist.patterns.length }} pattern{{ playlist.patterns.length === 1 ? '' : 's' }}
          </div>
        </div>
        <div class="flex grow items-center justify-end">
          <div class="w-24">
            <BaseButton size="sm" @click="onAdd(playlist.uuid)">
              <PlusIcon class="w-4 h-4 mr-1" />
              Add
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
    <BaseButton class="w-full mb-4" @click="showCreateNewPlaylistModal = true" primary>
      <template #icon><AddIcon class="w-5 h-5 mr-1" /></template>
      Create New Playlist
    </BaseButton>
    <div class="flex justify-end">
      <BaseButton @click="onCancel" variant="secondary">Cancel</BaseButton>
    </div>

    <Modal v-model="showCreateNewPlaylistModal" dismissable title="Create New Playlist">
      <NewPlaylistModal :initial-pattern="pattern" @close="showCreateNewPlaylistModal = false" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue'
import { localFileManager } from '@/stores/local-manifest'
import { Pattern, Playlist } from '@/cloud-api-types'
import PatternImage from '@/components/PatternImage.vue'
import BaseButton from '@/components/BaseButton.vue'
import NewPlaylistModal from './NewPlaylistModal.vue'
import Modal from '@/components/Modal.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useLoaderStore } from '@/stores/loader'
import { usePlaylistsStore } from '@/stores/playlists'

const props = defineProps<{ pattern: Pattern }>()
const emit = defineEmits(['close'])

const playlists = ref<Playlist[]>([])
const loader = useLoaderStore()
const localManifest = localFileManager()
const playlistStore = usePlaylistsStore()
const showCreateNewPlaylistModal = ref(false)

const getFeaturedPattern = (playlist: Playlist) => {
  return playlist.featured_pattern
    ? localFileManager().getPatternByUUID(playlist.featured_pattern)
    : null
}

onMounted(() => {
  const localManifest = localFileManager()
  playlists.value = localManifest.localPlaylists
})

const onAdd = async (uuid: string) => {
  loader.showLoader('playlist', 'Adding pattern to playlist...')
  await playlistStore.modifyPlaylist(uuid, props.pattern.uuid, 'add')
  await localManifest.reload()
  loader.hideLoader('playlist')
  emit('close')
}

function onCancel() {
  emit('close')
}
</script>
