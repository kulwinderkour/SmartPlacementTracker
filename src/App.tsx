import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/ThemeProvider'
import Dashboard from '@/pages/Dashboard'
import Opportunities from '@/pages/Opportunities'
import Analytics from '@/pages/Analytics'
import Settings from '@/pages/Settings'
import ApplicationBoard from '@/pages/ApplicationBoard'
import Notifications from '@/pages/Notifications'
import PreparationNotes from '@/pages/PreparationNotes'
import Recommendations from '@/pages/Recommendations'
import Motivation from '@/pages/Motivation'
import AIChat from '@/pages/AIChat'
import PreparationPlanner from '@/pages/PreparationPlanner'
import Layout from '@/components/Layout'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="application-board" element={<ApplicationBoard />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="preparation-notes" element={<PreparationNotes />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="motivation" element={<Motivation />} />
            <Route path="ai-chat" element={<AIChat />} />
            <Route path="planner" element={<PreparationPlanner />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
