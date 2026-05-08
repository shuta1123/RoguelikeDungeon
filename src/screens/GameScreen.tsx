import { useEffect, useState, useCallback } from 'react'
import type { Direction } from '../types/dungeon'
import DungeonMap from '../components/game/DungeonMap'
import PlayerStats from '../components/game/PlayerStats'
import ActionLog from '../components/game/ActionLog'
import MiniMap from '../components/game/MiniMap'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useDungeonStore } from '../stores/dungeonStore'
import { usePlayerStore } from '../stores/playerStore'
import { useBattleStore } from '../stores/battleStore'
import { useGameStore } from '../stores/gameStore'
import type { Monster } from '../types/monster'

const KEY_DIR: Record<string, Direction> = {
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
}

export default function GameScreen() {
  const { currentMap, actionLog, isLoading, move, descend, save, reset, addLog } = useDungeonStore()
  const setScreen = useGameStore((s) => s.setScreen)
  const player = usePlayerStore((s) => s.player)
  const initBattle = useBattleStore((s) => s.initBattle)

  const [stairsModal, setStairsModal] = useState(false)
  const [itemMsg, setItemMsg] = useState<string | null>(null)
  const [quitModal, setQuitModal] = useState(false)

  const handleMove = useCallback(async (dir: Direction) => {
    if (isLoading) return
    const event = await move(dir)
    if (!event) {
      addLog(`${dir} へ移動した。`)
      return
    }
    if (event.type === 'battle') {
      addLog(`${event.monster.name} に遭遇した！`)
      initBattle(event.monster as Monster)
    } else if (event.type === 'stairs') {
      setStairsModal(true)
    } else if (event.type === 'item') {
      addLog(`${event.item.name} を手に入れた！`)
      setItemMsg(`${event.item.name} を手に入れた！`)
      setTimeout(() => setItemMsg(null), 2500)
    } else if (event.type === 'ghost') {
      addLog(`${event.ghost.playerName} の亡霊を見た…`)
    }
  }, [isLoading, move, addLog, initBattle])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const dir = KEY_DIR[e.key]
      if (dir) {
        e.preventDefault()
        handleMove(dir)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleMove])

  if (!currentMap || !player) {
    return (
      <div className="flex items-center justify-center h-screen bg-abyss-bg">
        <LoadingSpinner size="lg" message="ダンジョン生成中..." />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-abyss-bg overflow-hidden animate-fade-in">
      {/* left panel */}
      <aside className="w-52 flex flex-col gap-2 p-2 border-r border-abyss-purple/30">
        <PlayerStats player={player} />
        <MiniMap map={currentMap} />
        <div className="mt-auto flex flex-col gap-1">
          <button
            onClick={async () => { await save(); addLog('セーブした。') }}
            disabled={isLoading}
            className="w-full text-xs text-abyss-text-muted hover:text-abyss-gold border border-abyss-purple/30 hover:border-abyss-gold/50 rounded py-1 transition-colors disabled:opacity-40"
          >
            💾 セーブ
          </button>
          <button
            onClick={() => setQuitModal(true)}
            className="w-full text-xs text-abyss-text-muted hover:text-red-400 border border-abyss-purple/30 hover:border-red-400/50 rounded py-1 transition-colors"
          >
            ✕ やめる
          </button>
          <div className="text-xs text-abyss-text-dim text-center">WASD / 矢印キー</div>
        </div>
      </aside>

      {/* main map */}
      <main className="flex-1 flex items-center justify-center p-4 relative">
        <DungeonMap map={currentMap} />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <LoadingSpinner size="sm" />
          </div>
        )}
        {itemMsg && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-cyan-900/80 border border-cyan-500 text-cyan-200 px-4 py-2 rounded text-sm animate-slide-up">
            {itemMsg}
          </div>
        )}
      </main>

      {/* right panel — action log */}
      <aside className="w-52 p-2 border-l border-abyss-purple/30">
        <ActionLog logs={actionLog} />
      </aside>

      {/* quit modal */}
      <Modal isOpen={quitModal} title="やめる" onClose={() => setQuitModal(false)}>
        <p className="text-abyss-text-muted text-sm mb-4">タイトルに戻りますか？<br />セーブしていない進行は失われます。</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setQuitModal(false)}>戻る</Button>
          <Button variant="primary" onClick={() => { reset(); setScreen('title') }}>やめる</Button>
        </div>
      </Modal>

      {/* stairs modal */}
      <Modal isOpen={stairsModal} title="階段" onClose={() => setStairsModal(false)}>
        <p className="text-abyss-text-muted text-sm mb-4">次の階へ降りますか？</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setStairsModal(false)}>戻る</Button>
          <Button variant="primary" onClick={async () => { setStairsModal(false); await descend() }}>降りる</Button>
        </div>
      </Modal>
    </div>
  )
}
