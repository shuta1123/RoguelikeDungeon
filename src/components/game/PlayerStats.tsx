import type { Player } from '../../types/player'
import HpBar from '../common/HpBar'

const JOB_LABEL: Record<string, string> = {
  warrior: '剣士',
  mage: '魔法使い',
  rogue: '盗賊',
  summoner: '召喚士',
  alchemist: '錬金術師',
}

interface Props {
  player: Player
}

export default function PlayerStats({ player }: Props) {
  return (
    <div className="abyss-panel p-3 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-abyss-gold font-bold">{player.name}</span>
        <span className="text-abyss-text-muted">{JOB_LABEL[player.jobClass]} Lv.{player.level}</span>
      </div>

      <HpBar current={player.hp} max={player.maxHp} label="HP" color="hp" />
      <HpBar current={player.mp} max={player.maxMp} label="MP" color="mp" />

      <div className="grid grid-cols-4 gap-x-2 gap-y-1 text-abyss-text-muted pt-1 border-t border-abyss-purple/20">
        <span>ATK <span className="text-white">{player.atk}</span></span>
        <span>DEF <span className="text-white">{player.def}</span></span>
        <span>AGI <span className="text-white">{player.agi}</span></span>
        <span>LUK <span className="text-white">{player.luk}</span></span>
      </div>

      <div className="flex justify-between text-abyss-text-muted border-t border-abyss-purple/20 pt-1">
        <span>Gold <span className="text-abyss-gold">{player.gold}</span></span>
        <span>B{player.floor}F</span>
        <span>EXP <span className="text-white">{player.exp}/{player.nextLevelExp}</span></span>
      </div>

      {player.statusEffects.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {player.statusEffects.map((e) => (
            <span key={e.id} className={`px-1 rounded text-xs ${e.type === 'buff' ? 'bg-blue-900/60 text-blue-300' : 'bg-red-900/60 text-red-300'}`}>
              {e.name} ({e.duration})
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
