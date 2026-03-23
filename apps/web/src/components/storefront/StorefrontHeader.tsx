import Image from 'next/image'
import { CredilinkBadge } from '@/components/credilink/CredilinkBadge'
import type { CredilinkBadge as CredilinkBadgeType } from '@creator-os/types'

interface Props {
  displayName: string
  username: string
  bio: string | null
  avatarUrl: string | null
  category: string
  credilinkScore: number
  isVerified: boolean
}

function scoreToBadge(score: number): CredilinkBadgeType {
  if (score >= 80) return 'platinum'
  if (score >= 60) return 'gold'
  if (score >= 40) return 'silver'
  return 'bronze'
}

export function StorefrontHeader({
  displayName,
  username,
  bio,
  avatarUrl,
  category,
  credilinkScore,
  isVerified,
}: Props) {
  const badge = scoreToBadge(credilinkScore)

  return (
    <header className="flex flex-col items-center text-center py-10 px-4">
      {/* Avatar */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name + verified */}
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
        {isVerified && (
          <span title="Verified creator" className="text-blue-500 text-lg">
            ✓
          </span>
        )}
      </div>

      {/* Username */}
      <p className="text-sm text-gray-500 mb-2">@{username}</p>

      {/* Category badge */}
      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5 rounded-full mb-3 capitalize">
        {category}
      </span>

      {/* Credilink badge */}
      <div className="mb-4">
        <CredilinkBadge badge={badge} score={credilinkScore} />
      </div>

      {/* Bio */}
      {bio && <p className="text-gray-600 max-w-md text-sm leading-relaxed">{bio}</p>}
    </header>
  )
}
