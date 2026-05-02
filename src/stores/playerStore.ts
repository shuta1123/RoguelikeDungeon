import { create } from 'zustand'
import type { Player, PlayerMeta } from '../types/player'
import { fetchMeta, purchaseUpgrade } from '../api/player'

interface PlayerStore {
  player: Player | null
  meta: PlayerMeta | null
  isLoading: boolean
  error: string | null
  setPlayer: (player: Player) => void
  loadMeta: () => Promise<void>
  buyUpgrade: (key: string) => Promise<void>
  reset: () => void
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  player: null,
  meta: null,
  isLoading: false,
  error: null,
  setPlayer: (player) => set({ player }),
  loadMeta: async () => {
    set({ isLoading: true, error: null })
    try {
      const meta = await fetchMeta()
      set({ meta, isLoading: false })
    } catch {
      set({ error: 'データの取得に失敗しました', isLoading: false })
    }
  },
  buyUpgrade: async (key) => {
    set({ isLoading: true, error: null })
    try {
      const meta = await purchaseUpgrade(key)
      set({ meta, isLoading: false })
    } catch {
      set({ error: '強化に失敗しました', isLoading: false })
    }
  },
  reset: () => set({ player: null, meta: null, isLoading: false, error: null }),
}))
