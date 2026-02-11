import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Briefcase, 
  BarChart3, 
  Settings,
  Clipboard,
  Building2,
  FileText,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Application Board', href: '/application-board', icon: Clipboard },
  { name: 'Companies', href: '/opportunities', icon: Building2 },
  { name: 'Job Listings', href: '/notifications', icon: Briefcase },
  { name: 'WhatsApp Parser', href: '/whatsapp-parser', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Resume Manager', href: '/preparation-notes', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="flex w-64 flex-col bg-gradient-to-b from-purple-600 via-purple-500 to-indigo-600 text-white shadow-xl">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center px-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight">
          Smart Placement
        </h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <p className="text-xs text-white/60 text-center">
          © 2026 Smart Placement
        </p>
      </div>
    </div>
  )
}
