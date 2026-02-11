import { useState, useEffect, useRef } from 'react'
import { Bell, X, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { format, isPast } from 'date-fns'
import { Button } from './ui/Button'

interface Reminder {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetchReminders()
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Fetch reminders on component mount for the count
  useEffect(() => {
    fetchReminders()
    
    // Refresh every minute
    const interval = setInterval(fetchReminders, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchReminders = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/parser/reminders?status=pending')
      if (response.ok) {
        const data = await response.json()
        setReminders(data.reminders || [])
      }
    } catch (error) {
      console.error('Failed to fetch reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteReminder = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/parser/reminders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed' }),
      })

      if (response.ok) {
        // Refresh reminders
        fetchReminders()
      }
    } catch (error) {
      console.error('Failed to update reminder:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'event':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'assignment':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'interview':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
      case 'deadline':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const isOverdue = (dueDate: string) => {
    return isPast(new Date(dueDate))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full h-9 w-9 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        {reminders.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {reminders.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Upcoming Reminders
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {reminders.length} {reminders.length === 1 ? 'reminder' : 'reminders'} pending
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Reminders List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Loading reminders...</p>
              </div>
            ) : reminders.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No pending reminders</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {reminders.map((reminder) => (
                  <div
                    key={reminder._id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      isOverdue(reminder.dueDate) ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {isOverdue(reminder.dueDate) && (
                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          )}
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                            {reminder.title}
                          </h4>
                        </div>

                        {reminder.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {reminder.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                            {reminder.priority}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(reminder.category)}`}>
                            {reminder.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span className={isOverdue(reminder.dueDate) ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                            {format(new Date(reminder.dueDate), 'MMM dd, yyyy h:mm a')}
                            {isOverdue(reminder.dueDate) && ' (Overdue)'}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCompleteReminder(reminder._id)}
                        className="flex-shrink-0 h-8 px-3 text-xs bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Done
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {reminders.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <a
                href="/dashboard"
                className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium block text-center"
                onClick={() => setIsOpen(false)}
              >
                View all on Dashboard →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
