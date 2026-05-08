package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/shuta1123/RoguelikeDungeon/server/model"
)

func respondJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

// --- 簡易ユーザーストア（本番はDB） ---

type userRecord struct {
	ID           string
	Username     string
	PasswordHash string
}

var (
	usersMu sync.RWMutex
	users   = map[string]userRecord{} // username -> record
)

// POST /api/auth/register
func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Username == "" {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid body"})
		return
	}

	usersMu.Lock()
	defer usersMu.Unlock()
	if _, exists := users[body.Username]; exists {
		respondJSON(w, http.StatusConflict, map[string]string{"error": "username already taken"})
		return
	}

	id := fmt.Sprintf("u-%d", time.Now().UnixNano())
	users[body.Username] = userRecord{ID: id, Username: body.Username, PasswordHash: body.Password}
	respondJSON(w, http.StatusCreated, model.AuthResponse{
		Token: fmt.Sprintf("token-%s", id),
		User:  model.AuthUser{ID: id, Username: body.Username},
	})
}

// POST /api/auth/login
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid body"})
		return
	}

	usersMu.RLock()
	u, ok := users[body.Username]
	usersMu.RUnlock()

	if !ok || u.PasswordHash != body.Password {
		respondJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid credentials"})
		return
	}

	respondJSON(w, http.StatusOK, model.AuthResponse{
		Token: fmt.Sprintf("token-%s", u.ID),
		User:  model.AuthUser{ID: u.ID, Username: u.Username},
	})
}

// --- プレイヤーメタ（簡易: ユーザーごとに保持） ---

var (
	metaMu sync.RWMutex
	metas  = map[string]model.PlayerMeta{} // userID -> meta
)

func defaultMeta() model.PlayerMeta {
	return model.PlayerMeta{
		SoulFragments: 0,
		Upgrades: []model.MetaUpgrade{
			{Key: "hp_up", Name: "生命力強化", Description: "最大HPが増加する。", CurrentLevel: 0, MaxLevel: 5, Cost: 30, Effect: "+10 HP"},
			{Key: "atk_up", Name: "攻撃力強化", Description: "攻撃力が増加する。", CurrentLevel: 0, MaxLevel: 5, Cost: 25, Effect: "+2 ATK"},
			{Key: "mp_up", Name: "MP強化", Description: "最大MPが増加する。", CurrentLevel: 0, MaxLevel: 3, Cost: 20, Effect: "+5 MP"},
			{Key: "gold_bonus", Name: "ゴールド強化", Description: "ゴールドの獲得量が増加する。", CurrentLevel: 0, MaxLevel: 3, Cost: 35, Effect: "+15% Gold"},
		},
	}
}

// GET /api/player/meta
func PlayerMetaHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		userID = "anonymous"
	}
	metaMu.RLock()
	meta, ok := metas[userID]
	metaMu.RUnlock()
	if !ok {
		meta = defaultMeta()
	}
	respondJSON(w, http.StatusOK, meta)
}

// POST /api/player/meta/upgrade
func PurchaseUpgradeHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		UpgradeKey string `json:"upgradeKey"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid body"})
		return
	}

	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		userID = "anonymous"
	}

	metaMu.Lock()
	defer metaMu.Unlock()
	meta, ok := metas[userID]
	if !ok {
		meta = defaultMeta()
	}

	for i, u := range meta.Upgrades {
		if u.Key == body.UpgradeKey {
			if u.CurrentLevel >= u.MaxLevel {
				respondJSON(w, http.StatusBadRequest, map[string]string{"error": "already max level"})
				return
			}
			if meta.SoulFragments < u.Cost {
				respondJSON(w, http.StatusBadRequest, map[string]string{"error": "not enough soul fragments"})
				return
			}
			meta.SoulFragments -= u.Cost
			meta.Upgrades[i].CurrentLevel++
			metas[userID] = meta
			respondJSON(w, http.StatusOK, meta)
			return
		}
	}
	respondJSON(w, http.StatusNotFound, map[string]string{"error": "upgrade not found"})
}

// --- ランキング（簡易インメモリ） ---

var (
	rankingMu sync.RWMutex
	rankings  []model.RankingEntry
)

// GET /api/ranking?period=daily|all-time
func RankingHandler(w http.ResponseWriter, r *http.Request) {
	rankingMu.RLock()
	result := make([]model.RankingEntry, len(rankings))
	copy(result, rankings)
	rankingMu.RUnlock()

	for i := range result {
		result[i].Rank = i + 1
	}
	respondJSON(w, http.StatusOK, map[string]any{"rankings": result})
}

// POST /api/ranking (内部用：ゲーム終了時に呼ぶ)
func AddRankingEntry(entry model.RankingEntry) {
	rankingMu.Lock()
	defer rankingMu.Unlock()
	entry.CreatedAt = time.Now().Format(time.RFC3339)
	rankings = append([]model.RankingEntry{entry}, rankings...)
	if len(rankings) > 100 {
		rankings = rankings[:100]
	}
}

// --- 亡霊 ---

var (
	ghostsMu sync.RWMutex
	ghosts   []model.Ghost
)

// GET /api/ghosts?floor=N
func GhostsHandler(w http.ResponseWriter, r *http.Request) {
	floorStr := r.URL.Query().Get("floor")
	ghostsMu.RLock()
	result := []model.Ghost{}
	for _, g := range ghosts {
		if floorStr == "" || fmt.Sprintf("%d", g.Floor) == floorStr {
			result = append(result, g)
		}
	}
	ghostsMu.RUnlock()
	respondJSON(w, http.StatusOK, map[string]any{"ghosts": result})
}

func AddGhost(g model.Ghost) {
	ghostsMu.Lock()
	defer ghostsMu.Unlock()
	g.Timestamp = time.Now().Format(time.RFC3339)
	ghosts = append([]model.Ghost{g}, ghosts...)
	if len(ghosts) > 200 {
		ghosts = ghosts[:200]
	}
}
