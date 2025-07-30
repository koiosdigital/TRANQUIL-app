<template>
  <div class="space-y-4" @scroll.passive="onScroll">
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
      :class="cols === 4 ? 'grid-cols-4' : cols === 3 ? 'grid-cols-3' : 'grid-cols-2'"
      ref="scroller"
    >
      <PatternCard
        v-for="pattern in filteredPatterns"
        :key="pattern.uuid"
        :pattern="pattern"
        @click="onPatternClick(pattern)"
        class="cursor-pointer"
      />
      <div v-if="loading" class="col-span-full flex justify-center py-8">
        <span class="text-slate-400">Loading...</span>
      </div>
    </div>

    <Modal v-model="showDownloadModal" title="Download Pattern?" :dismissable="true">
      <PatternDownloadConfirmationModal
        :pattern="selectedPattern"
        :downloading="downloading"
        @download="downloadPattern"
        @cancel="closeDownloadModal"
      />
    </Modal>

    <Modal v-model="showLocalPatternModal" :title="selectedLocalPattern?.name" :dismissable="true">
      <LocalPatternActionsModal
        :pattern="selectedLocalPattern!"
        @play="playLocalPattern"
        @delete="deleteLocalPattern"
        @cancel="closeLocalPatternModal"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useCloudAPIStore, type Pattern } from '@/stores/cloud-api'
import { localFileManager } from '@/stores/local-manifest'
import PatternCard from '@/components/PatternCard.vue'
import PillSelect from '@/components/PillSelect.vue'
import Modal from '@/components/Modal.vue'
import { useLoaderStore } from '@/stores/loader'
import PatternDownloadConfirmationModal from '@/modals/PatternDownloadConfirmationModal.vue'
import HeroiconMagnifyingGlass from '@/components/HeroiconMagnifyingGlass.vue'
import LocalPatternActionsModal from '@/modals/LocalPatternActionsModal.vue'

const patterns = ref<Pattern[]>([])
const page = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const scroller = ref<HTMLElement | null>(null)
const cols = ref(getCols())
const patternSource = ref<'local' | 'cloud'>('local')
const searchQuery = ref('')

const showDownloadModal = ref(false)
const selectedPattern = ref<Pattern | null>(null)
const downloading = ref(false)

const showLocalPatternModal = ref(false)
const selectedLocalPattern = ref<Pattern | null>(null)

const cloudAPI = useCloudAPIStore()
const localManifest = localFileManager()
const loader = useLoaderStore()

function getCols() {
  if (window.innerWidth >= 1280) return 4
  if (window.innerWidth >= 1024) return 3
  return 2
}

function handleResize() {
  cols.value = getCols()
}

async function fetchCloudPatterns() {
  if (loading.value || page.value > totalPages.value) return
  loading.value = true
  try {
    const data = await cloudAPI.getPatterns(page.value)
    // Exclude patterns already on device
    const localUuids = new Set(localManifest.localPatterns.map((p: Pattern) => p.uuid))
    const filtered = data.results.filter((p: Pattern) => !localUuids.has(p.uuid))
    patterns.value.push(...filtered)
    totalPages.value = data.totalPages
    page.value++
  } catch (e) {
    // handle error (could show alert)
  } finally {
    loading.value = false
  }
}

function fetchLocalPatterns() {
  // Show loader if localPatterns is empty and still loading
  if (localManifest.localPatterns.length === 0) {
    loading.value = true
  } else {
    loading.value = false
  }
  patterns.value = [...localManifest.localPatterns]
  totalPages.value = 1
  page.value = 1
}

// Watch for localPatterns changes and update UI
watch(
  () => localManifest.localPatterns.length,
  (len) => {
    if (patternSource.value === 'local') {
      loading.value = len === 0
      patterns.value = [...localManifest.localPatterns]
    }
  },
  { immediate: true }
)

function onScroll(e: Event) {
  const el = e.target as HTMLElement
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1000 && patternSource.value === 'cloud') {
    fetchCloudPatterns()
  }
}

function onPatternClick(pattern: Pattern) {
  if (patternSource.value === 'cloud') {
    selectedPattern.value = pattern
    showDownloadModal.value = true
  } else {
    selectedLocalPattern.value = pattern
    showLocalPatternModal.value = true
  }
}

function closeDownloadModal() {
  showDownloadModal.value = false
  // Defer clearing selectedPattern to next tick to allow modal to fully close
  setTimeout(() => {
    selectedPattern.value = null
  }, 300)
}

function closeLocalPatternModal() {
  showLocalPatternModal.value = false
  setTimeout(() => {
    selectedLocalPattern.value = null
  }, 300)
}

async function downloadPattern() {
  if (!selectedPattern.value) return
  downloading.value = true
  loader.showLoader('download-pattern', 'Downloading pattern...')
  try {
    await localManifest.downloadPattern(selectedPattern.value.uuid)
    closeDownloadModal()
    // Optionally refresh local/cloud lists
    if (patternSource.value === 'cloud') {
      patterns.value = patterns.value.filter((p) => p.uuid !== selectedPattern.value?.uuid)
    }
  } catch (e) {
    // handle error (could show alert)
  } finally {
    downloading.value = false
    loader.hideLoader('download-pattern')
  }
}

function playLocalPattern() {
  // TODO: Implement play logic
  closeLocalPatternModal()
}

function deleteLocalPattern() {
  if (!selectedLocalPattern.value) return
  localManifest.deletePattern(selectedLocalPattern.value.uuid)
  closeLocalPatternModal()
}

const filteredPatterns = computed(() => {
  if (patternSource.value === 'local') {
    return localManifest.localPatterns.filter((pattern) =>
      pattern.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  return patterns.value.filter((pattern) =>
    pattern.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

watch(patternSource, (val) => {
  patterns.value = []
  page.value = 1
  totalPages.value = 1
  if (val === 'local') {
    fetchLocalPatterns()
  } else {
    fetchCloudPatterns()
  }
})

onMounted(() => {
  if (patternSource.value === 'local') {
    fetchLocalPatterns()
  } else {
    fetchCloudPatterns()
  }
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
