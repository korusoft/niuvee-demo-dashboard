import type { Theme } from '../hooks/useTheme'
import { ThemeToggle } from './ThemeToggle'

interface Props {
  theme: Theme
  onToggleTheme: () => void
  isLive: boolean
}

export function Header({ theme, onToggleTheme, isLive }: Props) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <div className="app-header__logo" aria-hidden="true">
          N
        </div>
        <div>
          <div className="app-header__title">Niuvee IoT · Monitoreo SG-SST</div>
          <div className="app-header__subtitle">
            Sabaneta, C.C. Aves María — sensor SCD40
          </div>
        </div>
      </div>

      <div className="app-header__actions">
        <span className={`live-badge ${isLive ? 'live-badge--on' : 'live-badge--off'}`}>
          <span className="live-badge__dot" />
          {isLive ? 'En vivo' : 'Sin conexión'}
        </span>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}
