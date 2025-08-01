import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/patterns',
      name: 'patterns',
      component: () => import('@/views/PatternsView.vue')
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: () => import('@/views/PlaylistsView.vue')
    },
    {
      path: '/playlists/:uuid',
      name: 'playlist-detail',
      component: () => import('@/views/PlaylistView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue')
    }
  ]
})

export default router
