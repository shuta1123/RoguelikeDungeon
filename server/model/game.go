package model

// --- 共通 ---

type Position struct {
	X int `json:"x"`
	Y int `json:"y"`
}

// --- スキル・装備 ---

type Skill struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	MPCost      int    `json:"mpCost"`
	Type        string `json:"type"` // "active" | "passive"
}

type EquipStats struct {
	ATK int `json:"atk,omitempty"`
	DEF int `json:"def,omitempty"`
	AGI int `json:"agi,omitempty"`
	LUK int `json:"luk,omitempty"`
	HP  int `json:"hp,omitempty"`
	MP  int `json:"mp,omitempty"`
}

type EquipItem struct {
	ID    string     `json:"id"`
	Name  string     `json:"name"`
	Type  string     `json:"type"` // "weapon" | "armor" | "accessory"
	Stats EquipStats `json:"stats"`
}

type Equipment struct {
	Weapon    *EquipItem `json:"weapon,omitempty"`
	Armor     *EquipItem `json:"armor,omitempty"`
	Accessory *EquipItem `json:"accessory,omitempty"`
}

type StatusEffect struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Duration int    `json:"duration"`
	Type     string `json:"type"` // "buff" | "debuff"
	Icon     string `json:"icon"`
}

// --- プレイヤー ---

type JobClass string

const (
	JobWarrior   JobClass = "warrior"
	JobMage      JobClass = "mage"
	JobRogue     JobClass = "rogue"
	JobSummoner  JobClass = "summoner"
	JobAlchemist JobClass = "alchemist"
)

type Player struct {
	ID            string         `json:"id"`
	Name          string         `json:"name"`
	JobClass      JobClass       `json:"jobClass"`
	Level         int            `json:"level"`
	HP            int            `json:"hp"`
	MaxHP         int            `json:"maxHp"`
	MP            int            `json:"mp"`
	MaxMP         int            `json:"maxMp"`
	ATK           int            `json:"atk"`
	DEF           int            `json:"def"`
	AGI           int            `json:"agi"`
	LUK           int            `json:"luk"`
	Skills        []Skill        `json:"skills"`
	Equipment     Equipment      `json:"equipment"`
	Gold          int            `json:"gold"`
	Floor         int            `json:"floor"`
	StatusEffects []StatusEffect `json:"statusEffects"`
	EXP           int            `json:"exp"`
	NextLevelEXP  int            `json:"nextLevelExp"`
}

// --- アイテム ---

type Item struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Type        string `json:"type"` // "consumable" | "weapon" | "armor" | "accessory" | "key"
	Effect      string `json:"effect,omitempty"`
	Value       int    `json:"value"`
}

// --- モンスター ---

type MonsterRarity string

const (
	RarityCommon   MonsterRarity = "common"
	RarityUncommon MonsterRarity = "uncommon"
	RarityRare     MonsterRarity = "rare"
	RarityBoss     MonsterRarity = "boss"
)

type Monster struct {
	ID            string        `json:"id"`
	Name          string        `json:"name"`
	HP            int           `json:"hp"`
	MaxHP         int           `json:"maxHp"`
	ATK           int           `json:"atk"`
	DEF           int           `json:"def"`
	AGI           int           `json:"agi"`
	Level         int           `json:"level"`
	Rarity        MonsterRarity `json:"rarity"`
	Skills        []string      `json:"skills"`
	StatusEffects []string      `json:"statusEffects"`
	GoldDrop      int           `json:"goldDrop"`
	EXPDrop       int           `json:"expDrop"`
}

// --- ダンジョン ---

type CellType string

const (
	CellWall    CellType = "wall"
	CellFloor   CellType = "floor"
	CellPlayer  CellType = "player"
	CellMonster CellType = "monster"
	CellItem    CellType = "item"
	CellStairs  CellType = "stairs"
	CellSpecial CellType = "special"
	CellDark    CellType = "dark"
)

type Cell struct {
	X        int      `json:"x"`
	Y        int      `json:"y"`
	Type     CellType `json:"type"`
	Visible  bool     `json:"visible"`
	Explored bool     `json:"explored"`
	MonsterID string  `json:"monsterId,omitempty"`
	ItemID   string   `json:"itemId,omitempty"`
}

type SpecialRoom struct {
	ID       string   `json:"id"`
	Type     string   `json:"type"` // "shop" | "treasure" | "shrine" | "boss"
	Position Position `json:"position"`
}

type DungeonMap struct {
	Floor        int           `json:"floor"`
	Seed         string        `json:"seed"`
	Width        int           `json:"width"`
	Height       int           `json:"height"`
	Cells        [][]Cell      `json:"cells"`
	PlayerPos    Position      `json:"playerPos"`
	StairsPos    Position      `json:"stairsPos"`
	SpecialRooms []SpecialRoom `json:"specialRooms"`
}

// --- 戦闘 ---

type BattlePhase string

const (
	PhasePlayerTurn BattlePhase = "player_turn"
	PhaseEnemyTurn  BattlePhase = "enemy_turn"
	PhaseWin        BattlePhase = "win"
	PhaseLose       BattlePhase = "lose"
	PhaseEscaped    BattlePhase = "escaped"
)

type BattleLog struct {
	ID      string `json:"id"`
	Message string `json:"message"`
	Type    string `json:"type"` // "attack"|"skill"|"synergy"|"item"|"miss"|"critical"|"status"|"system"
	Damage  int    `json:"damage,omitempty"`
}

type BattleState struct {
	IsActive         bool        `json:"isActive"`
	Turn             int         `json:"turn"`
	Phase            BattlePhase `json:"phase"`
	Monster          Monster     `json:"monster"`
	PlayerHP         int         `json:"playerHp"`
	PlayerMP         int         `json:"playerMp"`
	Log              []BattleLog `json:"log"`
	AvailableActions []string    `json:"availableActions"`
	SynergyActive    *string     `json:"synergyActive"`
}

// --- ランキング ---

type RankingEntry struct {
	Rank       int    `json:"rank"`
	PlayerName string `json:"playerName"`
	JobClass   string `json:"jobClass"`
	Floor      int    `json:"floor"`
	Score      int    `json:"score"`
	KilledBy   string `json:"killedBy,omitempty"`
	CreatedAt  string `json:"createdAt"`
}

// --- 亡霊 ---

type Ghost struct {
	ID           string `json:"id"`
	PlayerName   string `json:"playerName"`
	JobClass     string `json:"jobClass"`
	Floor        int    `json:"floor"`
	CauseOfDeath string `json:"causeOfDeath"`
	Timestamp    string `json:"timestamp"`
}

// --- メタ進行 ---

type MetaUpgrade struct {
	Key          string `json:"key"`
	Name         string `json:"name"`
	Description  string `json:"description"`
	CurrentLevel int    `json:"currentLevel"`
	MaxLevel     int    `json:"maxLevel"`
	Cost         int    `json:"cost"`
	Effect       string `json:"effect"`
}

type PlayerMeta struct {
	SoulFragments int           `json:"soulFragments"`
	Upgrades      []MetaUpgrade `json:"upgrades"`
}

// --- 認証 ---

type AuthUser struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

type AuthResponse struct {
	Token string   `json:"token"`
	User  AuthUser `json:"user"`
}
