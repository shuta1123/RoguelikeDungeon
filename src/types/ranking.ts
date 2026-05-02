export interface RankingEntry {
  rank: number
  playerName: string
  jobClass: string
  floor: number
  score: number
  killedBy?: string
  createdAt: string
}

export interface RankingResponse {
  rankings: RankingEntry[]
}
