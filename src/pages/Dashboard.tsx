import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import {
  Briefcase,
  Calendar,
  TrendingUp,
  XCircle,
  Building2,
  Bookmark,
  Plus,
  FileUp,
  BarChart3,
  Clock,
  Users,
  Bell,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useOpportunitiesStore } from '@/store/opportunitiesStore'
import AddOpportunityModal from '@/components/AddOpportunityModal'
import { Opportunity } from '@/types'

interface User {
  _id: string;
  name: string;
  createdAt: string;
}

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

const statusColumns = [
  { id: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  { id: 'online-assessment', label: 'Assessment', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
  { id: 'interview-scheduled', label: 'Interview', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  { id: 'offer-received', label: 'Offer', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { opportunities, initializeSampleData } = useOpportunitiesStore()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])

  useEffect(() => {
    initializeSampleData()
    setTimeout(() => setIsLoading(false), 300)
    
    // Fetch users from backend
    fetchUsers()
    // Fetch reminders from backend
    fetchReminders()
  }, [initializeSampleData])
  
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const fetchReminders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/parser/reminders?status=pending')
      if (response.ok) {
        const data = await response.json()
        setReminders(data.reminders || [])
      }
    } catch (error) {
      console.error('Failed to fetch reminders:', error)
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

  // Calculate stats
  const stats = useMemo(() => {
    const totalApplications = opportunities.length
    const interviewsScheduled = opportunities.filter(o => 
      o.status === 'interview-scheduled' || o.status === 'online-assessment'
    ).length
    const offersReceived = opportunities.filter(o => o.status === 'offer-received').length
    const rejections = opportunities.filter(o => o.status === 'rejected').length
    const activeCompanies = new Set(opportunities.map(o => o.companyName)).size
    const savedJobs = opportunities.filter(o => o.status === 'saved').length

    return {
      totalApplications,
      interviewsScheduled,
      offersReceived,
      rejections,
      activeCompanies,
      savedJobs,
    }
  }, [opportunities])

  // Group opportunities by status for kanban
  const kanbanData = useMemo(() => {
    const grouped: Record<string, Opportunity[]> = {}
    statusColumns.forEach(col => {
      grouped[col.id] = opportunities.filter(o => o.status === col.id)
    })
    return grouped
  }, [opportunities])

  // Recent activity (last 8 activity logs)
  const recentActivity = useMemo(() => {
    const allActivities = opportunities.flatMap(opp => 
      opp.activityLog.map(log => ({
        ...log,
        companyName: opp.companyName,
        role: opp.role,
      }))
    )
    return allActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8)
  }, [opportunities])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Registered Users */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Registered Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No users registered yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'Recently joined'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* WhatsApp Parser Reminders */}
      {reminders.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-600" />
                Upcoming Reminders ({reminders.length})
              </div>
              <Button
                onClick={() => navigate('/whatsapp-parser')}
                variant="outline"
                size="sm"
              >
                View Parser
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reminders.slice(0, 6).map((reminder) => {
                const getPriorityColor = (priority: string) => {
                  switch (priority) {
                    case 'urgent':
                      return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300';
                    case 'high':
                      return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300';
                    case 'medium':
                      return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300';
                    case 'low':
                      return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700/30 dark:text-gray-300';
                    default:
                      return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700/30 dark:text-gray-300';
                  }
                };

                const getCategoryIcon = (category: string) => {
                  switch (category) {
                    case 'assignment':
                      return '📝';
                    case 'exam':
                      return '📚';
                    case 'meeting':
                      return '👥';
                    case 'interview':
                      return '🎯';
                    case 'deadline':
                      return '⏰';
                    case 'event':
                      return '📅';
                    default:
                      return '📌';
                  }
                };

                const isOverdue = new Date(reminder.dueDate) < new Date();

                return (
                  <div
                    key={reminder._id}
                    className={`p-4 rounded-lg border ${
                      isOverdue
                        ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
                    } hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="text-2xl flex-shrink-0">{getCategoryIcon(reminder.category)}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
                            {reminder.title}
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCompleteReminder(reminder._id)}
                        className="flex-shrink-0 p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                        title="Mark as complete"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-900/30 dark:text-purple-300">
                        {reminder.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span className={isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
                        {format(new Date(reminder.dueDate), 'MMM dd, yyyy')}
                        {isOverdue && ' (Overdue)'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {reminders.length > 6 && (
              <div className="mt-4 text-center">
                <Button
                  onClick={() => navigate('/whatsapp-parser')}
                  variant="outline"
                >
                  View All {reminders.length} Reminders
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Applications */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-xl border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalApplications}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interviews Scheduled */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-xl border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Interviews Scheduled</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.interviewsScheduled}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offers Received */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-xl border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Offers Received</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.offersReceived}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rejections */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-xl border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rejections</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.rejections}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Companies */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-xl border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Companies</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.activeCompanies}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Jobs */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-xl border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Saved Jobs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.savedJobs}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                <Bookmark className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kanban Board - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Application Status Board</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex gap-4 overflow-x-auto pb-4">
                {statusColumns.map(column => (
                  <div key={column.id} className="flex-shrink-0 w-64">
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">{column.label}</h3>
                        <span className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded-full font-medium text-gray-600 dark:text-gray-400">
                          {kanbanData[column.id]?.length || 0}
                        </span>
                      </div>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {kanbanData[column.id]?.map(opp => (
                          <div
                            key={opp.id}
                            className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate('/opportunities')}
                          >
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{opp.companyName}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{opp.role}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                {opp.deadline ? format(new Date(opp.deadline), 'MMM dd') : 'No deadline'}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${column.color}`}>
                                {column.label}
                              </span>
                            </div>
                          </div>
                        ))}
                        {(!kanbanData[column.id] || kanbanData[column.id].length === 0) && (
                          <p className="text-xs text-gray-400 dark:text-gray-600 text-center py-4">No applications</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analytics Chart */}
          <Card className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Applications Over Time
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-600">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300 dark:text-gray-700" />
                  <p className="text-sm">Analytics chart coming soon</p>
                  <p className="text-xs mt-1">Track your application trends</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md rounded-lg h-11"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Application
              </Button>
              <Button
                onClick={() => navigate('/opportunities')}
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 rounded-lg h-11"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Add Company
              </Button>
              <Button
                onClick={() => navigate('/preparation-notes')}
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 rounded-lg h-11"
              >
                <FileUp className="h-4 w-4 mr-2" />
                Upload Resume
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentActivity.length > 0 ? (
                  recentActivity.map(activity => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {activity.companyName} - {activity.role}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                          {format(new Date(activity.timestamp), 'MMM dd, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Opportunity Modal */}
      <AddOpportunityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}
