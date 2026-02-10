import { useMemo } from 'react'
import { formatDistanceToNow, format, isFuture, differenceInDays } from 'date-fns'
import {
  Bell,
  BellRing,
  Clock,
  Briefcase,
  AlertCircle,
  Calendar,
  CheckCircle,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useOpportunitiesStore } from '@/store/opportunitiesStore'
import { cn } from '@/lib/utils'

type Notification = {
  id: string
  type: 'deadline' | 'status-change' | 'new-opportunity' | 'reminder'
  title: string
  message: string
  timestamp: Date
  priority: 'high' | 'medium' | 'low'
  read: boolean
}

export default function Notifications() {
  const opportunities = useOpportunitiesStore((state) => state.opportunities)

  const notifications = useMemo(() => {
    const notifs: Notification[] = []

    // Deadline notifications (within 3 days)
    opportunities.forEach((opp) => {
      if (opp.deadline && isFuture(new Date(opp.deadline))) {
        const daysUntil = differenceInDays(new Date(opp.deadline), new Date())
        if (daysUntil <= 3) {
          notifs.push({
            id: `deadline-${opp.id}`,
            type: 'deadline',
            title: `Deadline Approaching: ${opp.companyName}`,
            message: `Application deadline for ${opp.role} is in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
            timestamp: new Date(opp.deadline),
            priority: daysUntil <= 1 ? 'high' : 'medium',
            read: false,
          })
        }
      }
    })

    // Recent status changes (last 7 days)
    opportunities.forEach((opp) => {
      const daysSinceUpdate = differenceInDays(new Date(), new Date(opp.updatedAt))
      if (daysSinceUpdate <= 7) {
        notifs.push({
          id: `status-${opp.id}`,
          type: 'status-change',
          title: `${opp.companyName} - Status Update`,
          message: `Application status changed to "${opp.status.replace('-', ' ')}"`,
          timestamp: new Date(opp.updatedAt),
          priority: opp.status === 'offer-received' ? 'high' : 'low',
          read: false,
        })
      }
    })

    // New opportunities (created in last 7 days)
    opportunities.forEach((opp) => {
      const daysSinceCreation = differenceInDays(new Date(), new Date(opp.createdAt))
      if (daysSinceCreation <= 7) {
        notifs.push({
          id: `new-${opp.id}`,
          type: 'new-opportunity',
          title: `New Opportunity Added`,
          message: `${opp.companyName} - ${opp.role}`,
          timestamp: new Date(opp.createdAt),
          priority: 'medium',
          read: false,
        })
      }
    })

    // Sort by timestamp (newest first)
    return notifs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [opportunities])

  const { high, medium, low } = useMemo(() => {
    return {
      high: notifications.filter(n => n.priority === 'high').length,
      medium: notifications.filter(n => n.priority === 'medium').length,
      low: notifications.filter(n => n.priority === 'low').length,
    }
  }, [notifications])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'deadline':
        return <Clock className="h-5 w-5 text-red-600" />
      case 'status-change':
        return <TrendingUp className="h-5 w-5 text-blue-600" />
      case 'new-opportunity':
        return <Briefcase className="h-5 w-5 text-green-600" />
      case 'reminder':
        return <Bell className="h-5 w-5 text-yellow-600" />
      default:
        return <BellRing className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50 dark:bg-red-950/20'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
      case 'low':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20'
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-2">
          Stay updated with recent job opportunities and application deadlines
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">All notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{high}</div>
            <p className="text-xs text-muted-foreground">Urgent action needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Priority</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{medium}</div>
            <p className="text-xs text-muted-foreground">Review soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Priority</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{low}</div>
            <p className="text-xs text-muted-foreground">For your info</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
            <p className="text-muted-foreground text-center max-w-md">
              You're all caught up! Add opportunities to start receiving notifications
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              Latest updates from your applications and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    'flex gap-4 p-4 rounded-lg border-l-4 transition-colors hover:bg-accent/50',
                    getPriorityColor(notif.priority)
                  )}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-sm">{notif.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                    {notif.type === 'deadline' && (
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>{format(notif.timestamp, 'PPP')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
