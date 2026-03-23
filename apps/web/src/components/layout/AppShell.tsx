'use client'

import { DashboardSidebar } from './DashboardSidebar'
import { MobileBottomNav } from './MobileBottomNav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface)' }}>
      <DashboardSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}
