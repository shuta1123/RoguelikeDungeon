// TODO: [API] GET /api/ranking — ここを実際のAPIに置き換える
// 現在は静的モックデータを使用
import type { RankingEntry } from '../types/ranking'

export const mockRankings: RankingEntry[] = [
  { rank: 1, playerName: 'ShadowBlade', jobClass: 'rogue', floor: 18, score: 48200, killedBy: 'ドラゴンナイト', createdAt: '2026-05-01' },
  { rank: 2, playerName: 'ArcMage777', jobClass: 'mage', floor: 15, score: 39800, killedBy: '闇の番人', createdAt: '2026-05-01' },
  { rank: 3, playerName: 'IronWall', jobClass: 'warrior', floor: 13, score: 31500, killedBy: 'ゴーレム', createdAt: '2026-04-30' },
  { rank: 4, playerName: 'Venom', jobClass: 'alchemist', floor: 11, score: 27300, killedBy: 'デスナイト', createdAt: '2026-04-30' },
  { rank: 5, playerName: 'BeastMaster', jobClass: 'summoner', floor: 9, score: 21000, killedBy: 'ダークスライム', createdAt: '2026-04-29' },
  { rank: 6, playerName: 'QuickStep', jobClass: 'rogue', floor: 8, score: 18400, killedBy: 'オーガ', createdAt: '2026-04-29' },
  { rank: 7, playerName: 'HolyKnight', jobClass: 'warrior', floor: 7, score: 15600, killedBy: 'ゾンビ', createdAt: '2026-04-28' },
  { rank: 8, playerName: 'FireStorm', jobClass: 'mage', floor: 6, score: 12100, killedBy: 'トロール', createdAt: '2026-04-28' },
  { rank: 9, playerName: 'AlchemyKing', jobClass: 'alchemist', floor: 5, score: 9800, killedBy: 'バンパイア', createdAt: '2026-04-27' },
  { rank: 10, playerName: 'YouSha', jobClass: 'warrior', floor: 3, score: 5200, killedBy: 'ゴブリン', createdAt: '2026-04-27' },
]
