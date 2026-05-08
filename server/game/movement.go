package game

import "github.com/shuta1123/RoguelikeDungeon/server/model"

type MoveResult struct {
	Map    model.DungeonMap
	Player model.Player
	Event  any // nil | BattleEvent | ItemEvent | StairsEvent
}

type BattleEvent struct {
	Type    string       `json:"type"`
	Monster model.Monster `json:"monster"`
}

type ItemEvent struct {
	Type string     `json:"type"`
	Item model.Item `json:"item"`
}

type StairsEvent struct {
	Type string `json:"type"`
}

func Move(run *RunState, direction string) (MoveResult, bool) {
	dx, dy := directionDelta(direction)
	if dx == 0 && dy == 0 {
		return MoveResult{}, false
	}

	nx := run.Map.PlayerPos.X + dx
	ny := run.Map.PlayerPos.Y + dy

	if ny < 0 || ny >= run.Map.Height || nx < 0 || nx >= run.Map.Width {
		return MoveResult{Map: run.Map, Player: run.Player, Event: nil}, true
	}

	target := run.Map.Cells[ny][nx]

	switch target.Type {
	case model.CellWall:
		return MoveResult{Map: run.Map, Player: run.Player, Event: nil}, true

	case model.CellMonster:
		m, ok := run.Monsters[target.MonsterID]
		if !ok {
			return MoveResult{Map: run.Map, Player: run.Player, Event: nil}, true
		}
		return MoveResult{
			Map:    run.Map,
			Player: run.Player,
			Event:  BattleEvent{Type: "battle", Monster: m},
		}, true

	case model.CellItem:
		item, ok := run.Items[target.ItemID]
		if !ok {
			break
		}
		// マップからアイテムを除去
		run.Map.Cells[ny][nx] = model.Cell{X: nx, Y: ny, Type: model.CellFloor, Explored: target.Explored}
		delete(run.Items, target.ItemID)
		doMove(run, nx, ny)
		return MoveResult{
			Map:    run.Map,
			Player: run.Player,
			Event:  ItemEvent{Type: "item", Item: item},
		}, true

	case model.CellStairs:
		doMove(run, nx, ny)
		return MoveResult{
			Map:    run.Map,
			Player: run.Player,
			Event:  StairsEvent{Type: "stairs"},
		}, true
	}

	doMove(run, nx, ny)
	return MoveResult{Map: run.Map, Player: run.Player, Event: nil}, true
}

func doMove(run *RunState, nx, ny int) {
	prev := run.Map.PlayerPos
	run.Map.Cells[prev.Y][prev.X] = model.Cell{
		X: prev.X, Y: prev.Y,
		Type:     model.CellFloor,
		Explored: run.Map.Cells[prev.Y][prev.X].Explored,
	}
	run.Map.PlayerPos = model.Position{X: nx, Y: ny}
	run.Map.Cells[ny][nx] = model.Cell{X: nx, Y: ny, Type: model.CellPlayer, Visible: true, Explored: true}
	applyFOV(run.Map.Cells, run.Map.PlayerPos, 4)
}

func directionDelta(dir string) (int, int) {
	switch dir {
	case "up":
		return 0, -1
	case "down":
		return 0, 1
	case "left":
		return -1, 0
	case "right":
		return 1, 0
	}
	return 0, 0
}
