import { NavLink } from 'react-router-dom'
import { NiuveeLogo } from './NiuveeLogo'
import { TalkToUsButton } from '../TalkToUsButton'
import { BoltIcon, HomeIcon, LeafIcon, RobotIcon, ShieldIcon } from './icons'

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', icon: HomeIcon, end: true },
  { to: '/sgsst', label: 'SG-SST', icon: ShieldIcon, end: false },
  { to: '/energia', label: 'Energía', icon: BoltIcon, end: false },
  { to: '/agricultura', label: 'Agricultura', icon: LeafIcon, end: false },
  { to: '/asistente', label: 'Asistente', icon: RobotIcon, end: false },
]

interface Props {
  open: boolean
  onNavigate: () => void
}

export function Sidebar({ open, onNavigate }: Props) {
  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <NiuveeLogo />
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <TalkToUsButton className="sidebar__talk-btn" />
        <a href="https://niuvee.com" target="_blank" rel="noreferrer" className="sidebar__external">
          niuvee.com ↗
        </a>
      </div>
    </aside>
  )
}
