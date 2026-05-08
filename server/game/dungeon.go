package game

import (
	"fmt"
	"math/rand"

	"github.com/shuta1123/RoguelikeDungeon/server/model"
)

const (
	mapWidth  = 41
	mapHeight = 31
	minRoom   = 5
)

type rect struct{ x, y, w, h int }

func (r rect) cx() int { return r.x + r.w/2 }
func (r rect) cy() int { return r.y + r.h/2 }

// GenerateDungeon はBSPでダンジョンを生成し、モンスター・アイテムを配置する
func GenerateDungeon(floor int, seed int64) (model.DungeonMap, map[string]model.Monster, map[string]model.Item) {
	rng := rand.New(rand.NewSource(seed))

	// 全マス壁で初期化
	cells := make([][]model.Cell, mapHeight)
	for y := 0; y < mapHeight; y++ {
		cells[y] = make([]model.Cell, mapWidth)
		for x := 0; x < mapWidth; x++ {
			cells[y][x] = model.Cell{X: x, Y: y, Type: model.CellWall}
		}
	}

	// BSP分割
	rooms := bspSplit(rng, rect{1, 1, mapWidth - 2, mapHeight - 2}, 5)

	// 部屋を掘る
	for _, room := range rooms {
		carveRoom(cells, room)
	}

	// 隣接部屋を廊下で接続
	for i := 1; i < len(rooms); i++ {
		connectRooms(cells, rooms[i-1], rooms[i], rng)
	}

	// プレイヤー開始位置（最初の部屋の中心）
	startRoom := rooms[0]
	playerPos := model.Position{X: startRoom.cx(), Y: startRoom.cy()}
	cells[playerPos.Y][playerPos.X] = model.Cell{X: playerPos.X, Y: playerPos.Y, Type: model.CellPlayer, Visible: true, Explored: true}

	// 階段（最後の部屋の中心）
	stairRoom := rooms[len(rooms)-1]
	stairsPos := model.Position{X: stairRoom.cx(), Y: stairRoom.cy()}
	cells[stairsPos.Y][stairsPos.X] = model.Cell{X: stairsPos.X, Y: stairsPos.Y, Type: model.CellStairs}

	// モンスター配置（中間の部屋に1体ずつ）
	monsters := map[string]model.Monster{}
	for i := 1; i < len(rooms)-1; i++ {
		if rng.Float64() < 0.7 {
			m := spawnMonster(floor, rng)
			mid := rooms[i].cx()
			midy := rooms[i].cy()
			// 部屋の中心がプレイヤー・階段と被らなければ配置
			if !(mid == playerPos.X && midy == playerPos.Y) && !(mid == stairsPos.X && midy == stairsPos.Y) {
				m.ID = fmt.Sprintf("m-%d-%d", i, floor)
				monsters[m.ID] = m
				cells[midy][mid] = model.Cell{X: mid, Y: midy, Type: model.CellMonster, MonsterID: m.ID}
			}
		}
	}

	// アイテム配置（ランダムな床に数個）
	items := map[string]model.Item{}
	itemCount := 1 + rng.Intn(3)
	placed := 0
	for placed < itemCount {
		ri := 1 + rng.Intn(len(rooms)-2)
		ix := rooms[ri].x + 1 + rng.Intn(rooms[ri].w-2)
		iy := rooms[ri].y + 1 + rng.Intn(rooms[ri].h-2)
		if cells[iy][ix].Type == model.CellFloor {
			item := spawnItem(floor, rng)
			item.ID = fmt.Sprintf("i-%d-%d", placed, floor)
			items[item.ID] = item
			cells[iy][ix] = model.Cell{X: ix, Y: iy, Type: model.CellItem, ItemID: item.ID}
			placed++
		}
	}

	// 初期FOV適用
	applyFOV(cells, playerPos, 4)

	return model.DungeonMap{
		Floor:        floor,
		Seed:         fmt.Sprintf("seed-%d-%d", floor, seed),
		Width:        mapWidth,
		Height:       mapHeight,
		Cells:        cells,
		PlayerPos:    playerPos,
		StairsPos:    stairsPos,
		SpecialRooms: []model.SpecialRoom{},
	}, monsters, items
}

