import type { RankingResponse } from '../types/ranking'
import { mockRankings } from '../mocks/mockRanking'

// TODO: [API] GET /api/ranking?period=daily|all-time — ここを実際のAPIに置き換える
// 現在は静的モックデータを使用
export async function fetchRanking(_period: 'daily' | 'all-time'): Promise<RankingResponse> {
  await new Promise((r) => setTimeout(r, 300))
  return { rankings: mockRankings }
}
