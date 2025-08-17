import { defineStore } from 'pinia';
import { ref } from 'vue';
import { tableBaseURL } from '../main';
import { Playlist } from '@/cloud-api-types';

const playlistsBaseUrl = `${tableBaseURL}/api/playlists`;

export type PlaylistsListResponse = {
  total: number;
  playlists: Playlist[];
};

export const usePlaylistsStore = defineStore('playlists', () => {
  const playlists = ref<Playlist[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const current = ref<Playlist | null>(null);

  // Helper for POST requests with JSON and text/plain
  async function postJson(url: string, body?: any) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error('Request failed');
    return res.json();
  }

  // List playlists (paginated)
  async function fetchPlaylists(page = 0, pageSize = 20) {
    loading.value = true;
    try {
      const res = await fetch(`${playlistsBaseUrl}?page=${page}&page_size=${pageSize}`);
      if (!res.ok) throw new Error('Failed to fetch playlists');
      const data: PlaylistsListResponse = await res.json();
      playlists.value = data.playlists;
      total.value = data.total;
    } finally {
      loading.value = false;
    }
  }

  // Get playlist detail
  async function fetchPlaylist(uuid: string) {
    loading.value = true;
    try {
      const res = await fetch(`${playlistsBaseUrl}/${uuid}`);
      if (!res.ok) throw new Error('Failed to fetch playlist');
      current.value = await res.json();
    } finally {
      loading.value = false;
    }
  }

  // Create playlist
  async function createPlaylist(playlist: Playlist) {
    loading.value = true;
    try {
      const data = await postJson(playlistsBaseUrl, playlist);
      return data as Playlist;
    } finally {
      loading.value = false;
    }
  }

  // Add or delete pattern from playlist
  async function modifyPlaylist(uuid: string, pattern: string, action: 'add' | 'delete') {
    loading.value = true;
    try {
      const data = await postJson(`${playlistsBaseUrl}/${uuid}`, { pattern, action });
      return data as Playlist;
    } finally {
      loading.value = false;
    }
  }

  async function deletePlaylist(uuid: string) {
    loading.value = true;
    try {
      const res = await fetch(`${playlistsBaseUrl}/${uuid}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete playlist');
      // Optionally, you can remove the playlist from the local state
      playlists.value = playlists.value.filter(p => p.uuid !== uuid);
      if (current.value?.uuid === uuid) {
        current.value = null; // Clear current if deleted
      }
    } finally {
      loading.value = false;
    }
  }

  // Reorder playlist
  async function reorderPlaylist(uuid: string, newOrder: string[]) {
    loading.value = true;
    try {
      const data = await postJson(`${playlistsBaseUrl}/${uuid}/order`, newOrder);
      return data as Playlist;
    } finally {
      loading.value = false;
    }
  }

  return {
    playlists,
    total,
    loading,
    current,
    fetchPlaylists,
    fetchPlaylist,
    createPlaylist,
    modifyPlaylist,
    reorderPlaylist,
    deletePlaylist,
  };
});
