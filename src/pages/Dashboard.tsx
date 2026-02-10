import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, formatDistanceToNow, isFuture, differenceInDays } from 'date-fns'
import {
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  Plus,
  AlertCircle,
  Search,
  Flame,
  Smile,
  Meh,
  Frown,
  Zap,
  Target,
  RefreshCw,
  Sparkles,
  Heart,
  ListChecks,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useOpportunitiesStore } from '@/store/opportunitiesStore'
import { useUserProfileStore } from '@/store/userProfileStore'
import { UserProfile } from '@/types'
import AddOpportunityModal from '@/components/AddOpportunityModal'
import { cn } from '@/lib/utils'

const motivationalQuotes = [
  { mood: 'excellent', quote: "You're crushing it! Keep this momentum going! 🚀" },
  { mood: 'excellent', quote: "Success is yours! Your hard work is paying off! 🌟" },
  { mood: 'good', quote: "Great progress! One step closer to your dream job! 💪" },
  { mood: 'good', quote: "You're doing awesome! Stay focused and keep going! ✨" },
  { mood: 'okay', quote: "Every application brings you closer. Keep pushing forward! 🎯" },
  { mood: 'okay', quote: "Believe in yourself! You've got what it takes! 💫" },
  { mood: 'stressed', quote: "Take a deep breath. You're stronger than this challenge! 🌈" },
  { mood: 'stressed', quote: "Difficult roads lead to beautiful destinations. Hang in there! 🌸" },
  { mood: 'overwhelmed', quote: "One task at a time. You've got this! Break it down! 🧘" },
  { mood: 'overwhelmed', quote: "Rest is productive too. Take care of yourself first! ❤️" },
  { mood: null, quote: "Your future is created by what you do today! 🎓" },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { opportunities, initializeSampleData } = useOpportunitiesStore()
  const { profile, updateMood, updateStreak } = useUserProfileStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize sample data and update streak on mount
  useEffect(() => {
    initializeSampleData()
    updateStreak()
    setIsLoading(false)
  }, [initializeSampleData, updateStreak])

  // Filter opportunities by search
  const filteredOpportunities = useMemo(() => {
    if (!searchQuery.trim()) return opportunities
    
    const query = searchQuery.toLowerCase()
    return opportunities.filter(
      (opp) =>
        opp.companyName.toLowerCase().includes(query) ||
        opp.role.toLowerCase().includes(query)
    )
  }, [opportunities, searchQuery])

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredOpportunities.length
    const applied = filteredOpportunities.filter((o) =>
      ['applied', 'online-assessment', 'interview-scheduled', 'interview-completed'].includes(o.status)
    ).length
    const offers = filteredOpportunities.filter((o) => o.status === 'offer-received').length
    const upcoming = filteredOpportunities.filter((o) =>
      o.deadline && isFuture(new Date(o.deadline)) && differenceInDays(new Date(o.deadline), new Date()) <= 7
    ).length

    return { total, applied, offers, upcoming }
  }, [filteredOpportunities])

  // Upcoming deadlines (next 5, within 7 days)
  const upcomingDeadlines = useMemo(() => {
    return filteredOpportunities
      .filter((o) => o.deadline && isFuture(new Date(o.deadline)))
      .sort((a, b) =>
        new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
      )
      .slice(0, 5)
  }, [filteredOpportunities])

  // Recent activity from activity logs
  const recentActivity = useMemo(() => {
    const allLogs = filteredOpportunities.flatMap((opp) =>
      opp.activityLog.map((log) => ({
        ...log,
        companyName: opp.companyName,
        role: opp.role,
        status: opp.status,
      }))
    )
    
    return allLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
  }, [filteredOpportunities])

  // Pending tasks (unchecked checklist items)
  const pendingTasks = useMemo(() => {
    const tasks = filteredOpportunities.flatMap((opp) =>
      opp.checklists
        .filter((check) => !check.completed)
        .map((check) => ({
          ...check,
          companyName: opp.companyName,
          oppId: opp.id,
        }))
    )
    return tasks.slice(0, 5)
  }, [filteredOpportunities])

  // Progress calculation
  const progress = useMemo(() => {
    if (stats.applied === 0) return 0
    return Math.round((stats.offers / stats.applied) * 100)
  }, [stats])

  // Get motivational quote based on mood
  const currentQuote = useMemo(() => {
    const moodQuotes = motivationalQuotes.filter(
      (q) => q.mood === profile?.mood || q.mood === null
    )
    return moodQuotes[currentQuoteIndex % moodQuotes.length]?.quote || motivationalQuotes[0].quote
  }, [profile?.mood, currentQuoteIndex])

  const handleMoodUpdate = (mood: UserProfile['mood']) => {
    updateMood(mood)
  }

  const refreshQuote = () => {
    setCurrentQuoteIndex((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header with Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Your Placement Journey! 👋
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Track applications, prepare for interviews, and ace your placements with AI-powered assistance.
          </p>
        </div>
        
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add
          </Button>
        </div>
      </div>

      {/* Motivation & Streak Widget */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <CardTitle>Daily Motivation</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={refreshQuote}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium italic mb-4">{currentQuote}</p>
            
            {/* Mood Check-in */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">How are you feeling today?</p>
              <div className="flex gap-2">
                {[
                  { mood: 'excellent' as const, icon: Sparkles, label: 'Excellent', color: 'text-green-600' },
                  { mood: 'good' as const, icon: Smile, label: 'Good', color: 'text-blue-600' },
                  { mood: 'okay' as const, icon: Meh, label: 'Okay', color: 'text-yellow-600' },
                  { mood: 'stressed' as const, icon: Frown, label: 'Stressed', color: 'text-orange-600' },
                  { mood: 'overwhelmed' as const, icon: AlertCircle, label: 'Overwhelmed', color: 'text-red-600' },
                ].map(({ mood, icon: Icon, label, color }) => (
                  <button
                    key={mood}
                    onClick={() => handleMoodUpdate(mood)}
                    className={cn(
                      'flex-1 p-3 rounded-lg border-2 transition-all hover:scale-105',
                      profile?.mood === mood
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                    title={label}
                  >
                    <Icon className={cn('h-6 w-6 mx-auto', color)} />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-600" />
              <CardTitle>Your Streak</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-orange-600">
                  {profile?.streak || 0} 🔥
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile?.streak === 0 ? 'Start your streak today!' : 'Days active'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Keep it going!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last active: {profile?.lastActiveDate
                    ? formatDistanceToNow(new Date(profile.lastActiveDate), { addSuffix: true })
                    : 'Never'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tracked companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applied}</div>
            <p className="text-xs text-muted-foreground">In various stages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers Received</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.offers}</div>
            <p className="text-xs text-muted-foreground">Pending decisions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground">Need attention (7 days)</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar Widget */}
      {stats.applied > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <CardTitle>Application Success Rate</CardTitle>
            </div>
            <CardDescription>Your conversion from applications to offers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{stats.offers} offers</span>
                <span className="font-semibold">{progress}%</span>
                <span>{stats.applied} applications</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 flex items-center justify-center text-xs text-white font-semibold"
                  style={{ width: `${Math.max(progress, 5)}%` }}
                >
                  {progress}%
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {progress < 20 && "Keep applying! Every rejection brings you closer to acceptance."}
                {progress >= 20 && progress < 50 && "You're making good progress! Keep it up!"}
                {progress >= 50 && "Excellent conversion rate! You're doing great!"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Don't miss these important dates</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming deadlines</p>
                <p className="text-sm mt-1">Add opportunities to track deadlines</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((opp) => {
                  const daysLeft = differenceInDays(new Date(opp.deadline!), new Date())
                  const isUrgent = daysLeft <= 3
                  
                  return (
                    <div
                      key={opp.id}
                      className={cn(
                        'p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md',
                        isUrgent
                          ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
                          : 'bg-card hover:bg-accent/50'
                      )}
                      onClick={() => navigate('/opportunities')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium text-sm">{opp.companyName}</p>
                          <p className="text-xs text-muted-foreground">{opp.role}</p>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            'text-sm font-medium',
                            isUrgent && 'text-red-600 dark:text-red-400'
                          )}>
                            {format(new Date(opp.deadline!), 'MMM dd')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No activity yet</p>
                <p className="text-sm mt-1">Start adding opportunities to see updates</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/opportunities')}
                  >
                    <div
                      className={cn(
                        'rounded-full p-2 mt-0.5',
                        log.type === 'status_change' && log.status === 'offer-received' && 'bg-green-100 dark:bg-green-900/30',
                        log.type === 'status_change' && log.status === 'rejected' && 'bg-red-100 dark:bg-red-900/30',
                        log.type === 'created' && 'bg-blue-100 dark:bg-blue-900/30',
                        !['offer-received', 'rejected'].includes(log.status || '') && log.type !== 'created' && 'bg-purple-100 dark:bg-purple-900/30'
                      )}
                    >
                      {log.type === 'created' && <Plus className="h-3 w-3" />}
                      {log.type === 'status_change' && <CheckCircle2 className="h-3 w-3" />}
                      {log.type === 'note' && <AlertCircle className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="font-medium text-sm truncate">{log.companyName}</p>
                      <p className="text-xs text-muted-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Pending Tasks
            </CardTitle>
            <CardDescription>Unchecked checklist items</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No pending tasks</p>
                <p className="text-sm mt-1">You're all caught up! 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/opportunities')}
                  >
                    <div className="mt-0.5">
                      <div className="w-4 h-4 rounded border-2 border-gray-400" />
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-sm font-medium">{task.text}</p>
                      <p className="text-xs text-muted-foreground">{task.companyName}</p>
                    </div>
                  </div>
                ))}
                {filteredOpportunities.flatMap(o => o.checklists.filter(c => !c.completed)).length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/opportunities')}
                  >
                    View all tasks
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {opportunities.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Add your first job opportunity to begin tracking your placement progress
            </p>
            <Button onClick={() => setIsModalOpen(true)} size="lg">
              Add First Opportunity
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Opportunity Modal */}
      <AddOpportunityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
