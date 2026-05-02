import type { JobClass } from '../../types/player'

interface ClassInfo {
  id: JobClass
  name: string
  description: string
  stats: string
  unlocked: boolean
}

const CLASSES: ClassInfo[] = [
  { id: 'warrior', name: '⚔ 剣士', description: '高い防御力と安定した近接攻撃。', stats: 'HP★★★ ATK★★ DEF★★★', unlocked: true },
  { id: 'mage', name: '✦ 魔法使い', description: '強力な魔法攻撃。MPを上手く管理せよ。', stats: 'HP★ ATK★★★ DEF★', unlocked: false },
  { id: 'rogue', name: '🗡 盗賊', description: '高い機動力と急所攻撃。', stats: 'HP★★ ATK★★ AGI★★★', unlocked: false },
  { id: 'summoner', name: '◈ 召喚士', description: '使い魔を呼び出して戦う。', stats: 'HP★ ATK★ LUK★★★', unlocked: false },
  { id: 'alchemist', name: '⚗ 錬金術師', description: 'アイテムを強化・調合する。', stats: 'HP★★ DEF★★ LUK★★', unlocked: false },
]

interface Props {
  selected: JobClass
  onSelect: (jc: JobClass) => void
}

export default function ClassSelect({ selected, onSelect }: Props) {
  return (
    <div className="space-y-2">
      {CLASSES.map((cls) => (
        <button
          key={cls.id}
          onClick={() => cls.unlocked && onSelect(cls.id)}
          disabled={!cls.unlocked}
          className={`w-full text-left abyss-panel px-4 py-3 border transition-colors ${
            selected === cls.id
              ? 'border-abyss-gold bg-abyss-gold/10'
              : 'border-abyss-purple/40 hover:border-abyss-purple-light'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-bold ${cls.unlocked ? 'text-abyss-gold-light' : 'text-abyss-text-dim'}`}>
              {cls.name}
              {!cls.unlocked && <span className="ml-2 text-xs text-abyss-text-dim">🔒 未解放</span>}
            </span>
          </div>
          {cls.unlocked && (
            <>
              <p className="text-xs text-abyss-text-muted mt-0.5">{cls.description}</p>
              <p className="text-xs text-abyss-purple-light mt-0.5">{cls.stats}</p>
            </>
          )}
        </button>
      ))}
    </div>
  )
}

