import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SgsstDashboard from './pages/SgsstDashboard'
import EnergyDashboard from './pages/EnergyDashboard'
import AgricultureDashboard from './pages/AgricultureDashboard'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <Routes>
      <Route path="/" element={<Home theme={theme} onToggleTheme={toggle} />} />
      <Route path="/sgsst" element={<SgsstDashboard theme={theme} onToggleTheme={toggle} />} />
      <Route path="/energia" element={<EnergyDashboard theme={theme} onToggleTheme={toggle} />} />
      <Route
        path="/agricultura"
        element={<AgricultureDashboard theme={theme} onToggleTheme={toggle} />}
      />
    </Routes>
  )
}
