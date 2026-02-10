import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Switch } from '@/components/ui/Switch'
import { useTheme } from '@/lib/theme'
import { useUserProfileStore } from '@/store/userProfileStore'
import { useOpportunitiesStore } from '@/store/opportunitiesStore'
import { Moon, Sun, Trash2, Download, UserCircle } from 'lucide-react'

export default function Settings() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const profile = useUserProfileStore((state) => state.profile)
  const clearProfile = useUserProfileStore((state) => state.clearProfile)
  const clearOpportunities = useOpportunitiesStore((state) => state.clearAllOpportunities)
  const opportunities = useOpportunitiesStore((state) => state.opportunities)

  const handleExportData = () => {
    const data = {
      profile,
      opportunities,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `placement-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearProfile()
      clearOpportunities()
      navigate('/onboarding', { replace: true })
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your preferences and data
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
            <UserCircle className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="font-semibold">{profile?.name}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <p className="text-sm text-muted-foreground">
                {profile?.branch} • CGPA: {profile?.cgpa}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong>Skills:</strong> {profile?.skills?.join(', ') || 'None'}
          </p>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize your visual preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme-toggle" className="text-base">
                Dark Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark themes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                id="theme-toggle"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export or clear your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All Data (JSON)
            </Button>
            <p className="text-xs text-muted-foreground px-3">
              Download a backup of your profile and opportunities
            </p>
          </div>

          <div className="pt-4 border-t space-y-2">
            <Button
              onClick={handleClearAllData}
              variant="destructive"
              className="w-full justify-start"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Data
            </Button>
            <p className="text-xs text-muted-foreground px-3">
              ⚠️ This will delete all your data and return you to onboarding
            </p>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Smart Placement Tracker</strong> v1.0.0
          </p>
          <p>
            An offline-first placement companion built with React, TypeScript, and Vite.
          </p>
          <p className="pt-2">
            All data is stored locally in your browser using localStorage.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
