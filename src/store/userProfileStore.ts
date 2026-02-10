import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile } from '@/types'

interface UserProfileStore {
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  updateMood: (mood: UserProfile['mood']) => void
  updateStreak: () => void
  clearProfile: () => void
}

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  branch: '',
  cgpa: 0,
  skills: [],
  isOnboarded: false,
  streak: 0,
}

export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set: any, get: any): UserProfileStore => ({
      profile: null,
      setProfile: (profile: UserProfile) => set({ profile }),
      updateProfile: (updates: Partial<UserProfile>) =>
        set((state: UserProfileStore) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),
      updateMood: (mood: UserProfile['mood']) =>
        set((state: UserProfileStore) => ({
          profile: state.profile 
            ? { ...state.profile, mood, lastMoodUpdate: new Date() } 
            : null,
        })),
      updateStreak: () =>
        set((state: UserProfileStore) => {
          if (!state.profile) return state
          
          const today = new Date().setHours(0, 0, 0, 0)
          const lastActive = state.profile.lastActiveDate 
            ? new Date(state.profile.lastActiveDate).setHours(0, 0, 0, 0)
            : 0
          
          const dayDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24))
          
          let newStreak = state.profile.streak || 0
          if (dayDiff === 0) {
            // Same day, don't change streak
          } else if (dayDiff === 1) {
            // Consecutive day
            newStreak += 1
          } else {
            // Streak broken
            newStreak = 1
          }
          
          return {
            profile: {
              ...state.profile,
              streak: newStreak,
              lastActiveDate: new Date(),
            },
          }
        }),
      clearProfile: () => set({ profile: defaultProfile }),
    }),
    {
      name: 'user-profile-storage',
    }
  )
)
