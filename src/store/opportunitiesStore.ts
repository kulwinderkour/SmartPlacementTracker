import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Opportunity, ApplicationStatus, Checklist,  ActivityLog } from '@/types'

// Sample initial opportunities
const sampleOpportunities: Opportunity[] = [
  {
    id: crypto.randomUUID(),
    companyName: 'Google',
    role: 'Software Engineer',
    status: 'interview-scheduled',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    location: 'Bangalore, India',
    package: '₹25-30 LPA',
    jobType: 'full-time',
    notes: 'System design round scheduled',
    checklists: [
      { id: crypto.randomUUID(), text: 'Prepare system design basics', completed: true },
      { id: crypto.randomUUID(), text: 'Review past interview questions', completed: false },
    ],
    activityLog: [
      { id: crypto.randomUUID(), timestamp: new Date(), action: 'Interview scheduled for next week', type: 'status_change' },
      { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), action: 'Application submitted', type: 'created' },
    ],
    tags: ['tech', 'preferred'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    companyName: 'Microsoft',
    role: 'SDE Intern',
    status: 'online-assessment',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    location: 'Hyderabad, India',
    package: '₹80k/month',
    jobType: 'internship',
    notes: 'Complete coding assessment',
    checklists: [
      { id: crypto.randomUUID(), text: 'Practice LeetCode medium problems', completed: false },
    ],
    activityLog: [
      { id: crypto.randomUUID(), timestamp: new Date(), action: 'Online assessment link received', type: 'status_change' },
      { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), action: 'Application submitted', type: 'created' },
    ],
    tags: ['tech', 'internship'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    companyName: 'Amazon',
    role: 'Software Development Engineer',
    status: 'applied',
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    location: 'Multiple locations',
    package: '₹20-25 LPA',
    jobType: 'full-time',
    notes: 'Waiting for response',
    checklists: [],
    activityLog: [
      { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), action: 'Application submitted', type: 'created' },
    ],
    tags: ['tech'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
]

interface OpportunitiesStore {
  opportunities: Opportunity[]
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt' | 'activityLog'>) => void
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void
  deleteOpportunity: (id: string) => void
  updateStatus: (id: string, status: ApplicationStatus) => void
  toggleChecklist: (opportunityId: string, checklistId: string) => void
  addChecklist: (opportunityId: string, text: string) => void
  deleteChecklist: (opportunityId: string, checklistId: string) => void
  addActivityLog: (opportunityId: string, action: string, type: ActivityLog['type']) => void
  clearAllOpportunities: () => void
  initializeSampleData: () => void
}

export const useOpportunitiesStore = create<OpportunitiesStore>()(
  persist(
    (set: any, get: any): OpportunitiesStore => ({
      opportunities: [],
      
      initializeSampleData: () => {
        const current = get().opportunities
        if (current.length === 0) {
          set({ opportunities: sampleOpportunities })
        }
      },

     addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt' | 'activityLog'>) =>
        set((state: OpportunitiesStore) => ({
          opportunities: [
            ...state.opportunities,
            {
              ...opportunity,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              updatedAt: new Date(),
              deadline: opportunity.deadline ? new Date(opportunity.deadline) : undefined,
              appliedDate: opportunity.appliedDate ? new Date(opportunity.appliedDate) : undefined,
              activityLog: [
                {
                  id: crypto.randomUUID(),
                  timestamp: new Date(),
                  action: `Added ${opportunity.companyName} - ${opportunity.role}`,
                  type: 'created',
                },
              ],
            },
          ],
        })),

      updateOpportunity: (id: string, updates: Partial<Opportunity>) =>
        set((state: OpportunitiesStore) => ({
          opportunities: state.opportunities.map((opp: Opportunity) =>
            opp.id === id
              ? { 
                  ...opp, 
                  ...updates, 
                  updatedAt: new Date(),
                  deadline: updates.deadline ? new Date(updates.deadline) : opp.deadline,
                  appliedDate: updates.appliedDate ? new Date(updates.appliedDate) : opp.appliedDate,
                }
              : opp
          ),
        })),

      deleteOpportunity: (id: string) =>
        set((state: OpportunitiesStore) => ({
          opportunities: state.opportunities.filter((opp: Opportunity) => opp.id !== id),
        })),

      updateStatus: (id: string, status: ApplicationStatus) =>
        set((state: OpportunitiesStore) => ({
          opportunities: state.opportunities.map((opp: Opportunity) =>
            opp.id === id
              ? { 
                  ...opp, 
                  status, 
                  updatedAt: new Date(),
                  activityLog: [
                    {
                      id: crypto.randomUUID(),
                      timestamp: new Date(),
                      action: `Status changed to ${status.replace('-', ' ')}`,
                      type: 'status_change',
                    },
                    ...opp.activityLog,
                  ],
                }
              : opp
          ),
        })),

      addActivityLog: (opportunityId: string, action: string, type: ActivityLog['type']) =>
        set((state: OpportunitiesStore) => ({
          opportunities: state.opportunities.map((opp: Opportunity) =>
            opp.id === opportunityId
              ? {
                  ...opp,
                  activityLog: [
                    {
                      id: crypto.randomUUID(),
                      timestamp: new Date(),
                      action,
                      type,
                    },
                    ...opp.activityLog,
                  ],
                  updatedAt: new Date(),
                }
              : opp
          ),
        })),

      toggleChecklist: (opportunityId: string, checklistId: string) =>
        set((state: OpportunitiesStore) => ({
          opportunities: state.opportunities.map((opp: Opportunity) =>
            opp.id === opportunityId
              ? {
                  ...opp,
                  checklists: opp.checklists.map((item: Checklist) =>
                    item.id === checklistId
                      ? { ...item, completed: !item.completed }
                      : item
                  ),
                  updatedAt: new Date(),
                }
              : opp
          ),
        })),

      addChecklist: (opportunityId: string, text: string) =>
        set((state: OpportunitiesStore) => ({
          opportunities: state.opportunities.map((opp: Opportunity) =>
            opp.id === opportunityId
              ? {
                  ...opp,
                  checklists: [
                    ...opp.checklists,
                    { id: crypto.randomUUID(), text, completed: false } as Checklist,
                  ],
                  updatedAt: new Date(),
                }
              : opp
          ),
        })),

      deleteChecklist: (opportunityId: string, checklistId: string) =>
        set((state: OpportunitiesStore) => ({
          opportunities: state.opportunities.map((opp: Opportunity) =>
            opp.id === opportunityId
              ? {
                  ...opp,
                  checklists: opp.checklists.filter((item: Checklist) => item.id !== checklistId),
                  updatedAt: new Date(),
                }
              : opp
          ),
        })),

      clearAllOpportunities: () => set({ opportunities: [] }),
    }),
    {
      name: 'opportunities-storage',
    }
  )
)
