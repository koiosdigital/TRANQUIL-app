<template>
  <div class="space-y-4 pb-4" @scroll.passive="onScroll">
    <div class="w-full flex items-center justify-center">
      <PillSelect
        v-model="playlistsSource"
        :options="[
          { label: 'Local', value: 'local' },
          { label: 'Cloud', value: 'cloud' },
        ]"
        class="mx-auto"
      />
    </div>
    <div class="w-full flex items-center justify-center">
      <div class="relative w-full max-w-md mx-auto">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <HeroiconMagnifyingGlass />
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search playlists..."
          class="w-full rounded-md border border-zinc-700 bg-zinc-800 text-slate-200 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400"
        />
      </div>
    </div>

    <div
      class="grid gap-6"
      :class="
        cols === 5
          ? 'grid-cols-5'
          : cols === 4
          ? 'grid-cols-4'
          : cols === 3
          ? 'grid-cols-3'
          : 'grid-cols-2'
      "
      ref="scroller"
    >
      <PlaylistCard
        v-for="playlist in playlists"
        :key="playlist.uuid"
        :playlist="playlist"
        @click="
          () => {
            router.push(`/playlists/${playlist.uuid}?source=${playlistsSource}`)
          }
        "
        class="cursor-pointer"
      />
      <div v-if="loading" class="col-span-full flex justify-center py-8">
        <span class="text-slate-400">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useCloudAPIStore } from '@/stores/cloud-api'
import { localFileManager } from '@/stores/local-manifest'

import HeroiconMagnifyingGlass from '@/components/HeroiconMagnifyingGlass.vue'
import PlaylistCard from '@/components/PlaylistCard.vue'
import PillSelect from '@/components/PillSelect.vue'
import { useRouter } from 'vue-router'

const loading = ref(false)
const scroller = ref<HTMLElement | null>(null)
const cols = ref(getCols())

const router = useRouter()
const playlistsSource = ref<'local' | 'cloud'>('local')
const searchQuery = ref('')

const playlists = computed(() => {
  if (playlistsSource.value === 'local') {
    return localManifest.localPlaylists.filter((playlist) =>
      playlist.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  return cloudAPI.playlists
    .filter((playlist) => playlist.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .filter((playlist) => {
      return !localManifest.getPlaylistByUUID(playlist.uuid)
    })
})

const cloudAPI = useCloudAPIStore()
const localManifest = localFileManager()

function getCols() {
  if (window.innerWidth >= 1536) return 5
  if (window.innerWidth >= 1280) return 4
  if (window.innerWidth >= 1024) return 3
  return 2
}

function handleResize() {
  cols.value = getCols()
}

let loadingMorePlaylists = false
function onScroll(e: Event) {
  const el = e.target as HTMLElement
  if (
    el.scrollTop + el.clientHeight >= el.scrollHeight - 1000 &&
    playlistsSource.value === 'cloud' &&
    !loadingMorePlaylists
  ) {
    loadingMorePlaylists = true
    cloudAPI.getMorePatterns().finally(() => {
      loadingMorePlaylists = false
    })
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)

  if (cloudAPI.playlists.length === 0) {
    cloudAPI.getMorePlaylists()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
