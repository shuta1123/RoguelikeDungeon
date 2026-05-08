package handler

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"time"

	"github.com/shuta1123/RoguelikeDungeon/server/game"
	"github.com/shuta1123/RoguelikeDungeon/server/model"
	"github.com/shuta1123/RoguelikeDungeon/server/ws"
)

func Handle(c *ws.Client, msg model.InMessage) {
	switch msg.Type {
	case "dungeon/start":
		handleDungeonStart(c, msg.Payload)
	case "dungeon/move":
		handleDungeonMove(c, msg.Payload)
	case "dungeon/descend":
		handleDungeonDescend(c, msg.Payload)
	case "battle/action":
		handleBattleAction(c, msg.Payload)
	case "dungeon/save":
		handleDungeonSave(c, msg.Payload)
	case "dungeon/resume":
		handleDungeonResume(c, msg.Payload)
	case "dungeon/check-save":
		handleCheckSave(c, msg.Payload)
	default:
		c.Send("error", model.ErrorPayload{Message: "unknown message type: " + msg.Type})
	}
}

// --- ダンジョン開始 ---

type dungeonStartPayload struct {
	JobClass model.JobClass `json:"jobClass"`
	UserID   string         `json:"userId"`
	Username string         `json:"username"`
}

type startRunResponse struct {
	RunID  string          `json:"runId"`
	Map    model.DungeonMap `json:"map"`
	Player model.Player    `json:"player"`
}

func handleDungeonStart(c *ws.Client, raw json.RawMessage) {
	var p dungeonStartPayload
	if err := json.Unmarshal(raw, &p); err != nil {
		c.Send("error", model.ErrorPayload{Message: "invalid payload"})
		return
	}
	if p.Username == "" {
		p.Username = "冒険者"
	}
	if p.UserID == "" {
		p.UserID = fmt.Sprintf("u-%d", time.Now().UnixNano())
	}

	runID := fmt.Sprintf("run-%d", time.Now().UnixNano())
	seed := rand.Int63()
	dungeonMap, monsters, items := game.GenerateDungeon(1, seed)
	player := game.NewPlayer(p.UserID, p.Username, p.JobClass)

	run := &game.RunState{
		RunID:    runID,
		Player:   player,
		Map:      dungeonMap,
		Monsters: monsters,
		Items:    items,
	}
	game.Global.Set(run)

	c.Send("dungeon/started", startRunResponse{RunID: runID, Map: dungeonMap, Player: player})
}

// --- 移動 ---

type dungeonMovePayload struct {
	RunID     string `json:"runId"`
	Direction string `json:"direction"`
}

type moveResponse struct {
	Map    model.DungeonMap `json:"map"`
	Player model.Player     `json:"player"`
	Event  any              `json:"event"`
}

func handleDungeonMove(c *ws.Client, raw json.RawMessage) {
	var p dungeonMovePayload
	if err := json.Unmarshal(raw, &p); err != nil {
		c.Send("error", model.ErrorPayload{Message: "invalid payload"})
		return
	}

	run, ok := game.Global.Get(p.RunID)
	if !ok {
		c.Send("error", model.ErrorPayload{Message: "run not found"})
		return
	}

	result, valid := game.Move(run, p.Direction)
	if !valid {
		c.Send("error", model.ErrorPayload{Message: "invalid direction"})
		return
	}

	// 戦闘イベントの場合はバトルを初期化
	if be, ok := result.Event.(game.BattleEvent); ok {
		battle := game.NewBattle(run.Player, be.Monster)
		run.Battle = &battle
		game.Global.Set(run)
	}

	c.Send("dungeon/moved", moveResponse{Map: result.Map, Player: result.Player, Event: result.Event})
}

// --- 階段降下 ---

type dungeonDescendPayload struct {
	RunID string `json:"runId"`
}

type descendResponse struct {
	Map    model.DungeonMap `json:"map"`
	Player model.Player     `json:"player"`
	Floor  int              `json:"floor"`
}

func handleDungeonDescend(c *ws.Client, raw json.RawMessage) {
	var p dungeonDescendPayload
	if err := json.Unmarshal(raw, &p); err != nil {
		c.Send("error", model.ErrorPayload{Message: "invalid payload"})
		return
	}

	run, ok := game.Global.Get(p.RunID)
	if !ok {
		c.Send("error", model.ErrorPayload{Message: "run not found"})
		return
	}

	nextFloor := run.Map.Floor + 1
	run.Player.Floor = nextFloor
	newMap, monsters, items := game.GenerateDungeon(nextFloor, rand.Int63())
	run.Map = newMap
	run.Monsters = monsters
	run.Items = items
	run.Battle = nil
	game.Global.Set(run)

	c.Send("dungeon/descended", descendResponse{Map: newMap, Player: run.Player, Floor: nextFloor})
}

