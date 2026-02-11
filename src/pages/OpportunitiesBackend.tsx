// ==================================================
// OPPORTUNITIES PAGE WITH BACKEND INTEGRATION
// ==================================================
// This page uses the backend API to manage opportunities

import OpportunitiesListBackend from '@/components/OpportunitiesListBackend'

export default function OpportunitiesBackend() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OpportunitiesListBackend />
    </div>
  )
}
