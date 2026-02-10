export interface UserProfile {
  name: string
  email: string
  branch: string
  cgpa: number
  skills: string[]
  resumeText?: string
  targetRoles?: string[]
  isOnboarded: boolean
  mood?: 'excellent' | 'good' | 'okay' | 'stressed' | 'overwhelmed'
  lastMoodUpdate?: Date
  streak?: number
  lastActiveDate?: Date
}

export type ApplicationStatus = 
  | 'saved'
  | 'applied'
  | 'online-assessment'
  | 'interview-scheduled'
  | 'interview-completed'
  | 'offer-received'
  | 'rejected'
  | 'accepted'

export interface Checklist {
  id: string
  text: string
  completed: boolean
}

export interface ActivityLog {
  id: string
  timestamp: Date
  action: string
  type: 'status_change' | 'created' | 'updated' | 'deadline' | 'note'
}

export interface Opportunity {
  id: string
  companyName: string
  role: string
  status: ApplicationStatus
  deadline?: Date
  appliedDate?: Date
  activityLog: ActivityLog[]
  location?: string
  package?: string
  jobType?: 'full-time' | 'internship' | 'contract'
  description?: string
  requirements?: string[]
  notes?: string
  checklists: Checklist[]
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface DashboardWidget {
  id: string
  type: 'upcoming-deadlines' | 'application-stats' | 'pending-tasks' | 'quick-actions'
  order: number
  visible: boolean
}
