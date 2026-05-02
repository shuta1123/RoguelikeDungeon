// TODO: [API] 実際はGoのBSPアルゴリズムが生成する
// このモックはGoが返すレスポンスの形を模倣したもの
import type { DungeonMap, Cell } from '../types/dungeon'

function makeCell(x: number, y: number, type: Cell['type'], visible = false, explored = false): Cell {
  return { x, y, type, visible, explored }
}

// 15×15 の簡易マップ。壁(#)と床(.)で構成
// 実際はGoのBSPアルゴリズムが生成する
const RAW_MAP = [
  '#################',
  '#...............#',
  '#.###.#####.###.#',
  '#.#...#...#...#.#',
  '#.#.###.#.###.#.#',
  '#...#...#...#...#',
  '###.#.#####.#.###',
  '#...#...#...#...#',
  '#.#####.#.#####.#',
  '#.#...#...#...#.#',
  '#.#.#.#####.#.#.#',
  '#...#.......#...#',
  '#.###.#####.###.#',
  '#...............#',
  '#################',
]

function buildCells(): Cell[][] {
  return RAW_MAP.map((row, y) =>
    row.split('').map((ch, x) => {
      if (x === 2 && y === 1) return makeCell(x, y, 'player', true, true)
      if (x === 14 && y === 13) return makeCell(x, y, 'stairs', false, false)
      if (x === 8 && y === 7) return { ...makeCell(x, y, 'monster', false, false), monsterId: 'goblin-01' }
      if (x === 5 && y === 5) return makeCell(x, y, 'item', false, false)
      const type: Cell['type'] = ch === '#' ? 'wall' : 'floor'
      const visible = Math.abs(x - 2) <= 2 && Math.abs(y - 1) <= 2
      return makeCell(x, y, type, visible, visible)
    })
  )
}

export const mockDungeonMap: DungeonMap = {
  floor: 1,
  seed: 'mock-seed-001',
  width: 17,
  height: 15,
  cells: buildCells(),
  playerPos: { x: 2, y: 1 },
  stairsPos: { x: 14, y: 13 },
  specialRooms: [],
}
