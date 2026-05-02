import type { JobClass } from '../types/player'
import type { Direction, StartRunResponse, MoveResponse, DescendResponse } from '../types/dungeon'
import { mockDungeonMap } from '../mocks/mockDungeon'
import { mockPlayer } from '../mocks/mockPlayer'
import { mockInitialBattleState } from '../mocks/mockBattle'

// TODO: [API] POST /api/dungeon/start — ここを実際のAPIに置き換える
// ※ マップ生成はGoが行う。フロントは受け取るだけ
// 現在は静的モックデータを使用
export async function startRun(_jobClass: JobClass): Promise<StartRunResponse> {
  await new Promise((r) => setTimeout(r, 400))
  return {
    runId: 'run-mock-001',
    map: { ...mockDungeonMap },
    player: { ...mockPlayer, jobClass: _jobClass },
  }
}

// TODO: [API] POST /api/dungeon/move — ここを実際のAPIに置き換える
// ※ 移動後の状態・モンスター遭遇判定はすべてGoが処理して返す
// 現在は静的モックデータを使用
export async function move(_runId: string, direction: Direction): Promise<MoveResponse> {
  await new Promise((r) => setTimeout(r, 150))

  const map = { ...mockDungeonMap }
  const player = { ...mockPlayer }
  const pos = { ...map.playerPos }

  const delta: Record<Direction, { dx: number; dy: number }> = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
  }
  const { dx, dy } = delta[direction]
  const nx = pos.x + dx
  const ny = pos.y + dy

  if (nx >= 0 && ny >= 0 && ny < map.cells.length && nx < map.cells[0].length) {
    const target = map.cells[ny][nx]
    if (target.type === 'monster') {
      return {
        map,
        player,
        event: { type: 'battle', monster: mockInitialBattleState.monster },
      }
    }
    if (target.type === 'stairs') {
      return { map, player, event: { type: 'stairs' } }
    }
    if (target.type === 'item') {
      return {
        map,
        player,
        event: {
          type: 'item',
          item: { id: 'item-potion-01', name: '回復薬', description: 'HPを30回復する。', type: 'consumable', effect: 'heal_30', value: 20 },
        },
      }
    }
  }

  map.playerPos = { x: nx, y: ny }
  player.floor = map.floor
  return { map, player, event: null }
}

// TODO: [API] POST /api/dungeon/descend — ここを実際のAPIに置き換える
// ※ 次の階のマップ生成もGoが行う
// 現在は静的モックデータを使用
export async function descend(_runId: string): Promise<DescendResponse> {
  await new Promise((r) => setTimeout(r, 400))
  const nextFloor = mockDungeonMap.floor + 1
  return {
    map: { ...mockDungeonMap, floor: nextFloor, seed: `mock-seed-00${nextFloor}` },
    player: { ...mockPlayer, floor: nextFloor },
    floor: nextFloor,
  }
}
