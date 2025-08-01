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

export interface GetPatternsResponse {
  results: Pattern[]
  totalPages: number
}

export interface GetPlaylistsResponse {
  results: Playlist[]
  totalPages: number
}
