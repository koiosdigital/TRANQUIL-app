<template>
  <div class="space-y-4 pb-4" @scroll.passive="onScroll">
    <div class="w-full flex items-center justify-center">
      <PillSelect
        v-model="patternSource"
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
          placeholder="Search patterns..."
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
      <PatternCard
        v-for="pattern in patterns"
        :key="pattern.uuid"
        :pattern="pattern"
        @click="
          () => {
            selectedPattern = pattern
            patternModalOpen = true
          }
        "
        class="cursor-pointer"
      />
      <div v-if="loading" class="col-span-full flex justify-center py-8">
        <span class="text-slate-400">Loading...</span>
      </div>
    </div>

    <Modal
      v-model="patternModalOpen"
      title="Download Pattern?"
      :dismissable="true"
      v-if="patternSource === 'cloud'"
    >
      <PatternDownloadConfirmationModal
        :pattern="selectedPattern!"
        @close="patternModalOpen = false"
      />
    </Modal>

    <Modal v-model="patternModalOpen" :title="selectedPattern?.name" :dismissable="true" v-else>
      <LocalPatternActionsModal :pattern="selectedPattern!" @close="patternModalOpen = false" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useCloudAPIStore } from '@/stores/cloud-api'
import { localFileManager } from '@/stores/local-manifest'

import PatternDownloadConfirmationModal from '@/modals/PatternDownloadConfirmationModal.vue'
import HeroiconMagnifyingGlass from '@/components/HeroiconMagnifyingGlass.vue'
import LocalPatternActionsModal from '@/modals/LocalPatternActionsModal.vue'
import PatternCard from '@/components/PatternCard.vue'
import PillSelect from '@/components/PillSelect.vue'
import Modal from '@/components/Modal.vue'
import { Pattern } from '@/cloud-api-types'

const loading = ref(false)
const scroller = ref<HTMLElement | null>(null)
const cols = ref(getCols())

const patternSource = ref<'local' | 'cloud'>('local')
const searchQuery = ref('')

const patterns = computed(() => {
  if (patternSource.value === 'local') {
    return localManifest.localPatterns.filter((pattern) =>
      pattern.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  return cloudAPI.patterns
    .filter((pattern) => pattern.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .filter((pattern) => {
      return localManifest.getPatternByUUID(pattern.uuid) === null
    })
})

const selectedPattern = ref<Pattern | null>(null)
const patternModalOpen = ref(false)

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

let loadingMorePatterns = false
function onScroll(e: Event) {
  const el = e.target as HTMLElement
  if (
    el.scrollTop + el.clientHeight >= el.scrollHeight - 1000 &&
    patternSource.value === 'cloud' &&
    !loadingMorePatterns
  ) {
    loadingMorePatterns = true
    cloudAPI.getMorePatterns().finally(() => {
      loadingMorePatterns = false
    })
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)

  if (cloudAPI.patterns.length === 0) {
    cloudAPI.getMorePatterns()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
