import type { CredilinkBadge as CredilinkBadgeType } from '@creator-os/types'

interface Props {
  badge: CredilinkBadgeType
  score?: number
}

const BADGE_STYLES: Record<CredilinkBadgeType, string> = {
  bronze: 'bg-amber-100 text-amber-800 border-amber-300',
  silver: 'bg-gray-100 text-gray-700 border-gray-300',
  gold: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  platinum: 'bg-indigo-100 text-indigo-800 border-indigo-400',
}

const BADGE_LABELS: Record<CredilinkBadgeType, string> = {
  bronze: '🥉 Bronze',
  silver: '🥈 Silver',
  gold: '🥇 Gold',
  platinum: '💎 Platinum',
}

export function CredilinkBadge({ badge, score }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${BADGE_STYLES[badge]}`}
      title={score !== undefined ? `Credilink score: ${score}` : undefined}
    >
      {BADGE_LABELS[badge]}
    </span>
  )
}
