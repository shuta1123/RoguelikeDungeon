import type { GhostResponse } from '../types/dungeon'
import { mockGhosts } from '../mocks/mockGhosts'

// TODO: [API] GET /api/ghosts?floor={n} — ここを実際のAPIに置き換える
// ※ 亡霊はGoサーバーが死亡プレイヤーデータを管理している
// 現在は静的モックデータを使用
export async function fetchGhosts(_floor: number): Promise<GhostResponse> {
  await new Promise((r) => setTimeout(r, 200))
  return { ghosts: mockGhosts.filter((g) => g.floor === _floor) }
}
