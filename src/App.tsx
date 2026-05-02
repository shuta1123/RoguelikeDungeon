import TitleScreen from './screens/TitleScreen'
import LobbyScreen from './screens/LobbyScreen'
import GameScreen from './screens/GameScreen'
import BattleScreen from './screens/BattleScreen'
import ResultScreen from './screens/ResultScreen'
import RankingScreen from './screens/RankingScreen'
import { useGameStore } from './stores/gameStore'

export default function App() {
  const screen = useGameStore((s) => s.currentScreen)

  return (
    <div className="w-screen h-screen overflow-hidden bg-abyss-bg font-mono">
      {screen === 'title' && <TitleScreen />}
      {screen === 'lobby' && <LobbyScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'battle' && <BattleScreen />}
      {screen === 'result' && <ResultScreen />}
      {screen === 'ranking' && <RankingScreen />}
    </div>
  )
}
