// TODO: [API] 実際はGoが戦闘計算して返す
// ダメージ計算・シナジー判定・状態異常はGoの責務
import type { BattleState } from '../types/battle'

export const mockInitialBattleState: BattleState = {
  isActive: true,
  turn: 1,
  phase: 'player_turn',
  monster: {
    id: 'goblin-01',
    name: 'ゴブリン',
    hp: 30,
    maxHp: 30,
    atk: 8,
    def: 3,
    agi: 5,
    level: 1,
    rarity: 'common',
    skills: [],
    statusEffects: [],
    goldDrop: 15,
    expDrop: 25,
  },
  playerHp: 80,
  playerMp: 20,
  log: [
    {
      id: 'log-init',
      message: 'ゴブリン が現れた！',
      type: 'system',
    },
  ],
  availableActions: ['attack', 'skill', 'item', 'escape'],
  synergyActive: null,
}

export const mockAttackResponse: BattleState = {
  ...mockInitialBattleState,
  turn: 2,
  phase: 'enemy_turn',
  monster: {
    ...mockInitialBattleState.monster,
    hp: 18,
  },
  log: [
    ...mockInitialBattleState.log,
    {
      id: 'log-atk-1',
      message: '勇者 の攻撃！ゴブリン に 12 ダメージ！',
      type: 'attack',
      damage: 12,
    },
    {
      id: 'log-enemy-1',
      message: 'ゴブリン の攻撃！勇者 に 6 ダメージ！',
      type: 'attack',
      damage: 6,
    },
  ],
  playerHp: 74,
}

export const mockWinBattleState: BattleState = {
  ...mockInitialBattleState,
  phase: 'win',
  monster: {
    ...mockInitialBattleState.monster,
    hp: 0,
  },
  log: [
    {
      id: 'log-win',
      message: 'ゴブリン を倒した！25 EXP、15 Gold 獲得！',
      type: 'system',
    },
  ],
}
