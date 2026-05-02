export type MonsterRarity = 'common' | 'uncommon' | 'rare' | 'boss'

export interface Monster {
  id: string
  name: string
  hp: number
  maxHp: number
  atk: number
  def: number
  agi: number
  level: number
  rarity: MonsterRarity
  skills: string[]
  statusEffects: string[]
  goldDrop: number
  expDrop: number
  sprite?: string
}
