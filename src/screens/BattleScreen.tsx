import { useState } from 'react'
import MonsterCard from '../components/battle/MonsterCard'
import BattleLog from '../components/battle/BattleLog'
import SkillList from '../components/battle/SkillList'
import HpBar from '../components/common/HpBar'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useBattleStore } from '../stores/battleStore'
import { usePlayerStore } from '../stores/playerStore'

export default function BattleScreen() {
  const { battleState, sendAction, isLoading } = useBattleStore()
  const player = usePlayerStore((s) => s.player)
  const [skillMenuOpen, setSkillMenuOpen] = useState(false)

  if (!battleState || !player) return null

  const isPlayerTurn = battleState.phase === 'player_turn'
  const isEnded = ['win', 'lose', 'escaped'].includes(battleState.phase)

  return (
    <div className="flex flex-col h-screen bg-abyss-bg animate-fade-in overflow-hidden">
      {/* header */}
      <header className="flex items-center justify-between px-6 py-2 border-b border-abyss-purple/30">
        <span className="text-abyss-text-muted text-xs">B{player.floor}F — ターン {battleState.turn}</span>
        {battleState.synergyActive && (
          <span className="text-abyss-gold text-xs animate-pulse">⚡ シナジー: {battleState.synergyActive}</span>
        )}
        <span className={`text-xs ${isPlayerTurn ? 'text-green-400' : 'text-red-400'}`}>
          {isPlayerTurn ? '▶ あなたのターン' : '⚠ 敵のターン'}
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        {/* monster */}
        <div className="flex-1 flex flex-col gap-3">
          <MonsterCard monster={battleState.monster} isFlashing={battleState.phase === 'enemy_turn'} />

          {/* player hp in battle */}
          <div className="abyss-panel p-3 space-y-2">
            <p className="text-abyss-text-dim text-xs">{player.name} — {player.jobClass}</p>
            <HpBar current={battleState.playerHp} max={player.maxHp} label="HP" color="hp" />
            <HpBar current={battleState.playerMp} max={player.maxMp} label="MP" color="mp" />
          </div>

          <BattleLog logs={battleState.log} />
        </div>

        {/* commands */}
        <div className="w-52 flex flex-col gap-2">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner message="処理中..." />
            </div>
          ) : isEnded ? (
            <div className={`text-center py-6 text-lg font-bold ${battleState.phase === 'win' ? 'text-green-400' : battleState.phase === 'lose' ? 'text-red-400' : 'text-abyss-text-muted'}`}>
              {battleState.phase === 'win' && '✦ 勝利！'}
              {battleState.phase === 'lose' && '✕ 敗北…'}
              {battleState.phase === 'escaped' && '↩ 逃走した'}
            </div>
          ) : (
            <>
              <Button
                variant="primary"
                disabled={!isPlayerTurn}
                onClick={() => { setSkillMenuOpen(false); sendAction({ type: 'attack' }) }}
              >
                ⚔ 攻撃
              </Button>
              <Button
                variant="secondary"
                disabled={!isPlayerTurn}
                onClick={() => setSkillMenuOpen((v) => !v)}
              >
                ✦ スキル
              </Button>

              {skillMenuOpen && (
                <div className="abyss-panel p-2">
                  <SkillList
                    skills={player.skills}
                    currentMp={battleState.playerMp}
                    disabled={!isPlayerTurn}
                    onSelect={(id) => { setSkillMenuOpen(false); sendAction({ type: 'skill', skillId: id }) }}
                  />
                </div>
              )}

              <Button variant="ghost" disabled={!isPlayerTurn} onClick={() => sendAction({ type: 'item' })}>
                🎒 アイテム
              </Button>
              <Button variant="danger" disabled={!isPlayerTurn} onClick={() => sendAction({ type: 'escape' })}>
                ↩ 逃げる
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
