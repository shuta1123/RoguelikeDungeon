import { create } from 'zustand'
import type { BattleState, BattleAction } from '../types/battle'
import type { Monster } from '../types/monster'
import { sendBattleAction } from '../api/battle'
import { useGameStore } from './gameStore'
import { usePlayerStore } from './playerStore'
import { useDungeonStore } from './dungeonStore'

interface BattleStore {
  battleState: BattleState | null
  isLoading: boolean
  error: string | null
  initBattle: (monster: Monster) => void
  sendAction: (action: BattleAction) => Promise<void>
  reset: () => void
}

export const useBattleStore = create<BattleStore>((set, get) => ({
  battleState: null,
  isLoading: false,
  error: null,

  initBattle: (monster) => {
    const player = usePlayerStore.getState().player
    set({
      battleState: {
        isActive: true,
        turn: 1,
        phase: 'player_turn',
        monster,
        playerHp: player?.hp ?? 80,
        playerMp: player?.mp ?? 20,
        log: [{ id: 'log-init', message: `${monster.name} が現れた！`, type: 'system' }],
        availableActions: ['attack', 'skill', 'item', 'escape'],
        synergyActive: null,
      },
      isLoading: false,
      error: null,
    })
    useGameStore.getState().setScreen('battle')
  },

  sendAction: async (action) => {
    const runId = useGameStore.getState().runId
    if (!runId) return
    set({ isLoading: true, error: null })
    try {
      const res = await sendBattleAction(runId, action)
      set({ battleState: res.battleState, isLoading: false })

      if (res.battleState.phase === 'win') {
        const dungeonStore = useDungeonStore.getState()
        dungeonStore.addLog(`${get().battleState?.monster.name ?? 'モンスター'} を倒した！`)
        setTimeout(() => {
          useGameStore.getState().setScreen('game')
          set({ battleState: null })
        }, 2000)
      } else if (res.battleState.phase === 'lose') {
        setTimeout(() => {
          useGameStore.getState().setScreen('result')
        }, 2000)
      } else if (res.battleState.phase === 'escaped') {
        useGameStore.getState().setScreen('game')
        set({ battleState: null })
      }
    } catch {
      set({ error: '通信エラーが発生しました', isLoading: false })
    }
  },

  reset: () => set({ battleState: null, isLoading: false, error: null }),
}))
