package game

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/shuta1123/RoguelikeDungeon/server/model"
)

func NewBattle(player model.Player, monster model.Monster) model.BattleState {
	return model.BattleState{
		IsActive:         true,
		Turn:             1,
		Phase:            model.PhasePlayerTurn,
		Monster:          monster,
		PlayerHP:         player.HP,
		PlayerMP:         player.MP,
		Log:              []model.BattleLog{{ID: logID(), Message: fmt.Sprintf("%s が現れた！", monster.Name), Type: "system"}},
		AvailableActions: []string{"attack", "skill", "item", "escape"},
		SynergyActive:    nil,
	}
}

type BattleResult struct {
	State      model.BattleState
	GoldGained int
	EXPGained  int
}

func ProcessBattleAction(state model.BattleState, player model.Player, actionType, skillID string) BattleResult {
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	logs := []model.BattleLog{}

	switch actionType {
	case "escape":
		// AGI差で成功率決定
		chance := 0.5 + float64(player.AGI-state.Monster.AGI)*0.05
		if chance < 0.2 {
			chance = 0.2
		}
		if rng.Float64() < chance {
			state.Phase = model.PhaseEscaped
			state.IsActive = false
			logs = append(logs, model.BattleLog{ID: logID(), Message: "うまく逃げ出した！", Type: "system"})
		} else {
			logs = append(logs, model.BattleLog{ID: logID(), Message: "逃げられなかった！", Type: "system"})
			logs = append(logs, enemyAttack(rng, &state, player)...)
		}

	case "skill":
		logs = append(logs, playerSkillAttack(rng, &state, player, skillID)...)
		if state.Monster.HP > 0 {
			logs = append(logs, enemyAttack(rng, &state, player)...)
		}

	default: // "attack"
		logs = append(logs, playerAttack(rng, &state, player)...)
		if state.Monster.HP > 0 {
			logs = append(logs, enemyAttack(rng, &state, player)...)
		}
	}

	state.Log = append(state.Log, logs...)
	state.Turn++

	result := BattleResult{State: state}

	if state.Monster.HP <= 0 {
		state.Phase = model.PhaseWin
		state.IsActive = false
		result.GoldGained = state.Monster.GoldDrop
		result.EXPGained = state.Monster.EXPDrop
		winMsg := fmt.Sprintf("%s を倒した！%d EXP、%d Gold 獲得！", state.Monster.Name, state.Monster.EXPDrop, state.Monster.GoldDrop)
		state.Log = append(state.Log, model.BattleLog{ID: logID(), Message: winMsg, Type: "system"})
		result.State = state
	} else if state.PlayerHP <= 0 {
		state.Phase = model.PhaseLose
		state.IsActive = false
		state.Log = append(state.Log, model.BattleLog{ID: logID(), Message: "力尽きた…", Type: "system"})
		result.State = state
	} else {
		state.Phase = model.PhasePlayerTurn
		result.State = state
	}

	return result
}

func playerAttack(rng *rand.Rand, state *model.BattleState, player model.Player) []model.BattleLog {
	dmg := calcDamage(player.ATK, state.Monster.DEF, rng)
	critical := rng.Float64() < 0.1+float64(player.LUK)*0.01
	if critical {
		dmg = dmg * 3 / 2
	}
	state.Monster.HP -= dmg
	if state.Monster.HP < 0 {
		state.Monster.HP = 0
	}

	msg := fmt.Sprintf("%s の攻撃！%s に %d ダメージ！", player.Name, state.Monster.Name, dmg)
	logType := "attack"
	if critical {
		msg = fmt.Sprintf("クリティカル！%s に %d ダメージ！", state.Monster.Name, dmg)
		logType = "critical"
	}
	return []model.BattleLog{{ID: logID(), Message: msg, Type: logType, Damage: dmg}}
}

func playerSkillAttack(rng *rand.Rand, state *model.BattleState, player model.Player, skillID string) []model.BattleLog {
	multiplier := 1.5
	skillName := "スキル"
	for _, s := range player.Skills {
		if s.ID == skillID {
			skillName = s.Name
			break
		}
	}
	dmg := int(float64(calcDamage(player.ATK, state.Monster.DEF, rng)) * multiplier)
	state.Monster.HP -= dmg
	if state.Monster.HP < 0 {
		state.Monster.HP = 0
	}
	msg := fmt.Sprintf("%s を使った！%s に %d ダメージ！", skillName, state.Monster.Name, dmg)
	return []model.BattleLog{{ID: logID(), Message: msg, Type: "skill", Damage: dmg}}
}

func enemyAttack(rng *rand.Rand, state *model.BattleState, player model.Player) []model.BattleLog {
	dmg := calcDamage(state.Monster.ATK, player.DEF, rng)
	state.PlayerHP -= dmg
	if state.PlayerHP < 0 {
		state.PlayerHP = 0
	}
	msg := fmt.Sprintf("%s の攻撃！%s に %d ダメージ！", state.Monster.Name, player.Name, dmg)
	return []model.BattleLog{{ID: logID(), Message: msg, Type: "attack", Damage: dmg}}
}

func calcDamage(atk, def int, rng *rand.Rand) int {
	base := atk - def + rng.Intn(5) - 2
	if base < 1 {
		base = 1
	}
	return base
}

func logID() string {
	return fmt.Sprintf("log-%d", time.Now().UnixNano())
}
