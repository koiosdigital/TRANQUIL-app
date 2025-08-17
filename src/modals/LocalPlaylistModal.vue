<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg grow">{{ playlist.name }}</h2>
      <div class="flex items-center gap-2">
        <BaseButton variant="secondary" @click="showRename = true" class="px-2">
          <PencilSquareIcon class="w-5 h-5" />
        </BaseButton>
        <BaseButton variant="secondary" @click="onDelete" class="px-2">
          <TrashIcon class="w-5 h-5" />
        </BaseButton>
        <BaseButton variant="primary" @click="onPlay" class="px-2">
          <PlayIcon class="w-5 h-5" />
        </BaseButton>
      </div>
    </div>
    <div>
      <div v-if="playlistTracks.length === 0" class="text-center text-gray-400">
        No tracks found.
      </div>
      <div class="flex flex-col gap-3">
        <div
          v-for="track of playlistTracks"
          :key="track.uuid"
          class="flex items-center gap-4 bg-zinc-800 rounded p-3"
        >
          <div class="w-20 aspect-square">
            <PatternImage :pattern="track" class="w-30 rounded" />
          </div>

          <div class="flex-1">
            <div class="text-white font-semibold">{{ track.name }}</div>
            <div class="text-xs text-zinc-400">{{ track.uuid }}</div>
          </div>
          <div class="flex gap-2">
            <BaseButton variant="secondary" @click="onTrackPlay(track)" class="px-2">
              <PlayIcon class="w-5 h-5" />
            </BaseButton>
            <BaseButton variant="secondary" @click="onRemoveTrack(track)" class="px-2">
              <TrashIcon class="w-5 h-5" />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <Modal title="Rename Playlist" v-model="showRename">
      <RenamePlaylistModal
        :initialName="playlist.name"
        :patterns="tracks"
        @close="showRename = false"
        @save="onRenameSave"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PatternImage from '@/components/PatternImage.vue'
import { useCloudAPIStore } from '@/stores/cloud-api'
import { localFileManager } from '@/stores/local-manifest'
import { Playlist } from '@/cloud-api-types'
import BaseButton from '@/components/BaseButton.vue'
import RenamePlaylistModal from './RenamePlaylistModal.vue'
import Modal from '@/components/Modal.vue'
import { PencilSquareIcon, TrashIcon, PlayIcon } from '@heroicons/vue/24/outline'
import { useLoaderStore } from '@/stores/loader'
import { usePlaylistsStore } from '@/stores/playlists'

const props = defineProps<{ playlist: Playlist }>()

const tracks = ref<any[]>([])
const loader = useLoaderStore()
const cloudAPI = useCloudAPIStore()
const localManifest = localFileManager()
const playlistsStore = usePlaylistsStore()
const showRename = ref(false)

const playlistTracks = computed(() => {
  return props.playlist.patterns
    .map((uuid) => localManifest.getPatternByUUID(uuid))
    .filter((val) => val !== null)
})

async function onDelete() {
  loader.showLoader('delete', 'Deleting playlist...')
  await playlistsStore.deletePlaylist(props.playlist.uuid)
  await localManifest.reload()
  loader.hideLoader('delete')
}

function onPlay() {}

function onRenameSave(newName: string) {
  // TODO: Implement rename logic, emit event or call store
  showRename.value = false
}

function onTrackPlay(track: any) {
  // TODO: Implement play single track logic
}

function onRemoveTrack(track: any) {
  // TODO: Implement remove track from playlist logic
}
</script>
