import type { MetaUpgrade as MetaUpgradeType } from '../../types/player'
import Button from '../common/Button'

interface Props {
  upgrades: MetaUpgradeType[]
  soulFragments: number
  onPurchase: (key: string) => void
  isLoading?: boolean
}

export default function MetaUpgrade({ upgrades, soulFragments, onPurchase, isLoading }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-abyss-text-muted">魂の欠片</span>
        <span className="text-abyss-gold font-bold text-lg">✦ {soulFragments}</span>
      </div>
      {upgrades.map((upg) => {
        const maxed = upg.currentLevel >= upg.maxLevel
        const canAfford = soulFragments >= upg.cost
        return (
          <div key={upg.key} className="abyss-panel px-3 py-2 border border-abyss-purple/40">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-abyss-gold-light font-bold text-sm">{upg.name}</span>
                <span className="ml-2 text-xs text-abyss-text-muted">Lv {upg.currentLevel}/{upg.maxLevel}</span>
              </div>
              {!maxed ? (
                <Button
                  size="sm"
                  variant={canAfford ? 'primary' : 'ghost'}
                  disabled={!canAfford || isLoading}
                  onClick={() => onPurchase(upg.key)}
                >
                  ✦ {upg.cost}
                </Button>
              ) : (
                <span className="text-green-400 text-xs">MAX</span>
              )}
            </div>
            <p className="text-xs text-abyss-text-muted mt-0.5">{upg.description}</p>
            {!maxed && <p className="text-xs text-blue-300 mt-0.5">次: {upg.effect}</p>}
          </div>
        )
      })}
    </div>
  )
}
