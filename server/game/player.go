package game

import (
	"fmt"

	"github.com/shuta1123/RoguelikeDungeon/server/model"
)

type jobDef struct {
	maxHP int
	maxMP int
	atk   int
	def   int
	agi   int
	luk   int
	skills []model.Skill
	weapon *model.EquipItem
	armor  *model.EquipItem
}

var jobDefs = map[model.JobClass]jobDef{
	model.JobWarrior: {
		maxHP: 80, maxMP: 20, atk: 12, def: 8, agi: 6, luk: 5,
		skills: []model.Skill{
			{ID: "skill-slash", Name: "斬撃", Description: "強力な一撃。ATK×1.5のダメージ。", MPCost: 5, Type: "active"},
			{ID: "skill-guard", Name: "鉄壁", Description: "1ターンDEFが2倍になる。", MPCost: 4, Type: "active"},
		},
		weapon: &model.EquipItem{ID: "eq-iron-sword", Name: "鉄の剣", Type: "weapon", Stats: model.EquipStats{ATK: 5}},
		armor:  &model.EquipItem{ID: "eq-leather-armor", Name: "革鎧", Type: "armor", Stats: model.EquipStats{DEF: 3}},
	},
	model.JobMage: {
		maxHP: 50, maxMP: 60, atk: 6, def: 4, agi: 7, luk: 8,
		skills: []model.Skill{
			{ID: "skill-fireball", Name: "ファイアボール", Description: "炎の魔法。ATK×2のダメージ。", MPCost: 8, Type: "active"},
			{ID: "skill-ice-shard", Name: "アイスシャード", Description: "氷の魔法。敵を1ターン遅延させる。", MPCost: 6, Type: "active"},
		},
		weapon: &model.EquipItem{ID: "eq-wooden-staff", Name: "木の杖", Type: "weapon", Stats: model.EquipStats{ATK: 3}},
		armor:  &model.EquipItem{ID: "eq-robe", Name: "ローブ", Type: "armor", Stats: model.EquipStats{DEF: 1, MP: 10}},
	},
	model.JobRogue: {
		maxHP: 60, maxMP: 30, atk: 10, def: 5, agi: 12, luk: 10,
		skills: []model.Skill{
			{ID: "skill-backstab", Name: "バックスタブ", Description: "急所を突く。AGI依存ダメージ。", MPCost: 6, Type: "active"},
			{ID: "skill-smoke", Name: "煙幕", Description: "確実に逃走できる。", MPCost: 3, Type: "active"},
		},
		weapon: &model.EquipItem{ID: "eq-dagger", Name: "短剣", Type: "weapon", Stats: model.EquipStats{ATK: 4, AGI: 2}},
		armor:  &model.EquipItem{ID: "eq-light-armor", Name: "軽装鎧", Type: "armor", Stats: model.EquipStats{DEF: 2, AGI: 1}},
	},
	model.JobSummoner: {
		maxHP: 55, maxMP: 50, atk: 7, def: 5, agi: 6, luk: 9,
		skills: []model.Skill{
			{ID: "skill-summon", Name: "召喚", Description: "使い魔を召喚して攻撃する。", MPCost: 10, Type: "active"},
			{ID: "skill-soul-link", Name: "ソウルリンク", Description: "使い魔とHPを共有する。", MPCost: 5, Type: "active"},
		},
		weapon: &model.EquipItem{ID: "eq-tome", Name: "召喚書", Type: "weapon", Stats: model.EquipStats{ATK: 3, MP: 5}},
		armor:  &model.EquipItem{ID: "eq-cloak", Name: "クローク", Type: "armor", Stats: model.EquipStats{DEF: 2}},
	},
	model.JobAlchemist: {
		maxHP: 60, maxMP: 45, atk: 8, def: 6, agi: 7, luk: 7,
		skills: []model.Skill{
			{ID: "skill-potion", Name: "錬成薬", Description: "HPを30回復する。", MPCost: 0, Type: "active"},
			{ID: "skill-bomb", Name: "爆弾投擲", Description: "ATK×1.2の爆発ダメージ。", MPCost: 7, Type: "active"},
		},
		weapon: &model.EquipItem{ID: "eq-flask", Name: "錬金フラスコ", Type: "weapon", Stats: model.EquipStats{ATK: 4}},
		armor:  &model.EquipItem{ID: "eq-apron", Name: "皮エプロン", Type: "armor", Stats: model.EquipStats{DEF: 3}},
	},
}

func NewPlayer(userID, name string, job model.JobClass) model.Player {
	d, ok := jobDefs[job]
	if !ok {
		d = jobDefs[model.JobWarrior]
	}
	return model.Player{
		ID:            userID,
		Name:          name,
		JobClass:      job,
		Level:         1,
		HP:            d.maxHP,
		MaxHP:         d.maxHP,
		MP:            d.maxMP,
		MaxMP:         d.maxMP,
		ATK:           d.atk,
		DEF:           d.def,
		AGI:           d.agi,
		LUK:           d.luk,
		Skills:        d.skills,
		Equipment:     model.Equipment{Weapon: d.weapon, Armor: d.armor},
		Gold:          50,
		Floor:         1,
		StatusEffects: []model.StatusEffect{},
		EXP:           0,
		NextLevelEXP:  100,
	}
}

func LevelUpIfNeeded(p *model.Player) {
	for p.EXP >= p.NextLevelEXP {
		p.EXP -= p.NextLevelEXP
		p.Level++
		p.MaxHP += 10
		p.HP = p.MaxHP
		p.MaxMP += 5
		p.MP = p.MaxMP
		p.ATK += 2
		p.DEF += 1
		p.NextLevelEXP = p.Level * 100
		_ = fmt.Sprintf("level up: %d", p.Level)
	}
}
