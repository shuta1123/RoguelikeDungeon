export type ItemType = 'consumable' | 'weapon' | 'armor' | 'accessory' | 'key'

export interface Item {
  id: string
  name: string
  description: string
  type: ItemType
  effect?: string
  value: number
  quantity?: number
}
