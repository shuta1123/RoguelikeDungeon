export type JobClass = 'warrior' | 'mage' | 'rogue' | 'summoner' | 'alchemist'

export interface StatusEffect {
  id: string
  name: string
  duration: number
  type: 'buff' | 'debuff'
  icon: string
}

export interface Skill {
  id: string
  name: string
  description: string
  mpCost: number
  type: 'active' | 'passive'
  icon?: string
}

export interface Equipment {
  weapon?: EquipItem
  armor?: EquipItem
  accessory?: EquipItem
}

export interface EquipItem {
  id: string
  name: string
  type: 'weapon' | 'armor' | 'accessory'
  stats: Partial<{ atk: number; def: number; agi: number; luk: number; hp: number; mp: number }>
}

export interface Player {
  id: string
  name: string
  jobClass: JobClass
  level: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  atk: number
  def: number
  agi: number
  luk: number
  skills: Skill[]
  equipment: Equipment
  gold: number
  floor: number
  statusEffects: StatusEffect[]
  exp: number
  nextLevelExp: number
}

export interface MetaUpgrade {
  key: string
  name: string
  description: string
  currentLevel: number
  maxLevel: number
  cost: number
  effect: string
}

export interface PlayerMeta {
  soulFragments: number
  upgrades: MetaUpgrade[]
}
