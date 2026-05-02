import type { Monster } from './monster'

export type BattleActionType = 'attack' | 'skill' | 'item' | 'escape'
export type BattlePhase = 'player_turn' | 'enemy_turn' | 'win' | 'lose' | 'escaped'

export interface BattleLog {
  id: string
  message: string
  type: 'attack' | 'skill' | 'synergy' | 'item' | 'miss' | 'critical' | 'status' | 'system'
  damage?: number
}

export interface BattleState {
  isActive: boolean
  turn: number
  phase: BattlePhase
  monster: Monster
  playerHp: number
  playerMp: number
  log: BattleLog[]
  availableActions: BattleActionType[]
  synergyActive?: string | null
}

export interface BattleAction {
  type: BattleActionType
  skillId?: string
  itemId?: string
}

export interface BattleResponse {
  battleState: BattleState
  log: BattleLog[]
}
