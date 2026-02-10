import { useState, useEffect, useMemo } from 'react'
import {
  Trophy,
  Flame,
  Star,
  Award,
  Target,
  Zap,
  Heart,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useOpportunitiesStore } from '@/store/opportunitiesStore'
import { cn } from '@/lib/utils'

type Badge = {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  unlocked: boolean
  progress?: number
  total?: number
}

const motivationalQuotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "Everything you've ever wanted is on the other side of fear. - George Addair",
  "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger. Be bigger.",
]

export default function Motivation() {
  const opportunities = useOpportunitiesStore((state) => state.opportunities)
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0])
  const streak = 7 // Simulated streak

  useEffect(() => {
    // Rotate quote daily
    const today = new Date().getDate()
    setCurrentQuote(motivationalQuotes[today % motivationalQuotes.length])
  }, [])

  const badges: Badge[] = useMemo(() => [
    {
      id: '1',
      name: 'First Step',
      description: 'Added your first opportunity',
      icon: Trophy,
      color: 'text-yellow-600',
      unlocked: opportunities.length >= 1,
      progress: Math.min(opportunities.length, 1),
      total: 1,
    },
    {
      id: '2',
      name: 'On Fire',
      description: 'Maintain a 7-day streak',
      icon: Flame,
      color: 'text-orange-600',
      unlocked: streak >= 7,
      progress: streak,
      total: 7,
    },
    {
      id: '3',
      name: 'Application Master',
      description: 'Track 10 opportunities',
      icon: Star,
      color: 'text-blue-600',
      unlocked: opportunities.length >= 10,
      progress: Math.min(opportunities.length, 10),
      total: 10,
    },
    {
      id: '4',
      name: 'Overachiever',
      description: 'Apply to 5 companies',
      icon: Award,
      color: 'text-purple-600',
      unlocked: opportunities.filter(o => o.status !== 'saved').length >= 5,
      progress: Math.min(opportunities.filter(o => o.status !== 'saved').length, 5),
      total: 5,
    },
    {
      id: '5',
      name: 'Interview Pro',
      description: 'Complete 3 interviews',
      icon: Target,
      color: 'text-green-600',
      unlocked: opportunities.filter(o => o.status === 'interview-completed').length >= 3,
      progress: Math.min(opportunities.filter(o => o.status === 'interview-completed').length, 3),
      total: 3,
    },
    {
      id: '6',
      name: 'Offer Receiver',
      description: 'Receive your first offer',
      icon: Zap,
      color: 'text-pink-600',
      unlocked: opportunities.some(o => o.status === 'offer-received'),
      progress: opportunities.filter(o => o.status === 'offer-received').length,
      total: 1,
    },
  ], [opportunities, streak])

  const unlockedBadges = badges.filter(b => b.unlocked).length
  const totalBadges = badges.length

  const stats = useMemo(() => ({
    totalApplications: opportunities.length,
    appliedCount: opportunities.filter(o => o.status !== 'saved').length,
    offersReceived: opportunities.filter(o => o.status === 'offer-received').length,
    interviewsCompleted: opportunities.filter(o => o.status === 'interview-completed').length,
  }), [opportunities])

  const refreshQuote = () => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setCurrentQuote(randomQuote)
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Motivation Hub</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress, earn badges, and stay motivated on your placement journey
        </p>
      </div>

      {/* Daily Quote */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Daily Motivation
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshQuote}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg italic text-foreground/90">
            "{currentQuote}"
          </p>
        </CardContent>
      </Card>

      {/* Streak Counter */}
      <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-red-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-600" />
            Current Streak
          </CardTitle>
          <CardDescription>Keep up the momentum!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-6xl font-bold text-orange-600">{streak}</div>
            <div>
              <p className="text-xl font-semibold">Days</p>
              <p className="text-sm text-muted-foreground">
                You're doing amazing! Keep going! 🔥
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-8 w-8 rounded-md flex items-center justify-center text-xs font-bold',
                  i < streak
                    ? 'bg-orange-600 text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {i < streak ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">Total tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applied</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.appliedCount}</div>
            <p className="text-xs text-muted-foreground">Submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.interviewsCompleted}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.offersReceived}</div>
            <p className="text-xs text-muted-foreground">Received</p>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Achievements & Badges
              </CardTitle>
              <CardDescription className="mt-1">
                {unlockedBadges} of {totalBadges} badges unlocked
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-600">{unlockedBadges}</div>
              <div className="text-xs text-muted-foreground">Unlocked</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge) => {
              const Icon = badge.icon
              return (
                <div
                  key={badge.id}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all',
                    badge.unlocked
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-muted bg-muted/30 opacity-60 grayscale'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'rounded-full p-2',
                      badge.unlocked ? 'bg-background' : 'bg-muted'
                    )}>
                      <Icon className={cn('h-6 w-6', badge.color)} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold flex items-center gap-2">
                        {badge.name}
                        {badge.unlocked && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {badge.description}
                      </p>
                      {badge.total && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span className="font-medium">
                              {badge.progress}/{badge.total}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full transition-all',
                                badge.unlocked ? 'bg-green-600' : 'bg-primary'
                              )}
                              style={{
                                width: `${((badge.progress || 0) / badge.total) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
