import { Search, Bell, User } from 'lucide-react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { useTheme } from '@/lib/theme'
import { Moon, Sun } from 'lucide-react'

export default function TopBar() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search jobs, companies..."
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500 rounded-full"
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
            <Sun className="h-5 w-5 text-gray-600" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:scale-105 transition-transform">
          <User className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
