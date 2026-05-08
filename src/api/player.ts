import type { PlayerMeta } from '../types/player'
import { apiClient } from './client'

export async function fetchMeta(): Promise<PlayerMeta> {
  const res = await apiClient.get<PlayerMeta>('/api/player/meta')
  return res.data
}

export async function purchaseUpgrade(upgradeKey: string): Promise<PlayerMeta> {
  const res = await apiClient.post<PlayerMeta>('/api/player/meta/upgrade', { upgradeKey })
  return res.data
}
