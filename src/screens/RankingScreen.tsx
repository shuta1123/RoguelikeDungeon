import { useEffect, useState } from 'react'
import RankingTable from '../components/ranking/RankingTable'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { fetchRanking } from '../api/ranking'
import type { RankingEntry } from '../types/ranking'
import { useGameStore } from '../stores/gameStore'

export default function RankingScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const [period, setPeriod] = useState<'daily' | 'all-time'>('all-time')
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetchRanking(period)
      .then((res) => setRankings(res.rankings))
      .finally(() => setIsLoading(false))
  }, [period])

  return (
    <div className="flex flex-col h-screen bg-abyss-bg animate-fade-in">
      <header className="flex items-center justify-between px-6 py-3 border-b border-abyss-purple/30">
        <button onClick={() => setScreen('title')} className="text-abyss-text-muted hover:text-abyss-gold transition-colors text-sm">
          ← タイトルへ
        </button>
        <h1 className="abyss-title text-2xl font-bold text-abyss-gold">RANKING</h1>
        <div />
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex gap-2">
            <Button
              variant={period === 'all-time' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setPeriod('all-time')}
            >
              全期間
            </Button>
            <Button
              variant={period === 'daily' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setPeriod('daily')}
            >
              デイリー
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner message="読み込み中..." />
            </div>
          ) : (
            <div className="abyss-panel p-4">
              <RankingTable rankings={rankings} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
