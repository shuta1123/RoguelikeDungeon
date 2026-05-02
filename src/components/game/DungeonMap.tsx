import type { DungeonMap as DungeonMapType } from '../../types/dungeon'

interface Props {
  map: DungeonMapType
}

const CELL_ICONS: Record<string, string> = {
  wall: '#',
  floor: '.',
  player: '@',
  monster: 'M',
  item: '!',
  stairs: '▼',
  special: 'S',
  dark: ' ',
}

const CELL_COLORS: Record<string, string> = {
  wall: 'text-abyss-purple/60',
  floor: 'text-white/20',
  player: 'text-abyss-gold font-bold',
  monster: 'text-red-500 font-bold',
  item: 'text-cyan-400 font-bold',
  stairs: 'text-abyss-gold-light',
  special: 'text-purple-400',
  dark: 'text-transparent',
}

export default function DungeonMap({ map }: Props) {
  return (
    <div className="abyss-panel p-2 overflow-auto">
      <div className="text-xs text-abyss-text-muted mb-1">B{map.floor}F — {map.seed}</div>
      <div
        className="font-mono text-sm leading-none select-none"
        style={{ letterSpacing: '0.05em' }}
      >
        {map.cells.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell) => {
              if (!cell.visible && !cell.explored) {
                return <span key={cell.x} className="text-transparent w-[1ch]"> </span>
              }
              const dim = !cell.visible && cell.explored
              const icon = CELL_ICONS[cell.type] ?? '?'
              const color = CELL_COLORS[cell.type] ?? 'text-white'
              return (
                <span
                  key={cell.x}
                  className={`${color} ${dim ? 'opacity-30' : ''} w-[1ch] inline-block text-center`}
                >
                  {icon}
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
