import type { GhostResponse } from '../types/dungeon'
import { apiClient } from './client'

export async function fetchGhosts(floor: number): Promise<GhostResponse> {
  const res = await apiClient.get<GhostResponse>(`/api/ghosts?floor=${floor}`)
  return res.data
}
