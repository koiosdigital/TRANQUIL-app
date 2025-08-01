<template>
  <div class="bg-zinc-800 text-slate-100 h-screen w-screen">
    <RouterView
      v-slot="{ Component }"
      class="fixed top-0 left-0 w-full h-[calc(100vh-3.5rem)] overflow-y-scroll overflow-x-hidden px-4 pt-4 custom-scrollbar scrollbar-overlay"
    >
      <Transition name="fade">
        <Component :is="Component" />
      </Transition>
    </RouterView>

    <AppFooter />

    <FullScreenLoader
      :message="loader.loaderMessages[loader.activeLoaders[0]].message"
      :z-index="loader.loaderMessages[loader.activeLoaders[0]].zIndex"
      v-if="loader.activeLoaders.length !== 0"
    ></FullScreenLoader>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Transition } from 'vue'

import { useLoaderStore } from '@/stores/loader'

import AppFooter from '@/components/AppFooter.vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'

const loader = useLoaderStore()
</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 12px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.3); /* slate-500/30 */
  border-radius: 8px;
  border: 3px solid transparent;
  background-clip: padding-box;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.3) transparent;
}

/* Overlay/floating scrollbar: does not affect layout */
.scrollbar-overlay {
  scrollbar-gutter: stable both-edges;
}

@media (hover: hover) and (pointer: fine) {
  .custom-scrollbar::-webkit-scrollbar {
    position: absolute;
    right: 0;
    z-index: 50;
  }
}
</style>
