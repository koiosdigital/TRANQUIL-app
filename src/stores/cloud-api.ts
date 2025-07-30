import { tableBaseURL } from "@/main";
import { defineStore } from "pinia";
import { GetPatternsResponse } from "./cloud-api-types";

export interface Pattern {
  uuid: string;
  name: string;
  date: string;
  popularity: number;
  creator: string;
}

export interface Playlist {
  uuid: string;
  name: string;
  description: string;
  patterns: string[];
  featured_pattern: string;
  date: string;
}

export const useCloudAPIStore = defineStore('cloud-api', () => {
  const apiBaseURL = "https://tranquil.api.koiosdigital.net";

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
    return data.token;
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

  const getPatterns = async (page: number = 1): Promise<GetPatternsResponse> => {
    const token = await getToken();
    const response = await fetch(`${apiBaseURL}/patterns?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patterns');
    }

    return response.json();
  }

  return {
    apiBaseURL,
    getToken,
    doLogin,
    getPatterns
  }
});
