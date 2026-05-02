import type { RankingEntry } from '../../types/ranking'

const JOB_LABEL: Record<string, string> = {
  warrior: '剣士', mage: '魔法使い', rogue: '盗賊', summoner: '召喚士', alchemist: '錬金術師',
}

interface Props {
  rankings: RankingEntry[]
}

export default function RankingTable({ rankings }: Props) {
  return (
    <table className="w-full text-xs font-mono border-collapse">
      <thead>
        <tr className="text-abyss-text-dim border-b border-abyss-purple/40">
          <th className="text-left py-1 px-2 w-8">#</th>
          <th className="text-left py-1 px-2">名前</th>
          <th className="text-left py-1 px-2">職業</th>
          <th className="text-right py-1 px-2">到達階</th>
          <th className="text-right py-1 px-2">スコア</th>
          <th className="text-left py-1 px-2">死因</th>
        </tr>
      </thead>
      <tbody>
        {rankings.map((entry) => (
          <tr
            key={entry.rank}
            className="border-b border-abyss-purple/20 hover:bg-abyss-purple/10 transition-colors"
          >
            <td className={`py-1.5 px-2 font-bold ${entry.rank <= 3 ? 'text-abyss-gold' : 'text-abyss-text-muted'}`}>
              {entry.rank}
            </td>
            <td className="py-1.5 px-2 text-white">{entry.playerName}</td>
            <td className="py-1.5 px-2 text-abyss-purple-light">{JOB_LABEL[entry.jobClass] ?? entry.jobClass}</td>
            <td className="py-1.5 px-2 text-right text-white">B{entry.floor}F</td>
            <td className="py-1.5 px-2 text-right text-abyss-gold">{entry.score.toLocaleString()}</td>
            <td className="py-1.5 px-2 text-abyss-text-muted">{entry.killedBy ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
