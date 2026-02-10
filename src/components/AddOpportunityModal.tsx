import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { useOpportunitiesStore } from '@/store/opportunitiesStore'
import { ApplicationStatus } from '@/types'

interface AddOpportunityModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddOpportunityModal({ isOpen, onClose }: AddOpportunityModalProps) {
  const addOpportunity = useOpportunitiesStore((state) => state.addOpportunity)
  
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    status: 'saved' as ApplicationStatus,
    deadline: '',
    location: '',
    package: '',
    jobType: 'full-time' as 'full-time' | 'internship' | 'contract',
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!formData.role.trim()) newErrors.role = 'Role is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Add opportunity
    addOpportunity({
      companyName: formData.companyName,
      role: formData.role,
      status: formData.status,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      location: formData.location || undefined,
      package: formData.package || undefined,
      jobType: formData.jobType,
      notes: formData.notes || undefined,
      checklists: [],
      tags: [],
    })

    // Reset form and close
    setFormData({
      companyName: '',
      role: '',
      status: 'saved',
      deadline: '',
      location: '',
      package: '',
      jobType: 'full-time',
      notes: '',
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-background">
          <h2 className="text-2xl font-bold">Add New Opportunity</h2>
          <Button onClick={onClose} variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g., Google"
                className={errors.companyName ? 'border-red-500' : ''}
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">{errors.companyName}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-red-500">*</span>
              </Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Software Engineer"
                className={errors.role ? 'border-red-500' : ''}
              />
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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

            {/* Job Type */}
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <select
                id="jobType"
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value as typeof formData.jobType })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="full-time">Full Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            {/* Package */}
            <div className="space-y-2">
              <Label htmlFor="package">Package/Stipend</Label>
              <Input
                id="package"
                value={formData.package}
                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                placeholder="e.g., ₹25-30 LPA"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Bangalore, India"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes..."
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Opportunity
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
