// TODO: [API] GET /api/player — ここを実際のAPIに置き換える
// 現在は静的モックデータを使用
import type { Player, PlayerMeta } from '../types/player'

export const mockPlayer: Player = {
  id: 'player-001',
  name: '勇者',
  jobClass: 'warrior',
  level: 1,
  hp: 80,
  maxHp: 80,
  mp: 20,
  maxMp: 20,
  atk: 12,
  def: 8,
  agi: 6,
  luk: 5,
  skills: [
    {
      id: 'skill-slash',
      name: '斬撃',
      description: '強力な一撃。ATK×1.5のダメージ。',
      mpCost: 5,
      type: 'active',
    },
    {
      id: 'skill-guard',
      name: '鉄壁',
      description: '1ターンDEFが2倍になる。',
      mpCost: 4,
      type: 'active',
    },
  ],
  equipment: {
    weapon: {
      id: 'eq-iron-sword',
      name: '鉄の剣',
      type: 'weapon',
      stats: { atk: 5 },
    },
    armor: {
      id: 'eq-leather-armor',
      name: '革鎧',
      type: 'armor',
      stats: { def: 3 },
    },
  },
  gold: 50,
  floor: 1,
  statusEffects: [],
  exp: 0,
  nextLevelExp: 100,
}

export const mockPlayerMeta: PlayerMeta = {
  soulFragments: 120,
  upgrades: [
    {
      key: 'hp_up',
      name: '生命力強化',
      description: '最大HPが増加する。',
      currentLevel: 1,
      maxLevel: 5,
      cost: 30,
      effect: '+10 HP',
    },
    {
      key: 'atk_up',
      name: '攻撃力強化',
      description: '攻撃力が増加する。',
      currentLevel: 0,
      maxLevel: 5,
      cost: 25,
      effect: '+2 ATK',
    },
    {
      key: 'mp_up',
      name: 'MP強化',
      description: '最大MPが増加する。',
      currentLevel: 0,
      maxLevel: 3,
      cost: 20,
      effect: '+5 MP',
    },
    {
      key: 'gold_bonus',
      name: 'ゴールド強化',
      description: 'ゴールドの獲得量が増加する。',
      currentLevel: 0,
      maxLevel: 3,
      cost: 35,
      effect: '+15% Gold',
    },
  ],
}
