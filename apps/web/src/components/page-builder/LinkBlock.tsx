'use client'

interface LinkBlockConfig {
  title?: string
  url?: string
}

interface Props {
  config: LinkBlockConfig
  onChange?: (config: LinkBlockConfig) => void
  editable?: boolean
}

export function LinkBlock({ config, onChange, editable = false }: Props) {
  if (editable && onChange) {
    return (
      <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-2">
        <input
          type="text"
          value={config.title ?? ''}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          placeholder="Link title"
          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="url"
          value={config.url ?? ''}
          onChange={(e) => onChange({ ...config, url: e.target.value })}
          placeholder="https://..."
          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <a
        href={config.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        <span>{config.title || 'Untitled link'}</span>
        <span>→</span>
      </a>
    </div>
  )
}
