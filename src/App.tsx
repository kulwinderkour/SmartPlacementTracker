import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/ThemeProvider'
import Dashboard from '@/pages/Dashboard'
import Opportunities from '@/pages/Opportunities'
import OpportunitiesBackend from '@/pages/OpportunitiesBackend'
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
import Login from '@/pages/Login'
import WhatsAppParser from '@/pages/WhatsAppParser'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route - Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Main Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="opportunities-backend" element={<OpportunitiesBackend />} />
            <Route path="application-board" element={<ApplicationBoard />} />
            <Route path="whatsapp-parser" element={<WhatsAppParser />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="preparation-notes" element={<PreparationNotes />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="motivation" element={<Motivation />} />
            <Route path="ai-chat" element={<AIChat />} />
            <Route path="planner" element={<PreparationPlanner />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
