import { useEffect, useState } from 'react'
import type { JobClass } from '../types/player'
import ClassSelect from '../components/lobby/ClassSelect'
import MetaUpgrade from '../components/lobby/MetaUpgrade'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { usePlayerStore } from '../stores/playerStore'
import { useDungeonStore } from '../stores/dungeonStore'
import { useGameStore } from '../stores/gameStore'

export default function LobbyScreen() {
  const [selectedClass, setSelectedClass] = useState<JobClass>('warrior')
  const [tab, setTab] = useState<'class' | 'upgrade'>('class')

  const { meta, loadMeta, buyUpgrade, isLoading: metaLoading } = usePlayerStore()
  const { startRun, isLoading: dungeonLoading, error: dungeonError } = useDungeonStore()
  const setScreen = useGameStore((s) => s.setScreen)

  useEffect(() => {
    loadMeta()
  }, [loadMeta])

  return (
    <div className="flex flex-col h-screen bg-abyss-bg animate-fade-in">
      <header className="flex items-center justify-between px-6 py-3 border-b border-abyss-purple/30">
        <button onClick={() => setScreen('title')} className="text-abyss-text-muted hover:text-abyss-gold transition-colors text-sm">
          ← タイトルへ
        </button>
        <h1 className="abyss-title text-2xl font-bold text-abyss-gold">ABYSSAL ECHOES</h1>
        <div className="text-abyss-gold text-sm">✦ {meta?.soulFragments ?? 0}</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 border-r border-abyss-purple/30 p-4 space-y-2">
          <button
            onClick={() => setTab('class')}
            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${tab === 'class' ? 'bg-abyss-gold/20 text-abyss-gold' : 'text-abyss-text-muted hover:text-white'}`}
          >
            ⚔ 職業選択
          </button>
          <button
            onClick={() => setTab('upgrade')}
            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${tab === 'upgrade' ? 'bg-abyss-gold/20 text-abyss-gold' : 'text-abyss-text-muted hover:text-white'}`}
          >
            ✦ 永続強化
          </button>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          {tab === 'class' && (
            <div className="max-w-lg space-y-4">
              <h2 className="text-abyss-gold-light font-bold text-lg">職業を選択</h2>
              <ClassSelect selected={selectedClass} onSelect={setSelectedClass} />
              <Button
                size="lg"
                variant="primary"
                className="w-full mt-4"
                disabled={dungeonLoading}
                onClick={() => startRun(selectedClass)}
              >
                {dungeonLoading ? <LoadingSpinner size="sm" /> : '▶ 冒険を開始する'}
              </Button>
              {dungeonError && (
                <p className="text-red-400 text-sm text-center mt-2">{dungeonError}</p>
              )}
            </div>
          )}

          {tab === 'upgrade' && (
            <div className="max-w-lg space-y-4">
              <h2 className="text-abyss-gold-light font-bold text-lg">永続強化</h2>
              {metaLoading && !meta ? (
                <LoadingSpinner message="読み込み中..." />
              ) : meta ? (
                <MetaUpgrade
                  upgrades={meta.upgrades}
                  soulFragments={meta.soulFragments}
                  onPurchase={buyUpgrade}
                  isLoading={metaLoading}
                />
              ) : null}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
