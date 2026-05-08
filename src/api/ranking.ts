import type { RankingResponse } from '../types/ranking'
import { apiClient } from './client'

export async function fetchRanking(period: 'daily' | 'all-time'): Promise<RankingResponse> {
  const res = await apiClient.get<RankingResponse>(`/api/ranking?period=${period}`)
  return res.data
}
