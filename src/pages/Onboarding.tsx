import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { GraduationCap, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useUserProfileStore } from '@/store/userProfileStore'

const onboardingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  branch: z.string().min(2, 'Branch is required'),
  cgpa: z.coerce.number().min(0).max(10, 'CGPA must be between 0 and 10'),
  skills: z.string().min(1, 'Add at least one skill'),
})

type OnboardingFormData = z.infer<typeof onboardingSchema>

export default function Onboarding() {
  const navigate = useNavigate()
  const setProfile = useUserProfileStore((state) => state.setProfile)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  })

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true)
    
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500))

    const skillsArray = data.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    setProfile({
      name: data.name,
      email: data.email,
      branch: data.branch,
      cgpa: data.cgpa,
      skills: skillsArray,
      isOnboarded: true,
    })

    setIsSubmitting(false)
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">
              Welcome to Smart Placement Tracker
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Your personal companion for a stress-free placement journey
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@university.edu"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch/Degree</Label>
                <Input
                  id="branch"
                  placeholder="Computer Science"
                  {...register('branch')}
                  className={errors.branch ? 'border-destructive' : ''}
                />
                {errors.branch && (
                  <p className="text-sm text-destructive">{errors.branch.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cgpa">CGPA</Label>
                <Input
                  id="cgpa"
                  type="number"
                  step="0.01"
                  placeholder="8.5"
                  {...register('cgpa')}
                  className={errors.cgpa ? 'border-destructive' : ''}
                />
                {errors.cgpa && (
                  <p className="text-sm text-destructive">{errors.cgpa.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                placeholder="React, Node.js, Python, SQL"
                {...register('skills')}
                className={errors.skills ? 'border-destructive' : ''}
              />
              {errors.skills && (
                <p className="text-sm text-destructive">{errors.skills.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Separate skills with commas
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Setting up your profile...'
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Started
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
