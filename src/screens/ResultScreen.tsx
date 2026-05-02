import Button from '../components/common/Button'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import { useDungeonStore } from '../stores/dungeonStore'
import { useBattleStore } from '../stores/battleStore'

export default function ResultScreen() {
  const player = usePlayerStore((s) => s.player)
  const floor = useDungeonStore((s) => s.floor)
  const setScreen = useGameStore((s) => s.setScreen)
  const resetDungeon = useDungeonStore((s) => s.reset)
  const resetBattle = useBattleStore((s) => s.reset)
  const resetPlayer = usePlayerStore((s) => s.reset)

  const handleRetry = () => {
    resetDungeon()
    resetBattle()
    resetPlayer()
    setScreen('lobby')
  }

  // mock result values
  const soulFragmentsEarned = Math.floor((floor * 10) + (player?.gold ?? 0) / 5)
  const score = floor * 1000 + (player?.exp ?? 0) * 2

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-abyss-bg animate-fade-in">
      <div className="abyss-panel p-8 w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-abyss-red">ゲームオーバー</h1>
        <p className="text-abyss-text-muted text-sm">深淵に飲み込まれた…</p>

        <div className="space-y-3 text-sm border-t border-abyss-purple/30 pt-4">
          <div className="flex justify-between">
            <span className="text-abyss-text-muted">到達階層</span>
            <span className="text-white font-bold">B{floor}F</span>
          </div>
          <div className="flex justify-between">
            <span className="text-abyss-text-muted">スコア</span>
            <span className="text-abyss-gold font-bold">{score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-abyss-text-muted">獲得ゴールド</span>
            <span className="text-yellow-300">{player?.gold ?? 0}</span>
          </div>
          <div className="flex justify-between border-t border-abyss-purple/30 pt-3">
            <span className="text-abyss-text-muted">獲得 魂の欠片</span>
            <span className="text-abyss-gold font-bold">✦ +{soulFragmentsEarned}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button variant="primary" size="lg" className="w-full" onClick={handleRetry}>
            ▶ もう一度挑戦
          </Button>
          <Button variant="ghost" onClick={() => setScreen('ranking')}>
            ◈ ランキングを見る
          </Button>
          <Button variant="ghost" onClick={() => setScreen('title')}>
            タイトルへ戻る
          </Button>
        </div>
      </div>
    </div>
  )
}
