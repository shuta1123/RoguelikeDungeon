import { create } from 'zustand'
import type { DungeonMap, Direction, MoveEvent } from '../types/dungeon'
import type { JobClass } from '../types/player'
import { startRun, move, descend } from '../api/dungeon'
import { useGameStore } from './gameStore'
import { usePlayerStore } from './playerStore'

interface DungeonStore {
  runId: string | null
  currentMap: DungeonMap | null
  floor: number
  actionLog: string[]
  isLoading: boolean
  error: string | null
  startRun: (jobClass: JobClass) => Promise<void>
  move: (direction: Direction) => Promise<MoveEvent>
  descend: () => Promise<void>
  addLog: (msg: string) => void
  reset: () => void
}

export const useDungeonStore = create<DungeonStore>((set, get) => ({
  runId: null,
  currentMap: null,
  floor: 1,
  actionLog: [],
  isLoading: false,
  error: null,

  startRun: async (jobClass) => {
    set({ isLoading: true, error: null })
    try {
      const res = await startRun(jobClass)
      set({ runId: res.runId, currentMap: res.map, floor: res.map.floor, isLoading: false, actionLog: ['冒険を開始した。'] })
      useGameStore.getState().setRunId(res.runId)
      usePlayerStore.getState().setPlayer(res.player)
      useGameStore.getState().setScreen('game')
    } catch {
      set({ error: 'ランの開始に失敗しました', isLoading: false })
    }
  },

  move: async (direction) => {
    const { runId } = get()
    if (!runId) return null
    set({ isLoading: true })
    try {
      const res = await move(runId, direction)
      set({ currentMap: res.map, isLoading: false })
      usePlayerStore.getState().setPlayer(res.player)
      return res.event
    } catch {
      set({ isLoading: false })
      return null
    }
  },

  descend: async () => {
    const { runId } = get()
    if (!runId) return
    set({ isLoading: true, error: null })
    try {
      const res = await descend(runId)
      set({ currentMap: res.map, floor: res.floor, isLoading: false, actionLog: [`${res.floor}階に降りた。`] })
      usePlayerStore.getState().setPlayer(res.player)
    } catch {
      set({ error: '階段の降下に失敗しました', isLoading: false })
    }
  },

  addLog: (msg) => set((s) => ({ actionLog: [...s.actionLog.slice(-49), msg] })),

  reset: () => set({ runId: null, currentMap: null, floor: 1, actionLog: [], isLoading: false, error: null }),
}))