// --- 戦闘アクション ---

type battleActionPayload struct {
	RunID  string `json:"runId"`
	Action struct {
		Type    string `json:"type"`
		SkillID string `json:"skillId,omitempty"`
		ItemID  string `json:"itemId,omitempty"`
	} `json:"action"`
}

type battleResponse struct {
	BattleState model.BattleState `json:"battleState"`
	Log         []model.BattleLog `json:"log"`
}

func handleBattleAction(c *ws.Client, raw json.RawMessage) {
	var p battleActionPayload
	if err := json.Unmarshal(raw, &p); err != nil {
		c.Send("error", model.ErrorPayload{Message: "invalid payload"})
		return
	}

	run, ok := game.Global.Get(p.RunID)
	if !ok || run.Battle == nil {
		c.Send("error", model.ErrorPayload{Message: "no active battle"})
		return
	}

	result := game.ProcessBattleAction(*run.Battle, run.Player, p.Action.Type, p.Action.SkillID)
	run.Battle = &result.State

	// 勝利時：プレイヤー報酬・マップ更新
	if result.State.Phase == model.PhaseWin {
		run.Player.Gold += result.GoldGained
		run.Player.EXP += result.EXPGained
		run.Player.HP = result.State.PlayerHP
		run.Player.MP = result.State.PlayerMP
		game.LevelUpIfNeeded(&run.Player)

		// 倒したモンスターをマップから除去
		for id, m := range run.Monsters {
			if m.ID == run.Battle.Monster.ID {
				pos := findMonsterPos(run.Map, id)
				if pos != nil {
					run.Map.Cells[pos.Y][pos.X] = model.Cell{X: pos.X, Y: pos.Y, Type: model.CellFloor, Explored: true}
				}
				delete(run.Monsters, id)
				break
			}
		}
		run.Battle = nil
	} else if result.State.Phase == model.PhaseLose || result.State.Phase == model.PhaseEscaped {
		run.Player.HP = result.State.PlayerHP
		run.Player.MP = result.State.PlayerMP
		run.Battle = nil
	} else {
		run.Player.HP = result.State.PlayerHP
		run.Player.MP = result.State.PlayerMP
	}

	game.Global.Set(run)
	c.Send("battle/result", battleResponse{BattleState: result.State, Log: result.State.Log})
}

// --- セーブ ---

type savePayload struct {
	RunID  string `json:"runId"`
	UserID string `json:"userId"`
}

func handleDungeonSave(c *ws.Client, raw json.RawMessage) {
	var p savePayload
	if err := json.Unmarshal(raw, &p); err != nil || p.UserID == "" {
		c.Send("error", model.ErrorPayload{Message: "invalid payload"})
		return
	}
	run, ok := game.Global.Get(p.RunID)
	if !ok {
		c.Send("error", model.ErrorPayload{Message: "run not found"})
		return
	}
	if err := game.SaveRun(p.UserID, run); err != nil {
		c.Send("error", model.ErrorPayload{Message: "save failed"})
		return
	}
	c.Send("dungeon/saved", map[string]string{"message": "セーブしました"})
}

// --- セーブ確認 ---

type checkSavePayload struct {
	UserID string `json:"userId"`
}

func handleCheckSave(c *ws.Client, raw json.RawMessage) {
	var p checkSavePayload
	if err := json.Unmarshal(raw, &p); err != nil || p.UserID == "" {
		c.Send("dungeon/save-status", map[string]bool{"exists": false})
		return
	}
	c.Send("dungeon/save-status", map[string]bool{"exists": game.HasSave(p.UserID)})
}

// --- ロード ---

type resumePayload struct {
	UserID string `json:"userId"`
}

func handleDungeonResume(c *ws.Client, raw json.RawMessage) {
	var p resumePayload
	if err := json.Unmarshal(raw, &p); err != nil || p.UserID == "" {
		c.Send("error", model.ErrorPayload{Message: "invalid payload"})
		return
	}
	run, _, err := game.LoadRun(p.UserID)
	if err != nil {
		c.Send("error", model.ErrorPayload{Message: "セーブデータが見つかりません"})
		return
	}
	game.Global.Set(run)
	c.Send("dungeon/started", startRunResponse{RunID: run.RunID, Map: run.Map, Player: run.Player})
}

func findMonsterPos(m model.DungeonMap, monsterID string) *model.Position {
	for y := range m.Cells {
		for x := range m.Cells[y] {
			if m.Cells[y][x].MonsterID == monsterID {
				return &model.Position{X: x, Y: y}
			}
		}
	}
	return nil
}
