import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, isPast, isFuture } from 'date-fns'
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Plus,
  Search,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useOpportunitiesStore } from '@/store/opportunitiesStore'
import { cn } from '@/lib/utils'
import type { Opportunity } from '@/types'

export default function ApplicationBoard() {
  const navigate = useNavigate()
  const opportunities = useOpportunitiesStore((state) => state.opportunities)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all')

  const { openApplications, closedApplications } = useMemo(() => {
    const filtered = opportunities.filter((opp) =>
      opp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const open = filtered.filter((opp) => 
      !opp.deadline || isFuture(new Date(opp.deadline))
    )
    const closed = filtered.filter((opp) => 
      opp.deadline && isPast(new Date(opp.deadline))
    )

    return { 
      openApplications: open,
      closedApplications: closed
    }
  }, [opportunities, searchQuery])

  const displayedApps = statusFilter === 'all' 
    ? opportunities 
    : statusFilter === 'open' 
      ? openApplications 
      : closedApplications

  const getStatusBadge = (opp: Opportunity) => {
    const isOpen = !opp.deadline || isFuture(new Date(opp.deadline))
    return (
      <div className={cn(
        'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium',
        isOpen 
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      )}>
        {isOpen ? (
          <>
            <CheckCircle2 className="h-3 w-3" />
            Open
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3" />
            Closed
          </>
        )}
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      saved: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'online-assessment': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'interview-scheduled': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'interview-completed': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      'offer-received': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      accepted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    }
    return colors[status] || colors.saved
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Application Board</h1>
          <p className="text-muted-foreground mt-2">
            Track which applications are open for applications and which have closed
          </p>
        </div>
        <Button onClick={() => navigate('/opportunities')} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add Application
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Applications</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Still accepting applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Applications</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Deadline has passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities.length}</div>
            <p className="text-xs text-muted-foreground">
              All tracked opportunities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies or roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'open' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('open')}
          >
            Open
          </Button>
          <Button
            variant={statusFilter === 'closed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('closed')}
          >
            Closed
          </Button>
        </div>
      </div>

      {/* Applications Grid */}
      {displayedApps.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Applications Found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Start adding opportunities to track'}
            </p>
            <Button onClick={() => navigate('/opportunities')} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Application
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedApps.map((opp) => {
            const isOpen = !opp.deadline || isFuture(new Date(opp.deadline))
            return (
              <Card
                key={opp.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/opportunities')}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{opp.companyName}</CardTitle>
                    {getStatusBadge(opp)}
                  </div>
                  <CardDescription>{opp.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className={cn(
                      'px-2 py-1 rounded text-xs font-medium capitalize',
                      getStatusColor(opp.status)
                    )}>
                      {opp.status.replace('-', ' ')}
                    </span>
                  </div>
                  {opp.deadline && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Deadline:</span>
                      <span className={cn(
                        'text-sm font-medium',
                        isOpen ? 'text-foreground' : 'text-red-600 dark:text-red-400'
                      )}>
                        {format(new Date(opp.deadline), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                  {opp.location && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <span className="text-sm">{opp.location}</span>
                    </div>
                  )}
                  {opp.package && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Package:</span>
                      <span className="text-sm font-semibold">{opp.package}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
