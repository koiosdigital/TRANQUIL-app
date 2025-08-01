<template>
  <div class="flex flex-col items-center justify-between">
    <Modal title="Log In to Tranquil" v-model="showLoginModal">
      <LoginModal @login-success="showLoginModal = false" />
    </Modal>

    <Logo />

    <div class="flex flex-col items-center justify-center gap-4 w-[80%] max-w-xl">
      <div class="relative">
        <template
          v-if="
            playerStore.state.playback_state === PlayerStatus.Idle ||
            playerStore.state.playback_state === PlayerStatus.Stopped
          "
        >
          <div class="rounded-full" v-if="token && randomPattern" :style="gradientColorStops">
            <div class="p-2 rounded-full">
              <PatternImage
                :pattern="randomPattern"
                :key="randomPattern.uuid"
                class="w-full h-full rounded-full"
              />
              <router-link
                to="/patterns"
                class="absolute flex items-center justify-center bg-zinc-700/40 rounded-full transition hover:bg-zinc-700/60 z-10 w-full h-full top-0 left-0"
              >
                <PlayIcon class="h-16 w-16 text-slate-200" />
              </router-link>
            </div>
          </div>
        </template>

        <template
          v-else-if="
            playerStore.state.playback_state === PlayerStatus.Playing ||
            playerStore.state.playback_state === PlayerStatus.Paused
          "
        >
          <div
            class="relative rounded-full"
            v-if="token && playingPattern"
            :style="gradientColorStops"
          >
            <div class="p-2 rounded-full" :style="gradientColorStopsProgress">
              <PatternImage :pattern="playingPattern" class="w-full h-full rounded-full" />
            </div>
          </div>
        </template>
      </div>

      <button
        @click="showLightModal = true"
        class="p-2 rounded-full bg-zinc-700/40 hover:bg-zinc-700/60 transition flex gap-2 items-center px-4"
      >
        <LightBulbIcon class="h-8 w-8 text-slate-200" />
        <span>LED Controls</span>
      </button>

      <Modal v-model="showLightModal" title="LED Controls" dismissable>
        <LightControlModal />
      </Modal>
    </div>

    <div></div>
  </div>
</template>

<script setup lang="ts">
import { useCloudAPIStore } from '@/stores/cloud-api'
import { onMounted, ref, watchEffect, onUnmounted, computed } from 'vue'
import Modal from '@/components/Modal.vue'
import LoginModal from '@/modals/LoginModal.vue'
import { useLoaderStore } from '@/stores/loader'
import Logo from '@/components/Logo.vue'
import PatternImage from '@/components/PatternImage.vue'
import { localFileManager } from '@/stores/local-manifest'
import { PlayerStatus, usePlayerStore } from '@/stores/player'
import { LightBulbIcon, PlayIcon } from '@heroicons/vue/24/outline'
import LightControlModal from '@/modals/LightControlModal.vue'

const token = ref('')
const showLoginModal = ref(false)
const randomPattern = ref<ReturnType<(typeof localManifest.localPatterns)['at']> | null>(null)
let intervalId: number | null = null

const loaderStore = useLoaderStore()
const localManifest = localFileManager()
const playerStore = usePlayerStore()
const showLightModal = ref(false)

const gradientColorStops = computed(() => {
  // Use Tailwind's green-400 and teal-500 for a nice gradient in dark mode
  const primaryColor = '#4ade80' // Tailwind green-400
  const secondaryColor = '#14b8a6' // Tailwind teal-500

  return `background: conic-gradient(${primaryColor}, ${secondaryColor}, ${primaryColor}) !important;`
})

const gradientColorStopsProgress = computed(() => {
  const progressDeg = ((playerStore.state.progress ?? 0) / 100) * 360
  return `background: conic-gradient(rgba(0,0,0,0) 0deg, rgba(0,0,0,0) ${progressDeg}deg, var(--color-zinc-800) ${
    progressDeg + 0.001
  }deg) !important;`
})

const playingPattern = computed(() => {
  if (playerStore.state.pattern_uuid) {
    return localManifest.getPatternByUUID(playerStore.state.pattern_uuid) || null
  }
  return null
})

function pickRandomPattern() {
  const patterns = localManifest.localPatterns
  if (patterns.length > 0) {
    randomPattern.value = patterns[Math.floor(Math.random() * patterns.length)] ?? null
  } else {
    randomPattern.value = null
  }
}

onMounted(async () => {
  const cloudAPI = useCloudAPIStore()
  loaderStore.showLoader('login')

  try {
    const response = await cloudAPI.getToken()
    token.value = response
  } catch (error) {
    console.error('Error fetching token:', error)
    showLoginModal.value = true
  }

  loaderStore.hideLoader('login')

  pickRandomPattern()
  intervalId = window.setInterval(pickRandomPattern, 5000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

watchEffect(() => {
  pickRandomPattern()
})
</script>
