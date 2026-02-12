import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import FloatingAIButton from './FloatingAIButton'

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#001233]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gradient-to-br dark:from-[#001233] dark:via-[#001a4d] dark:to-[#0a2540]">
          <Outlet />
        </main>
      </div>
      <FloatingAIButton />
    </div>
  )
}
