import type { Theme } from '../../hooks/useTheme'
import { ThemeToggle } from '../ThemeToggle'
import { TalkToUsButton } from '../TalkToUsButton'
import { NiuveeLogo } from './NiuveeLogo'
import { MenuIcon } from './icons'

interface Props {
  title: string
  subtitle?: string
  theme: Theme
  onToggleTheme: () => void
  onOpenMenu: () => void
  isLive?: boolean
}

export function Topbar({ title, subtitle, theme, onToggleTheme, onOpenMenu, isLive }: Props) {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <div className="topbar__left">
          <button className="topbar__menu-btn" onClick={onOpenMenu} aria-label="Abrir menú">
            <MenuIcon />
          </button>
          <NiuveeLogo variant="icon" className="topbar__logo-icon" />
          <div className="topbar__titles">
            <div className="topbar__title">{title}</div>
            {subtitle && <div className="topbar__subtitle">{subtitle}</div>}
          </div>
        </div>

        <div className="topbar__actions">
          {isLive !== undefined && (
            <span className={`live-badge ${isLive ? 'live-badge--on' : 'live-badge--off'}`}>
              <span className="live-badge__dot" />
              {isLive ? 'En vivo' : 'Sin conexión'}
            </span>
          )}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <TalkToUsButton className="topbar__talk-btn" />
        </div>
      </div>
    </header>
  )
}
