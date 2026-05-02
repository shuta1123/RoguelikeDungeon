import { useRef, useEffect } from 'react'
import type { DungeonMap as DungeonMapType, Cell } from '../../types/dungeon'

interface Props {
  map: DungeonMapType
}

const TILE = 24
const VP_W = 21
const VP_H = 17

type TileStyle = { bg: string; border: string; fg: string; glyph: string }

const TILE_STYLE: Record<string, TileStyle> = {
  wall:    { bg: '#16102E', border: '#0D0820', fg: '#3a2f6e', glyph: '' },
  floor:   { bg: '#141414', border: '#1a1a1a', fg: '#2a2a2a', glyph: '' },
  player:  { bg: '#141414', border: '#C9A84C', fg: '#C9A84C', glyph: '@' },
  monster: { bg: '#1a0a0a', border: '#7A1C1C', fg: '#ef4444', glyph: 'M' },
  item:    { bg: '#0a1a1a', border: '#22d3ee', fg: '#22d3ee', glyph: '!' },
  stairs:  { bg: '#1a160a', border: '#E8C97A', fg: '#E8C97A', glyph: '▼' },
  special: { bg: '#100a1a', border: '#a855f7', fg: '#a855f7', glyph: 'S' },
  dark:    { bg: '#0D0D0B', border: '#0D0D0B', fg: '#0D0D0B', glyph: '' },
}

function drawTile(ctx: CanvasRenderingContext2D, cell: Cell, px: number, py: number, dim: boolean) {
  const style = TILE_STYLE[cell.type] ?? TILE_STYLE.floor

  // 背景
  ctx.fillStyle = style.bg
  ctx.fillRect(px, py, TILE, TILE)

  // 壁だけ石畳風のノイズをつける
  if (cell.type === 'wall') {
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    ctx.fillRect(px + 1, py + 1, TILE - 2, TILE - 2)
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fillRect(px + TILE - 2, py, 2, TILE)
    ctx.fillRect(px, py + TILE - 2, TILE, 2)
  }

  // 床に微妙なグリッド感
  if (cell.type === 'floor') {
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 0.5
    ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1)
  }

  // ボーダー（アクティブなセル）
  if (cell.type !== 'wall' && cell.type !== 'floor' && cell.type !== 'dark') {
    ctx.strokeStyle = style.border
    ctx.lineWidth = 1.5
    ctx.strokeRect(px + 1, py + 1, TILE - 2, TILE - 2)
  }

  // グリフ
  if (style.glyph) {
    ctx.font = `bold ${TILE * 0.6}px "JetBrains Mono", monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = dim ? style.fg + '55' : style.fg
    ctx.fillText(style.glyph, px + TILE / 2, py + TILE / 2 + 1)
  }

  // プレイヤーのグロウエフェクト
  if (cell.type === 'player') {
    const grad = ctx.createRadialGradient(px + TILE / 2, py + TILE / 2, 2, px + TILE / 2, py + TILE / 2, TILE)
    grad.addColorStop(0, 'rgba(201,168,76,0.25)')
    grad.addColorStop(1, 'transparent')
    ctx.fillStyle = grad
    ctx.fillRect(px - TILE, py - TILE, TILE * 3, TILE * 3)
  }

  // 探索済みだが視野外 → 暗くオーバーレイ
  if (dim) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(px, py, TILE, TILE)
  }
}

export default function DungeonMap({ map }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { playerPos, cells } = map
    const mapH = cells.length
    const mapW = cells[0]?.length ?? 0

    // ビューポートの左上(タイル座標)
    const vpLeft = Math.max(0, Math.min(playerPos.x - Math.floor(VP_W / 2), mapW - VP_W))
    const vpTop  = Math.max(0, Math.min(playerPos.y - Math.floor(VP_H / 2), mapH - VP_H))

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#0D0D0B'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let row = 0; row < VP_H; row++) {
      for (let col = 0; col < VP_W; col++) {
        const mx = vpLeft + col
        const my = vpTop + row
        if (mx < 0 || my < 0 || my >= mapH || mx >= mapW) continue

        const cell = cells[my][mx]
        const px = col * TILE
        const py = row * TILE

        if (!cell.visible && !cell.explored) {
          ctx.fillStyle = '#0D0D0B'
          ctx.fillRect(px, py, TILE, TILE)
          continue
        }

        drawTile(ctx, cell, px, py, !cell.visible && cell.explored)
      }
    }
  }, [map])

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs text-abyss-text-dim">
        B{map.floor}F — ({map.playerPos.x}, {map.playerPos.y})
      </div>
      <canvas
        ref={canvasRef}
        width={VP_W * TILE}
        height={VP_H * TILE}
        className="border border-abyss-purple/30 rounded"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
