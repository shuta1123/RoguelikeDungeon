import { create } from 'zustand'

export type Screen = 'title' | 'lobby' | 'game' | 'battle' | 'result' | 'ranking'

interface GameStore {
  currentScreen: Screen
  runId: string | null
  setScreen: (screen: Screen) => void
  setRunId: (id: string) => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  currentScreen: 'title',
  runId: null,
  setScreen: (screen) => set({ currentScreen: screen }),
  setRunId: (id) => set({ runId: id }),
  reset: () => set({ currentScreen: 'title', runId: null }),
}))
