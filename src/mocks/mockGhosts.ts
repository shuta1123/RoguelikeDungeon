// TODO: [API] GET /api/ghosts — ここを実際のAPIに置き換える
// 現在は静的モックデータを使用
import type { Ghost } from '../types/dungeon'

export const mockGhosts: Ghost[] = [
  { id: 'ghost-001', playerName: 'ShadowBlade', jobClass: 'rogue', floor: 1, causeOfDeath: 'ゴブリンに倒された', timestamp: '2026-05-01T12:00:00Z' },
  { id: 'ghost-002', playerName: 'ArcMage777', jobClass: 'mage', floor: 1, causeOfDeath: '毒に侵された', timestamp: '2026-05-01T10:30:00Z' },
]
