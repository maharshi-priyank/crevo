'use client'

interface ProfileBlockConfig {
  displayName?: string
  bio?: string
  avatarUrl?: string
}

interface Props {
  config: ProfileBlockConfig
}

export function ProfileBlock({ config }: Props) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500 shrink-0">
          {config.displayName?.charAt(0).toUpperCase() ?? '?'}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {config.displayName || 'Your Name'}
          </p>
          <p className="text-xs text-gray-500 line-clamp-2">
            {config.bio || 'Your bio will appear here'}
          </p>
        </div>
      </div>
    </div>
  )
}
