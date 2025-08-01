import { defineStore } from 'pinia';
import { ref } from 'vue';
import { tableBaseURL } from '../main';

const playerBaseUrl = `${tableBaseURL}/api/player`;

export enum PlayerStatus {
  Idle = 'IDLE',
  Playing = 'PLAYING',
  Paused = 'PAUSED',
  Stopped = 'STOPPED',
}

// Player state type
export interface PlayerState {
  playback_state: PlayerStatus;
  pattern_uuid: string | null;
  progress?: number; // Optional, used for progress tracking
}

export const usePlayerStore = defineStore('player', () => {
  const state = ref<PlayerState>({
    playback_state: PlayerStatus.Idle,
    pattern_uuid: null,
    progress: 0
  });

  const loading = ref(false);
  let pollInterval: ReturnType<typeof setInterval> | null = null;

  // Fetch player state from backend
  async function fetchState() {
    try {
      const res = await fetch(playerBaseUrl);
      if (!res.ok) throw new Error('Failed to fetch player state');
      const data = await res.json();
      state.value = {
        ...state.value,
        ...data,
      };
    } catch (e) {
      // Optionally handle error
    }
  }

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

  // Play a local pattern by UUID
  async function play(uuid: string) {
    loading.value = true;
    try {
      await postJson(`${playerBaseUrl}/play`, { uuid });
      await fetchState();
    } finally {
      loading.value = false;
    }
  }

  // Pause
  async function pause() {
    loading.value = true;
    try {
      await postJson(`${playerBaseUrl}/pause`);
      await fetchState();
    } finally {
      loading.value = false;
    }
  }

  // Stop
  async function stop() {
    loading.value = true;
    try {
      await postJson(`${playerBaseUrl}/stop`);
      await fetchState();
    } finally {
      loading.value = false;
    }
  }

  // Resume
  async function resume() {
    loading.value = true;
    try {
      await postJson(`${playerBaseUrl}/resume`);
      await fetchState();
    } finally {
      loading.value = false;
    }
  }

  // Set speed
  async function setSpeed(speed: number) {
    loading.value = true;
    try {
      await postJson(`${playerBaseUrl}/speed`, { speed });
      await fetchState();
    } finally {
      loading.value = false;
    }
  }

  // --- Auto-init and polling on store creation ---
  if (!pollInterval) {
    fetchState();
    pollInterval = setInterval(fetchState, 5000);
  }

  return {
    state,
    loading,
    fetchState,
    play,
    pause,
    stop,
    resume,
    setSpeed,
  };
});
