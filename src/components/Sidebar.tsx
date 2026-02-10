import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Briefcase, 
  BarChart3, 
  Settings,
  Moon,
  Sun,
  Clipboard,
  Bell,
  BookOpen,
  Lightbulb,
  Trophy,
  MessageSquare,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme'
import { Button } from './ui/Button'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Application Board', href: '/application-board', icon: Clipboard },
  { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Prep Notes', href: '/preparation-notes', icon: BookOpen },
  { name: 'Recommendations', href: '/recommendations', icon: Lightbulb },
  { name: 'Motivation', href: '/motivation', icon: Trophy },
  { name: 'AI Chat', href: '/ai-chat', icon: MessageSquare },
  { name: 'Planner', href: '/planner', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center justify-between px-6 border-b">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Smart Placement
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground text-center">
          © 2026 Smart Placement Tracker
        </p>
      </div>
    </div>
  )
}
