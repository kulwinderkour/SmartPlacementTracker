import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Search } from 'lucide-react'

export default function Opportunities() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Opportunities</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage all your job applications
          </p>
        </div>
        <Button size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add Opportunity
        </Button>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Opportunities Yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Start adding job opportunities to track applications, deadlines, and progress
          </p>
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Your First Opportunity
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