// --- BSP ---

func bspSplit(rng *rand.Rand, area rect, depth int) []rect {
	if depth == 0 || area.w < minRoom*2+2 && area.h < minRoom*2+2 {
		return []rect{trimToRoom(rng, area)}
	}

	splitH := area.h >= area.w
	if area.w >= minRoom*2+2 && area.h >= minRoom*2+2 {
		splitH = rng.Intn(2) == 0
	} else if area.w >= minRoom*2+2 {
		splitH = false
	}

	var left, right rect
	if splitH {
		split := area.h/2 + rng.Intn(area.h/4) - area.h/8
		if split < minRoom+1 {
			split = minRoom + 1
		}
		left = rect{area.x, area.y, area.w, split}
		right = rect{area.x, area.y + split, area.w, area.h - split}
	} else {
		split := area.w/2 + rng.Intn(area.w/4) - area.w/8
		if split < minRoom+1 {
			split = minRoom + 1
		}
		left = rect{area.x, area.y, split, area.h}
		right = rect{area.x + split, area.y, area.w - split, area.h}
	}

	return append(bspSplit(rng, left, depth-1), bspSplit(rng, right, depth-1)...)
}

func trimToRoom(rng *rand.Rand, area rect) rect {
	maxW := area.w - 2
	maxH := area.h - 2
	if maxW < minRoom {
		maxW = minRoom
	}
	if maxH < minRoom {
		maxH = minRoom
	}
	w := minRoom + rng.Intn(max(1, maxW-minRoom+1))
	h := minRoom + rng.Intn(max(1, maxH-minRoom+1))
	xRoom := area.w - w
	yRoom := area.h - h
	x := area.x
	y := area.y
	if xRoom > 0 {
		x += rng.Intn(xRoom)
	}
	if yRoom > 0 {
		y += rng.Intn(yRoom)
	}
	return rect{x, y, w, h}
}

func carveRoom(cells [][]model.Cell, r rect) {
	for y := r.y; y < r.y+r.h; y++ {
		for x := r.x; x < r.x+r.w; x++ {
			if y > 0 && y < mapHeight-1 && x > 0 && x < mapWidth-1 {
				cells[y][x] = model.Cell{X: x, Y: y, Type: model.CellFloor}
			}
		}
	}
}

func connectRooms(cells [][]model.Cell, a, b rect, rng *rand.Rand) {
	ax, ay := a.cx(), a.cy()
	bx, by := b.cx(), b.cy()
	// L字廊下（水平→垂直 or 垂直→水平）
	if rng.Intn(2) == 0 {
		carveH(cells, ay, ax, bx)
		carveV(cells, bx, ay, by)
	} else {
		carveV(cells, ax, ay, by)
		carveH(cells, by, ax, bx)
	}
}

func carveH(cells [][]model.Cell, y, x1, x2 int) {
	if x1 > x2 {
		x1, x2 = x2, x1
	}
	for x := x1; x <= x2; x++ {
		if cells[y][x].Type == model.CellWall {
			cells[y][x] = model.Cell{X: x, Y: y, Type: model.CellFloor}
		}
	}
}

func carveV(cells [][]model.Cell, x, y1, y2 int) {
	if y1 > y2 {
		y1, y2 = y2, y1
	}
	for y := y1; y <= y2; y++ {
		if cells[y][x].Type == model.CellWall {
			cells[y][x] = model.Cell{X: x, Y: y, Type: model.CellFloor}
		}
	}
}

// --- FOV (シャドウキャスティング簡易版) ---

