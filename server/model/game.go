package model

// --- 共通 ---

type Position struct {
	X int `json:"x"`
	Y int `json:"y"`
}

// --- プレイヤー ---

type JobClass string

const (
	JobWarrior JobClass = "warrior"
	JobMage    JobClass = "mage"
	JobRogue   JobClass = "rogue"
)

type Player struct {
	ID       string   `json:"id"`
	Username string   `json:"username"`
	JobClass JobClass `json:"jobClass"`
	HP       int      `json:"hp"`
	MaxHP    int      `json:"maxHp"`
	MP       int      `json:"mp"`
	MaxMP    int      `json:"maxMp"`
	Attack   int      `json:"attack"`
	Defense  int      `json:"defense"`
	Level    int      `json:"level"`
	Floor    int      `json:"floor"`
	Souls    int      `json:"souls"`
}

// --- ダンジョン ---

type CellType string

const (
	CellFloor   CellType = "floor"
	CellWall    CellType = "wall"
	CellMonster CellType = "monster"
	CellItem    CellType = "item"
	CellStairs  CellType = "stairs"
	CellStart   CellType = "start"
)

type Cell struct {
	Type CellType `json:"type"`
	X    int      `json:"x"`
	Y    int      `json:"y"`
}

type DungeonMap struct {
	Floor     int      `json:"floor"`
	Seed      string   `json:"seed"`
	Width     int      `json:"width"`
	Height    int      `json:"height"`
	Cells     [][]Cell `json:"cells"`
	PlayerPos Position `json:"playerPos"`
}

// --- モンスター ---

type Monster struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	HP      int    `json:"hp"`
	MaxHP   int    `json:"maxHp"`
	Attack  int    `json:"attack"`
	Defense int    `json:"defense"`
	Souls   int    `json:"souls"`
}

// --- アイテム ---

type Item struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Type        string `json:"type"`
	Effect      string `json:"effect"`
	Value       int    `json:"value"`
}

// --- 戦闘 ---

type BattlePhase string

const (
	PhasePlayer  BattlePhase = "player_turn"
	PhaseEnemy   BattlePhase = "enemy_turn"
	PhaseWon     BattlePhase = "won"
	PhaseLost    BattlePhase = "lost"
	PhaseEscaped BattlePhase = "escaped"
)

type BattleLog struct {
	ID      string `json:"id"`
	Message string `json:"message"`
	Type    string `json:"type"` // "player_attack" | "enemy_attack" | "system"
}

type BattleState struct {
	IsActive bool        `json:"isActive"`
	Phase    BattlePhase `json:"phase"`
	Turn     int         `json:"turn"`
	Player   Player      `json:"player"`
	Monster  Monster     `json:"monster"`
	Log      []BattleLog `json:"log"`
}
