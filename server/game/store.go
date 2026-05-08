package game

import (
	"sync"

	"github.com/shuta1123/RoguelikeDungeon/server/model"
)

type RunState struct {
	RunID    string
	Player   model.Player
	Map      model.DungeonMap
	Battle   *model.BattleState
	Monsters map[string]model.Monster // monsterID -> Monster
	Items    map[string]model.Item    // itemID -> Item
}

type Store struct {
	mu   sync.RWMutex
	runs map[string]*RunState
}

var Global = &Store{runs: make(map[string]*RunState)}

func (s *Store) Set(run *RunState) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.runs[run.RunID] = run
}

func (s *Store) Get(runID string) (*RunState, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	r, ok := s.runs[runID]
	return r, ok
}

func (s *Store) Delete(runID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.runs, runID)
}
