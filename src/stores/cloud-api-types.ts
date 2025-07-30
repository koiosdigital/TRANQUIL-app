import { type Pattern, type Playlist } from '@/stores/cloud-api'

export interface GetPatternsResponse {
  results: Pattern[]
  totalPages: number
}
