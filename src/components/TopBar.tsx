import { Search, User } from 'lucide-react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { useTheme } from '@/lib/theme'
import { Moon, Sun } from 'lucide-react'
import NotificationDropdown from './NotificationDropdown'

export default function TopBar() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="h-16 bg-white dark:bg-[#001233] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/50" />
          <Input
            type="text"
            placeholder="Search jobs, companies..."
            className="pl-10 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:ring-white/20 focus:border-white/30 rounded-full text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full h-9 w-9"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-gray-600 dark:text-white/70" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600 dark:text-white/70" />
          )}
        </Button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-white dark:to-white/90 flex items-center justify-center text-white dark:text-[#001233] font-semibold text-sm cursor-pointer hover:scale-105 transition-transform shadow-lg">
          <User className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
