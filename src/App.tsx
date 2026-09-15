import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SgsstDashboard from './pages/SgsstDashboard'
import EnergyDashboard from './pages/EnergyDashboard'
import AgricultureDashboard from './pages/AgricultureDashboard'
import AssistantPage from './pages/AssistantPage'
import { useTheme } from './hooks/useTheme'
import { AssistantProvider } from './context/AssistantContext'
import { ChatWidget } from './components/assistant/ChatWidget'

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <AssistantProvider>
      <Routes>
        <Route path="/" element={<Home theme={theme} onToggleTheme={toggle} />} />
        <Route path="/sgsst" element={<SgsstDashboard theme={theme} onToggleTheme={toggle} />} />
        <Route path="/energia" element={<EnergyDashboard theme={theme} onToggleTheme={toggle} />} />
        <Route
          path="/agricultura"
          element={<AgricultureDashboard theme={theme} onToggleTheme={toggle} />}
        />
        <Route path="/asistente" element={<AssistantPage theme={theme} onToggleTheme={toggle} />} />
      </Routes>
      <ChatWidget />
    </AssistantProvider>
  )
}
