import type { Skill } from '../../types/player'
interface Props {
  skills: Skill[]
  currentMp: number
  onSelect: (skillId: string) => void
  disabled?: boolean
}

export default function SkillList({ skills, currentMp, onSelect, disabled }: Props) {
  return (
    <div className="space-y-1">
      {skills.map((skill) => {
        const canUse = currentMp >= skill.mpCost
        return (
          <button
            key={skill.id}
            onClick={() => onSelect(skill.id)}
            disabled={disabled || !canUse}
            className="w-full text-left abyss-panel px-3 py-2 text-xs hover:border-abyss-gold/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-abyss-purple/40"
          >
            <div className="flex justify-between items-center">
              <span className="text-abyss-gold-light font-bold">{skill.name}</span>
              <span className="text-blue-400">MP {skill.mpCost}</span>
            </div>
            <div className="text-abyss-text-muted mt-0.5">{skill.description}</div>
          </button>
        )
      })}
      {skills.length === 0 && (
        <p className="text-abyss-text-dim text-xs text-center py-2">スキルなし</p>
      )}
    </div>
  )
}

