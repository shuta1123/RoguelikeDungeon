package handler

import (
	"encoding/json"
	"log"

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
	default:
		log.Printf("unknown message type: %s", msg.Type)
		c.Send("error", model.ErrorPayload{Message: "unknown message type: " + msg.Type})
	}
}

// --- ダンジョン開始 ---

type dungeonStartPayload struct {
	JobClass model.JobClass `json:"jobClass"`
}

func handleDungeonStart(c *ws.Client, raw json.RawMessage) {
	var p dungeonStartPayload
	if err := json.Unmarshal(raw, &p); err != nil {
		c.Send("error", model.ErrorPayload{Message: "invalid payload"})
		return
	}
	// TODO: ゲームロジック実装後に置き換える
	c.Send("dungeon/started", map[string]string{"status": "not implemented"})
}

// --- 移動 ---

type dungeonMovePayload struct {
	RunID     string `json:"runId"`
	Direction string `json:"direction"`
}

func handleDungeonMove(c *ws.Client, raw json.RawMessage) {
	var p dungeonMovePayload
	if err := json.Unmarshal(raw, &p); err != nil {
		c.Send("error", model.ErrorPayload{Message: "invalid payload"})
		return
	}
	// TODO: ゲームロジック実装後に置き換える
	c.Send("dungeon/moved", map[string]string{"status": "not implemented"})
}

// --- 階段降下 ---

type dungeonDescendPayload struct {
	RunID string `json:"runId"`
}

func handleDungeonDescend(c *ws.Client, raw json.RawMessage) {
	var p dungeonDescendPayload
	if err := json.Unmarshal(raw, &p); err != nil {
		c.Send("error", model.ErrorPayload{Message: "invalid payload"})
		return
	}
	// TODO: ゲームロジック実装後に置き換える
	c.Send("dungeon/descended", map[string]string{"status": "not implemented"})
}

// --- 戦闘アクション ---

type battleActionPayload struct {
	RunID  string `json:"runId"`
	Action struct {
		Type string `json:"type"` // "attack" | "skill" | "item" | "escape"
	} `json:"action"`
}

func handleBattleAction(c *ws.Client, raw json.RawMessage) {
	var p battleActionPayload
	if err := json.Unmarshal(raw, &p); err != nil {
		c.Send("error", model.ErrorPayload{Message: "invalid payload"})
		return
	}
	// TODO: ゲームロジック実装後に置き換える
	c.Send("battle/result", map[string]string{"status": "not implemented"})
}
