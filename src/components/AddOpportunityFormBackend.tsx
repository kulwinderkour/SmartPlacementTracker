// ==================================================
// ADD OPPORTUNITY FORM COMPONENT WITH BACKEND
// ==================================================
// This component shows a form to add new opportunities and saves to MongoDB

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { createOpportunity, OpportunityData } from '@/services/opportunityAPI'

interface AddOpportunityFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: OpportunityData) => void
}

export default function AddOpportunityFormBackend({ isOpen, onClose, onSuccess }: AddOpportunityFormProps) {
  // ==================================================
  // STATE MANAGEMENT
  // ==================================================
  
  // Form data state - stores all input values
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'saved',
    deadline: '',
    link: '',
  })

  // Loading state - shows when form is submitting
  const [isLoading, setIsLoading] = useState(false)

  // Error state - shows error messages
  const [error, setError] = useState('')

  // Success state - shows success message
  const [success, setSuccess] = useState(false)

  // If modal is closed, don't render anything
  if (!isOpen) return null

  // ==================================================
  // HANDLE INPUT CHANGES
  // ==================================================
  /**
   * Called whenever user types in any input field
   * Updates the formData state
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setFormData((prev) => ({
      ...prev,        // Keep all existing values
      [name]: value,  // Update only the changed field
    }))
  }

  // ==================================================
  // HANDLE FORM SUBMIT
  // ==================================================
  /**
   * Called when user clicks "Add Opportunity" button
   * Sends data to backend API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent page reload

    // Reset error and success messages
    setError('')
    setSuccess(false)

    // Validate required fields
    if (!formData.company || !formData.role) {
      setError('Company and role are required!')
      return
    }

    try {
      // Show loading spinner
      setIsLoading(true)

      // Send data to backend API
      const response = await createOpportunity(formData)

      // If successful
      if (response.success) {
        setSuccess(true)
        
        // Reset form
        setFormData({
          company: '',
          role: '',
          status: 'saved',
          deadline: '',
          link: '',
        })

        // Call parent's onSuccess callback if provided
        if (onSuccess && response.data) {
          onSuccess(response.data)
        }

        // Close modal after 1.5 seconds
        setTimeout(() => {
          onClose()
          setSuccess(false)
        }, 1500)
      }
    } catch (err) {
      // Show error message
      const errorMessage = err instanceof Error ? err.message : 'Failed to create opportunity'
      setError(errorMessage)
    } finally {
      // Hide loading spinner
      setIsLoading(false)
    }
  }

  // ==================================================
  // HANDLE MODAL CLOSE
  // ==================================================
  const handleClose = () => {
    // Reset all states
    setFormData({
      company: '',
      role: '',
      status: 'saved',
      deadline: '',
      link: '',
    })
    setError('')
    setSuccess(false)
    onClose()
  }

  // ==================================================
  // RENDER COMPONENT
  // ==================================================
  return (
    // Overlay - Dark background
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Modal Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add New Opportunity
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                ✅ Opportunity created successfully!
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                ❌ {error}
              </p>
            </div>
          )}

          {/* Company Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g., Google"
              required
              className="w-full"
            />
          </div>

          {/* Role Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Software Engineer"
              required
              className="w-full"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="saved">Saved</option>
              <option value="applied">Applied</option>
              <option value="online-assessment">Online Assessment</option>
              <option value="interview-scheduled">Interview Scheduled</option>
              <option value="interview-completed">Interview Completed</option>
              <option value="offer-received">Offer Received</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          {/* Deadline Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deadline
            </label>
            <Input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Link Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Posting Link
            </label>
            <Input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={isLoading}
            >
              {/* Show loading text when submitting */}
              {isLoading ? 'Creating...' : 'Add Opportunity'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
