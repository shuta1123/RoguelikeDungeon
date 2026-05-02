import type { Player } from './player'
import type { Monster } from './monster'
import type { Item } from './item'

export type CellType = 'wall' | 'floor' | 'player' | 'monster' | 'item' | 'stairs' | 'special' | 'dark'
export type Direction = 'up' | 'down' | 'left' | 'right'

export interface Position {
  x: number
  y: number
}

export interface Cell {
  x: number
  y: number
  type: CellType
  visible: boolean
  explored: boolean
  monsterId?: string
  itemId?: string
}

export interface SpecialRoom {
  id: string
  type: 'shop' | 'treasure' | 'shrine' | 'boss'
  position: Position
}

export interface Ghost {
  id: string
  playerName: string
  jobClass: string
  floor: number
  causeOfDeath: string
  timestamp: string
}

export interface DungeonMap {
  floor: number
  seed: string
  width: number
  height: number
  cells: Cell[][]
  playerPos: Position
  stairsPos: Position
  specialRooms: SpecialRoom[]
}

export type MoveEvent =
  | { type: 'battle'; monster: Monster }
  | { type: 'item'; item: Item }
  | { type: 'stairs' }
  | { type: 'ghost'; ghost: Ghost }
  | null

export interface StartRunResponse {
  runId: string
  map: DungeonMap
  player: Player
}

export interface MoveResponse {
  map: DungeonMap
  player: Player
  event: MoveEvent
}

export interface DescendResponse {
  map: DungeonMap
  player: Player
  floor: number
}

export interface GhostResponse {
  ghosts: Ghost[]
}
