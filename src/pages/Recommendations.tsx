import { useMemo, useState } from 'react'
import {
  Lightbulb,
  TrendingUp,
  Star,
  Building2,
  MapPin,
  IndianRupee,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type JobRecommendation = {
  id: string
  company: string
  role: string
  location: string
  package: string
  matchScore: number
  matchReasons: string[]
  skills: string[]
  jobType: 'full-time' | 'internship' | 'contract'
  applyLink: string
  posted: string
}

const branchRecommendations: Record<string, JobRecommendation[]> = {
  'Computer Science': [
    {
      id: '1',
      company: 'Google',
      role: 'Software Engineer',
      location: 'Bangalore, India',
      package: '₹25-30 LPA',
      matchScore: 95,
      matchReasons: ['Top CS skills', 'Excellent package', 'Great culture'],
      skills: ['Python', 'JavaScript', 'System Design', 'Algorithms'],
      jobType: 'full-time',
      applyLink: 'https://careers.google.com',
      posted: '2 days ago',
    },
    {
      id: '2',
      company: 'Microsoft',
      role: 'SDE Intern',
      location: 'Hyderabad, India',
      package: '₹80k/month',
      matchScore: 92,
      matchReasons: ['CS background preferred', 'Internship opportunity', 'Learn from best'],
      skills: ['C++', 'Data Structures', 'Cloud Computing'],
      jobType: 'internship',
      applyLink: 'https://careers.microsoft.com',
      posted: '1 week ago',
    },
    {
      id: '3',
      company: 'Amazon',
      role: 'Software Development Engineer',
      location: 'Multiple locations',
      package: '₹20-25 LPA',
      matchScore: 90,
      matchReasons: ['Matches your profile', 'Multiple openings', 'Fast-growing team'],
      skills: ['Java', 'AWS', 'Microservices'],
      jobType: 'full-time',
      applyLink: 'https://www.amazon.jobs',
      posted: '3 days ago',
    },
  ],
  'Information Technology': [
    {
      id: '4',
      company: 'Accenture',
      role: 'Technology Analyst',
      location: 'Pan India',
      package: '₹6-8 LPA',
      matchScore: 88,
      matchReasons: ['IT background', 'Multiple roles', 'Good growth'],
      skills: ['Java', 'DevOps', 'Agile'],
      jobType: 'full-time',
      applyLink: 'https://www.accenture.com/careers',
      posted: '5 days ago',
    },
  ],
  'Electrical Engineering': [
    {
      id: '5',
      company: 'Tesla',
      role: 'Electrical Engineer',
      location: 'Remote',
      package: '₹15-18 LPA',
      matchScore: 87,
      matchReasons: ['EE background', 'Innovation focused', 'Global exposure'],
      skills: ['Circuit Design', 'Power Electronics', 'MATLAB'],
      jobType: 'full-time',
      applyLink: 'https://www.tesla.com/careers',
      posted: '1 week ago',
    },
  ],
  'Mechanical Engineering': [
    {
      id: '6',
      company: 'Tata Motors',
      role: 'Design Engineer',
      location: 'Pune, India',
      package: '₹8-10 LPA',
      matchScore: 85,
      matchReasons: ['Mechanical background', 'Automotive industry', 'Good package'],
      skills: ['CAD', 'ANSYS', 'Manufacturing'],
      jobType: 'full-time',
      applyLink: 'https://www.tatamotors.com/careers',
      posted: '4 days ago',
    },
  ],
}

export default function Recommendations() {
  const [selectedBranch, setSelectedBranch] = useState('Computer Science')

  const branches = useMemo(() => Object.keys(branchRecommendations), [])
  const recommendations = branchRecommendations[selectedBranch] || []

  const handleRefresh = () => {
    // Trigger re-render or fetch fresh data
    setSelectedBranch(selectedBranch)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400'
    if (score >= 80) return 'text-blue-600 dark:text-blue-400'
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getMatchScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/30'
    if (score >= 80) return 'bg-blue-100 dark:bg-blue-900/30'
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/30'
    return 'bg-gray-100 dark:bg-gray-800'
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Job Recommendations</h1>
          <p className="text-muted-foreground mt-2">
            Personalized job suggestions based on your branch and skills
          </p>
        </div>
        <Button onClick={handleRefresh} size="lg" variant="outline">
          <RefreshCw className="mr-2 h-5 w-5" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recommendations</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendations.length}</div>
            <p className="text-xs text-muted-foreground">For {selectedBranch}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Match</CardTitle>
            <Star className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {recommendations.filter(r => r.matchScore >= 90).length}
            </div>
            <p className="text-xs text-muted-foreground">90%+ match score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Full-Time Roles</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recommendations.filter(r => r.jobType === 'full-time').length}
            </div>
            <p className="text-xs text-muted-foreground">Permanent positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internships</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recommendations.filter(r => r.jobType === 'internship').length}
            </div>
            <p className="text-xs text-muted-foreground">Learning opportunities</p>
          </CardContent>
        </Card>
      </div>

      {/* Branch Filter */}
      <div>
        <h3 className="text-sm font-medium mb-3">Select Your Branch</h3>
        <div className="flex gap-2 flex-wrap">
          {branches.map((branch) => (
            <Button
              key={branch}
              variant={selectedBranch === branch ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedBranch(branch)}
            >
              {branch}
            </Button>
          ))}
        </div>
      </div>

      {/* Recommendations Grid */}
      {recommendations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Recommendations Available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Try selecting a different branch to see personalized job recommendations
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Top Matches for {selectedBranch}
            </h3>
            <span className="text-sm text-muted-foreground">
              {recommendations.length} recommendations
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {recommendations.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{job.company}</CardTitle>
                      <CardDescription className="text-base font-medium text-foreground">
                        {job.role}
                      </CardDescription>
                    </div>
                    <div className={cn(
                      'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold',
                      getMatchScoreBg(job.matchScore),
                      getMatchScoreColor(job.matchScore)
                    )}>
                      <Star className="h-4 w-4 fill-current" />
                      {job.matchScore}%
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{job.package}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Why this matches:</h4>
                    <ul className="space-y-1">
                      {job.matchReasons.map((reason, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xs text-muted-foreground">
                      Posted {job.posted}
                    </span>
                    <Button size="sm" asChild>
                      <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apply Now
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
