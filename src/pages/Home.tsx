import { Link } from 'react-router-dom'
import { NiuveeLogo } from '../components/layout/NiuveeLogo'
import { ThemeToggle } from '../components/ThemeToggle'
import { Footer } from '../components/Footer'
import { ArrowRightIcon, BoltIcon, LeafIcon, ShieldIcon } from '../components/layout/icons'
import type { Theme } from '../hooks/useTheme'

interface Props {
  theme: Theme
  onToggleTheme: () => void
}

const MODULES = [
  {
    to: '/sgsst',
    icon: ShieldIcon,
    title: 'SG-SST',
    description:
      'Monitoreo ambiental en tiempo real (temperatura, humedad y CO₂) en una oficina en Sabaneta, orientado a la gestión de riesgos del SG-SST.',
    badge: 'Datos en vivo',
    accent: 'sgsst',
  },
  {
    to: '/energia',
    icon: BoltIcon,
    title: 'Energía',
    description:
      'Seguimiento de consumo eléctrico (voltaje, corriente y potencia) para detectar picos de demanda y oportunidades de ahorro.',
    badge: 'Datos en vivo',
    accent: 'energy',
  },
  {
    to: '/agricultura',
    icon: LeafIcon,
    title: 'Agricultura',
    description:
      'Condiciones de cultivo (humedad y temperatura del suelo, luminosidad) para agricultura de precisión.',
    badge: 'Datos simulados',
    accent: 'agriculture',
  },
] as const

export default function Home({ theme, onToggleTheme }: Props) {
  return (
    <div className="home-shell">
      <header className="home-header">
        <NiuveeLogo />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      <main className="home-main">
        <div className="home-intro">
          <h1>Plataforma de monitoreo Niuvee IoT</h1>
          <p>
            Demo interactiva de nuestros dashboards de monitoreo por sensores IoT. Elige un
            módulo para ver sus indicadores en tiempo real.
          </p>
        </div>

        <div className="home-grid">
          {MODULES.map(({ to, icon: Icon, title, description, badge, accent }) => (
            <Link key={to} to={to} className={`menu-card menu-card--${accent}`}>
              <div className="menu-card__icon">
                <Icon size={26} />
              </div>
              <div className="menu-card__body">
                <div className="menu-card__top">
                  <h2>{title}</h2>
                  <span className="menu-card__badge">{badge}</span>
                </div>
                <p>{description}</p>
              </div>
              <span className="menu-card__cta">
                Ver dashboard <ArrowRightIcon />
              </span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
