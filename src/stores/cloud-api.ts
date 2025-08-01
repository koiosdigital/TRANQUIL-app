import { tableBaseURL } from "@/main";
import { defineStore } from "pinia";
import { GetPatternsResponse, GetPlaylistsResponse, Pattern, Playlist } from "../cloud-api-types";
import { ref } from "vue";

const apiBaseURL = "https://tranquil.api.koiosdigital.net";

export const useCloudAPIStore = defineStore('cloud-api', () => {
  const playlists = ref<Playlist[]>([]);
  const patterns = ref<Pattern[]>([]);

  const lastPlaylistsPage = ref(0);
  const lastPatternsPage = ref(0);

  const getToken = async () => {
    const token = localStorage.getItem('tranquil-token');
    if (token) {
      return token;
    }

    const response = await fetch(`${tableBaseURL}/api/cloud/token`);

    if (!response.ok) {
      throw new Error('Log in to continue');
    }

    const data = await response.json();
    localStorage.setItem('tranquil-token', data.token);
    return data.token as string;
  }

  const doLogin = async (email: string, password: string) => {
    const response = await fetch(`${tableBaseURL}/api/cloud/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', //doesn't trigger CORS preflight
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error(await response.text() || 'Login failed');
    }
    const data = await response.json();
    localStorage.setItem('tranquil-token', data.token);
    return data.token;
  }

  const getMorePatterns = async () => {
    const token = await getToken();
    const response = await fetch(`${apiBaseURL}/patterns?page=${lastPatternsPage.value + 1}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patterns');
    }

    const data = await response.json() as GetPatternsResponse;
    patterns.value.push(...data.results);
    lastPatternsPage.value++;
  }

  const getMorePlaylists = async () => {
    const token = await getToken();
    const response = await fetch(`${apiBaseURL}/playlists?page=${lastPlaylistsPage.value + 1}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }

    const data = await response.json() as GetPlaylistsResponse;
    playlists.value.push(...data.results);
    lastPlaylistsPage.value++;
  }

  return {
    apiBaseURL,
    getToken,
    doLogin,
    getMorePatterns,
    getMorePlaylists,
    patterns,
    playlists,
  }
});
