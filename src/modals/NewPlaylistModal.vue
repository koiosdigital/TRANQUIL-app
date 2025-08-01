<template>
  <div class="flex flex-col gap-4 p-2">
    <BaseInput
      v-model="playlistName"
      type="text"
      placeholder="New playlist name"
      class="w-full"
      id="playlist-name-input"
    />
    <div class="flex gap-2 justify-end">
      <BaseButton variant="secondary" @click="$emit('close')">Cancel</BaseButton>
      <BaseButton variant="primary" :disabled="!playlistName.trim()" @click="onAdd">
        Create Playlist
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { localFileManager } from '@/stores/local-manifest'
import { useLoaderStore } from '@/stores/loader'
import { usePlaylistsStore } from '@/stores/playlists'
import { Pattern } from '@/cloud-api-types'
import { useRouter } from 'vue-router'
import { v4 } from 'uuid'

const props = defineProps<{ initialPattern: Pattern }>()

const emit = defineEmits(['close'])
const playlistName = ref('')
const localManifest = localFileManager()
const playlistsStore = usePlaylistsStore()
const loader = useLoaderStore()
const router = useRouter()

const onAdd = async () => {
  if (!playlistName.value.trim()) {
    return
  }

  const newUUID = v4()

  loader.showLoader('playlist', 'Creating new playlist...')
  await playlistsStore.createPlaylist({
    uuid: newUUID,
    name: playlistName.value,
    patterns: [props.initialPattern.uuid],
    description: 'Created by you',
    featured_pattern: props.initialPattern.uuid,
    date: new Date().toISOString(),
  })
  await localManifest.reload()
  loader.hideLoader('playlist')
  router.push(`/playlists/${newUUID}?source=local`)
  emit('close')
}
</script>
