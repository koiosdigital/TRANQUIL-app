<script setup lang="ts">
import {
  HomeIcon,
  MusicalNoteIcon,
  QueueListIcon,
  AdjustmentsVerticalIcon,
} from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'

const links = [
  { name: 'Home', icon: HomeIcon, to: '/' },
  { name: 'Patterns', icon: MusicalNoteIcon, to: '/patterns' },
  { name: 'Playlists', icon: QueueListIcon, to: '/playlists' },
  { name: 'Settings', icon: AdjustmentsVerticalIcon, to: '/settings' },
]
</script>

<template>
  <div class="flex items-center fixed bottom-0 left-0 w-full">
    <router-link
      v-for="link in links"
      :to="link.to"
      active-class="bg-zinc-900 [&_*]:text-slate-100"
      class="flex items-center justify-center grow p-4 hover:bg-zinc-900 group transition transform-gpu duration-300"
    >
      <component
        :is="link.icon"
        class="h-6 text-gray-400 group-hover:text-slate-100 duration-300 transform-gpu"
      />
    </router-link>
  </div>
</template>
