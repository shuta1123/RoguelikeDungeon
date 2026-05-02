import type { DungeonMap } from '../../types/dungeon'

interface Props {
  map: DungeonMap
}

const MINI_COLORS: Record<string, string> = {
  wall: '#2A1F5E',
  floor: '#3a3a3a',
  player: '#C9A84C',
  monster: '#cc3333',
  item: '#22d3ee',
  stairs: '#E8C97A',
  special: '#a855f7',
  dark: 'transparent',
}

export default function MiniMap({ map }: Props) {
  const scale = 4

  return (
    <div className="abyss-panel p-2">
      <div className="text-abyss-text-dim text-xs mb-1">ミニマップ</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${map.width}, ${scale}px)`,
          gap: 0,
          lineHeight: 0,
        }}
      >
        {map.cells.flat().map((cell) => (
          <div
            key={`${cell.x}-${cell.y}`}
            style={{
              width: scale,
              height: scale,
              backgroundColor: cell.visible || cell.explored ? (MINI_COLORS[cell.type] ?? '#3a3a3a') : 'transparent',
            }}
          />
        ))}
      </div>
    </div>
  )
}
