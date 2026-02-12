import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Briefcase, 
  BarChart3, 
  Settings,
  Clipboard,
  FileText,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Application Board', href: '/application-board', icon: Clipboard },
  { name: 'Job Listings', href: '/notifications', icon: Briefcase },
  { name: 'WhatsApp Parser', href: '/whatsapp-parser', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Resume Manager', href: '/preparation-notes', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "flex flex-col bg-gradient-to-b from-[#001233] via-[#001a4d] to-[#0a2540] text-white shadow-2xl transition-all duration-300 ease-in-out relative",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex h-20 items-center justify-center px-6 border-b border-white/20">
        {!isCollapsed ? (
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Smart Placement
          </h1>
        ) : (
          <h1 className="text-2xl font-bold tracking-tight text-white">
            SP
          </h1>
        )}
      </div>
      
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 h-6 w-6 rounded-full bg-white text-[#001233] shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-10 hover:scale-110"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300',
                isActive
                  ? 'bg-white text-[#001233] shadow-lg border-l-4 border-white'
                  : 'text-white hover:bg-white/15 hover:text-white border-l-4 border-transparent',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.name : ''}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>
      
      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t border-white/20 p-4">
          <p className="text-xs text-white/50 text-center font-medium">
            © 2026 Smart Placement
          </p>
        </div>
      )}
    </div>
  )
}
