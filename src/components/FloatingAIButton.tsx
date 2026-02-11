import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bot, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FloatingAIButton() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isHovered, setIsHovered] = useState(false)
  const isOnAIChatPage = location.pathname === '/ai-chat'

  // Don't show the button when on AI Chat page
  if (isOnAIChatPage) {
    return null
  }

  const handleClick = () => {
    navigate('/ai-chat')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'group relative flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110',
          'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
          'ring-4 ring-purple-100 dark:ring-purple-900/30',
          'h-16 w-16'
        )}
        aria-label="Open AI Chat"
      >
        {/* Animated gradient ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity animate-pulse" />
        
        {/* Icon */}
        <div className="relative">
          <Bot className={cn(
            'text-white transition-all h-8 w-8',
            isHovered && 'scale-110'
          )} />
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />
        </div>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm font-medium rounded-lg whitespace-nowrap shadow-lg">
            Ask AI Assistant
            <div className="absolute top-full right-6 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45 -mt-1" />
          </div>
        )}
      </button>

      {/* Ripple effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-purple-600" />
      )}
    </div>
  )
}
