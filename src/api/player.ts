import type { PlayerMeta } from '../types/player'
import { mockPlayerMeta } from '../mocks/mockPlayer'

// TODO: [API] GET /api/player/meta — ここを実際のAPIに置き換える
// 現在は静的モックデータを使用
export async function fetchMeta(): Promise<PlayerMeta> {
  await new Promise((r) => setTimeout(r, 200))
  return { ...mockPlayerMeta }
}

// TODO: [API] POST /api/player/meta/upgrade — ここを実際のAPIに置き換える
// 現在は静的モックデータを使用
export async function purchaseUpgrade(upgradeKey: string): Promise<PlayerMeta> {
  await new Promise((r) => setTimeout(r, 300))
  const meta = { ...mockPlayerMeta }
  const upgrade = meta.upgrades.find((u) => u.key === upgradeKey)
  if (upgrade && upgrade.currentLevel < upgrade.maxLevel && meta.soulFragments >= upgrade.cost) {
    meta.soulFragments -= upgrade.cost
    upgrade.currentLevel += 1
  }
  return meta
}
