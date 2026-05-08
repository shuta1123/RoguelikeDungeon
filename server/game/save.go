package game

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

type SaveData struct {
	RunID     string            `json:"runId"`
	Player    interface{}       `json:"player"`
	Map       interface{}       `json:"map"`
	Monsters  interface{}       `json:"monsters"`
	Items     interface{}       `json:"items"`
	SavedAt   string            `json:"savedAt"`
}

const savesDir = "saves"

func savePath(userID string) string {
	return filepath.Join(savesDir, fmt.Sprintf("%s.json", userID))
}

func SaveRun(userID string, run *RunState) error {
	if err := os.MkdirAll(savesDir, 0755); err != nil {
		return err
	}
	data := SaveData{
		RunID:    run.RunID,
		Player:   run.Player,
		Map:      run.Map,
		Monsters: run.Monsters,
		Items:    run.Items,
		SavedAt:  time.Now().Format(time.RFC3339),
	}
	b, err := json.Marshal(data)
	if err != nil {
		return err
	}
	return os.WriteFile(savePath(userID), b, 0644)
}

func LoadRun(userID string) (*RunState, string, error) {
	b, err := os.ReadFile(savePath(userID))
	if err != nil {
		return nil, "", err
	}

	// まず SavedAt だけ取り出す
	var meta struct {
		RunID   string `json:"runId"`
		SavedAt string `json:"savedAt"`
	}
	if err := json.Unmarshal(b, &meta); err != nil {
		return nil, "", err
	}

	// RunState として復元
	var raw struct {
		RunID    string          `json:"runId"`
		Player   json.RawMessage `json:"player"`
		Map      json.RawMessage `json:"map"`
		Monsters json.RawMessage `json:"monsters"`
		Items    json.RawMessage `json:"items"`
	}
	if err := json.Unmarshal(b, &raw); err != nil {
		return nil, "", err
	}

	run := &RunState{RunID: raw.RunID}
	if err := json.Unmarshal(raw.Player, &run.Player); err != nil {
		return nil, "", err
	}
	if err := json.Unmarshal(raw.Map, &run.Map); err != nil {
		return nil, "", err
	}
	if err := json.Unmarshal(raw.Monsters, &run.Monsters); err != nil {
		return nil, "", err
	}
	if err := json.Unmarshal(raw.Items, &run.Items); err != nil {
		return nil, "", err
	}

	return run, meta.SavedAt, nil
}

func HasSave(userID string) bool {
	_, err := os.Stat(savePath(userID))
	return err == nil
}

func DeleteSave(userID string) {
	os.Remove(savePath(userID))
}
