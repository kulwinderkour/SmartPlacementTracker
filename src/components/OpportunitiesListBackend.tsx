// ==================================================
// OPPORTUNITIES LIST COMPONENT WITH BACKEND
// ==================================================
// This component fetches and displays all opportunities from MongoDB

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Briefcase, Calendar, ExternalLink, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import AddOpportunityFormBackend from './AddOpportunityFormBackend'
import { getAllOpportunities, deleteOpportunity, OpportunityData } from '@/services/opportunityAPI'

export default function OpportunitiesListBackend() {
  // ==================================================
  // STATE MANAGEMENT
  // ==================================================
  
  // All opportunities from database
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([])
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true)
  
  // Error state
  const [error, setError] = useState('')
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ==================================================
  // FETCH OPPORTUNITIES FROM BACKEND
  // ==================================================
  /**
   * Fetches all opportunities from database
   * Called when component loads and after creating new opportunity
   */
  const fetchOpportunities = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // Call API to get all opportunities
      const response = await getAllOpportunities()
      
      // Update state with fetched data
      if (response.success && response.data) {
        setOpportunities(response.data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load opportunities'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // ==================================================
  // USE EFFECT - RUN ON COMPONENT MOUNT
  // ==================================================
  /**
   * useEffect runs when component first loads
   * We use it to fetch opportunities from database
   */
  useEffect(() => {
    fetchOpportunities()
  }, []) // Empty array = run only once when component loads

  // ==================================================
  // HANDLE DELETE OPPORTUNITY
  // ==================================================
  const handleDelete = async (id: string) => {
    // Confirm before deleting
    if (!confirm('Are you sure you want to delete this opportunity?')) {
      return
    }

    try {
      await deleteOpportunity(id)
      // Refresh the list after deletion
      fetchOpportunities()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete opportunity'
      alert('Failed to delete opportunity: ' + errorMessage)
    }
  }

  // ==================================================
  // HANDLE SUCCESS CALLBACK
  // ==================================================
  /**
   * Called after successfully creating new opportunity
   * Refreshes the list to show the new opportunity
   */
  const handleSuccess = () => {
    fetchOpportunities()
  }

  // ==================================================
  // STATUS COLOR MAPPING
  // ==================================================
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'saved': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      'applied': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'online-assessment': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'interview-scheduled': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      'interview-completed': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      'offer-received': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'rejected': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      'accepted': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    }
    return colors[status] || colors['saved']
  }

  // ==================================================
  // FORMAT STATUS TEXT
  // ==================================================
  const formatStatus = (status: string) => {
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // ==================================================
  // RENDER COMPONENT
  // ==================================================
  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Job Opportunities
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            All opportunities from database ({opportunities.length})
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Opportunity
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6">
            <p className="text-red-700 dark:text-red-300 font-medium">
              ❌ {error}
            </p>
            <Button
              onClick={fetchOpportunities}
              variant="outline"
              className="mt-3"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && opportunities.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              No opportunities yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
              Get started by adding your first job opportunity
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Opportunity
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Opportunities Grid */}
      {!isLoading && !error && opportunities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opportunity) => (
            <Card
              key={opportunity._id}
              className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {opportunity.company}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {opportunity.role}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => opportunity._id && handleDelete(opportunity._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 space-y-3">
                {/* Status Badge */}
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(opportunity.status)}`}>
                    {formatStatus(opportunity.status)}
                  </span>
                </div>

                {/* Deadline */}
                {opportunity.deadline && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Deadline: {format(new Date(opportunity.deadline), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}

                {/* Link */}
                {opportunity.link && (
                  <a
                    href={opportunity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Job Posting
                  </a>
                )}

                {/* Created Date */}
                <div className="text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
                  Created: {opportunity.createdAt ? format(new Date(opportunity.createdAt), 'MMM dd, yyyy h:mm a') : 'Unknown'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Opportunity Modal */}
      <AddOpportunityFormBackend
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
