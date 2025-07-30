import { defineStore } from "pinia";
import { Pattern, Playlist } from "./cloud-api";
import { tableBaseURL } from "@/main";
import { ref } from "vue";

export const localFileManager = defineStore('localFileManager', () => {
  const localPatterns = ref([] as Pattern[]);
  const localPlaylists = ref([] as Playlist[]);

  const loadLocalPatterns = async () => {
    const tempPatterns: Pattern[] = [];
    let page = 0;
    let totalPages = 1;
    do {
      const { results, totalPages: pages } = await getPatterns(page);
      tempPatterns.push(...results);
      totalPages = pages;
      page++;
    } while (page <= totalPages);
    localPatterns.value = tempPatterns;
  }

  const loadLocalPlaylists = async () => {
    const tempPlaylists: Playlist[] = [];
    let page = 0;
    let totalPages = 1;
    do {
      const { results, totalPages: pages } = await getPlaylists(page);
      tempPlaylists.push(...results);
      totalPages = pages;
      page++;
    } while (page <= totalPages);
    localPlaylists.value = tempPlaylists;
  }

  const getPlaylists = async (page: number = 0) => {
    const response = await fetch(`${tableBaseURL}/api/playlists?page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to load playlists');
    }
    const data = await response.json();
    return {
      results: data.playlists as Playlist[],
      totalPlaylists: data.total,
      totalPages: Math.floor(data.total / 20) // Assuming 20 playlists per page
    }
  }

  const getPatterns = async (page: number = 0) => {
    const response = await fetch(`${tableBaseURL}/api/patterns?page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to load manifest');
    }
    const data = await response.json();
    return {
      results: data.patterns as Pattern[],
      totalPatterns: data.total,
      totalPages: Math.floor(data.total / 20) // Assuming 20 patterns per page
    }
  }

  const downloadPattern = async (uuid: string) => {
    const response = await fetch(`${tableBaseURL}/api/cloud/download_pattern`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', //doesn't trigger CORS preflight
      },
      body: JSON.stringify({ uuid }),
    });

    if (!response.ok) {
      throw new Error('Failed to download pattern');
    }

    await loadLocalPatterns();
  }

  const deletePattern = async (uuid: string) => {
    // Remove from backend
    const response = await fetch(`${tableBaseURL}/api/patterns/${uuid}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete pattern');
    }
    await loadLocalPatterns();
  }

  if (localPatterns.value.length === 0) {
    loadLocalPatterns();
  }

  if (localPlaylists.value.length === 0) {
    loadLocalPlaylists();
  }

  return {
    downloadPattern,
    deletePattern,
    localPatterns,
    localPlaylists,
  };
});
