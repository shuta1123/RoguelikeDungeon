import Button from '../components/common/Button'
import { useGameStore } from '../stores/gameStore'

export default function TitleScreen() {
  const setScreen = useGameStore((s) => s.setScreen)

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-abyss-bg relative overflow-hidden animate-fade-in">
      {/* background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-abyss-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-abyss-red/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center space-y-8">
        <div className="space-y-2">
          <p className="text-abyss-text-muted text-sm tracking-widest uppercase">Deep Dungeon RPG</p>
          <h1 className="abyss-title text-6xl font-bold text-abyss-gold tracking-wider">
            ABYSSAL<br />ECHOES
          </h1>
          <p className="text-abyss-purple-light text-sm tracking-widest">— 深淵は囁く —</p>
        </div>

        <div className="flex flex-col items-center gap-3 pt-4">
          <Button size="lg" variant="primary" className="w-48" onClick={() => setScreen('lobby')}>
            ▶ 冒険を始める
          </Button>
          <Button size="md" variant="secondary" className="w-48" onClick={() => setScreen('ranking')}>
            ◈ ランキング
          </Button>
        </div>

        <p className="text-abyss-text-dim text-xs mt-8">WASD / 矢印キー で移動</p>
      </div>
    </div>
  )
}
