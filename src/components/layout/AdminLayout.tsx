import { useState, type ReactNode } from 'react'
import type { Theme } from '../../hooks/useTheme'
import { Footer } from '../Footer'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface Props {
  title: string
  subtitle?: string
  theme: Theme
  onToggleTheme: () => void
  isLive?: boolean
  children: ReactNode
}

export function AdminLayout({ title, subtitle, theme, onToggleTheme, isLive, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="admin-shell">
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />

      {menuOpen && <div className="admin-shell__scrim" onClick={() => setMenuOpen(false)} />}

      <div className="admin-shell__body">
        <Topbar
          title={title}
          subtitle={subtitle}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onOpenMenu={() => setMenuOpen(true)}
          isLive={isLive}
        />

        <main className="admin-shell__content">{children}</main>

        <Footer />
      </div>
    </div>
  )
}
