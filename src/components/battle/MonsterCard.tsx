import type { Monster } from '../../types/monster'
import HpBar from '../common/HpBar'

const RARITY_COLOR: Record<string, string> = {
  common: 'text-white/60',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  boss: 'text-abyss-gold',
}

interface Props {
  monster: Monster
  isFlashing?: boolean
}

export default function MonsterCard({ monster, isFlashing }: Props) {
  return (
    <div className={`abyss-panel p-4 text-center space-y-3 ${isFlashing ? 'animate-flash-red' : ''}`}>
      <div className="text-6xl leading-none">👹</div>
      <div>
        <div className={`font-bold text-lg ${RARITY_COLOR[monster.rarity]}`}>{monster.name}</div>
        <div className="text-abyss-text-muted text-xs">Lv.{monster.level} / {monster.rarity}</div>
      </div>
      <HpBar current={monster.hp} max={monster.maxHp} label="HP" color="hp" />
      <div className="grid grid-cols-3 gap-2 text-xs text-abyss-text-muted pt-1">
        <span>ATK <span className="text-white">{monster.atk}</span></span>
        <span>DEF <span className="text-white">{monster.def}</span></span>
        <span>AGI <span className="text-white">{monster.agi}</span></span>
      </div>
    </div>
  )
}