func applyFOV(cells [][]model.Cell, pos model.Position, radius int) {
	// 一旦すべてvisible=falseにする（探索済みは維持）
	for y := range cells {
		for x := range cells[y] {
			cells[y][x].Visible = false
		}
	}
	// 半径内をshadowcastingなしの簡易円形FOVで可視化
	for dy := -radius; dy <= radius; dy++ {
		for dx := -radius; dx <= radius; dx++ {
			if dx*dx+dy*dy > radius*radius {
				continue
			}
			nx, ny := pos.X+dx, pos.Y+dy
			if ny < 0 || ny >= mapHeight || nx < 0 || nx >= mapWidth {
				continue
			}
			if hasLineOfSight(cells, pos.X, pos.Y, nx, ny) {
				cells[ny][nx].Visible = true
				cells[ny][nx].Explored = true
			}
		}
	}
}

// Bresenhamの直線アルゴリズムで視線チェック
func hasLineOfSight(cells [][]model.Cell, x0, y0, x1, y1 int) bool {
	dx := abs(x1 - x0)
	dy := abs(y1 - y0)
	sx := 1
	if x0 > x1 {
		sx = -1
	}
	sy := 1
	if y0 > y1 {
		sy = -1
	}
	err := dx - dy

	for {
		if x0 == x1 && y0 == y1 {
			return true
		}
		if cells[y0][x0].Type == model.CellWall && !(x0 == x1 && y0 == y1) {
			return false
		}
		e2 := 2 * err
		if e2 > -dy {
			err -= dy
			x0 += sx
		}
		if e2 < dx {
			err += dx
			y0 += sy
		}
	}
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

// --- モンスターテーブル ---

type monsterTemplate struct {
	name   string
	hp     int
	atk    int
	def    int
	agi    int
	rarity model.MonsterRarity
	gold   int
	exp    int
}

func scaledTemplates(floor int) []monsterTemplate {
	s := 1 + (floor-1)/3 // 3フロアごとにスケール
	return []monsterTemplate{
		{"ゴブリン", 25 + s*5, 6 + s, 2 + s, 5, model.RarityCommon, 10 + s*2, 20 + s*5},
		{"スライム", 20 + s*4, 4 + s, 4 + s, 3, model.RarityCommon, 8 + s, 15 + s*4},
		{"コウモリ", 18 + s*3, 5 + s, 1, 8 + s, model.RarityCommon, 8 + s, 18 + s*3},
		{"スケルトン", 30 + s*6, 8 + s*2, 5 + s, 4, model.RarityUncommon, 15 + s*3, 30 + s*6},
	}
}

func spawnMonster(floor int, rng *rand.Rand) model.Monster {
	tmpl := scaledTemplates(floor)
	t := tmpl[rng.Intn(len(tmpl))]
	return model.Monster{
		Name:          t.name,
		HP:            t.hp,
		MaxHP:         t.hp,
		ATK:           t.atk,
		DEF:           t.def,
		AGI:           t.agi,
		Level:         floor,
		Rarity:        t.rarity,
		Skills:        []string{},
		StatusEffects: []string{},
		GoldDrop:      t.gold,
		EXPDrop:       t.exp,
	}
}

// --- アイテムテーブル ---

func spawnItem(floor int, rng *rand.Rand) model.Item {
	items := []model.Item{
		{Name: "回復薬", Description: "HPを30回復する。", Type: "consumable", Effect: "heal_30", Value: 20},
		{Name: "エーテル", Description: "MPを15回復する。", Type: "consumable", Effect: "mp_15", Value: 25},
		{Name: "強化薬", Description: "1戦闘中ATKが上昇する。", Type: "consumable", Effect: "atk_up", Value: 40},
	}
	if floor >= 3 {
		items = append(items, model.Item{Name: "大回復薬", Description: "HPを60回復する。", Type: "consumable", Effect: "heal_60", Value: 60})
	}
	return items[rng.Intn(len(items))]
}
