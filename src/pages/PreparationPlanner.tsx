import { useState, useMemo } from 'react'
import { format, addDays, differenceInDays, isSameDay } from 'date-fns'
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils'

type Task = {
  id: string
  title: string
  category: 'coding' | 'resume' | 'interview' | 'networking' | 'other'
  priority: 'high' | 'medium' | 'low'
  dueDate: Date
  completed: boolean
  createdAt: Date
}

const categoryColors = {
  coding: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  resume: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  interview: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  networking: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Practice 5 LeetCode problems',
    category: 'coding',
    priority: 'high',
    dueDate: new Date(),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Update resume with latest project',
    category: 'resume',
    priority: 'high',
    dueDate: addDays(new Date(), 1),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Prepare STAR stories for behavioral questions',
    category: 'interview',
    priority: 'medium',
    dueDate: addDays(new Date(), 2),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'Reach out to alumni on LinkedIn',
    category: 'networking',
    priority: 'low',
    dueDate: addDays(new Date(), 3),
    completed: false,
    createdAt: new Date(),
  },
]

export default function PreparationPlanner() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'coding' as Task['category'],
    priority: 'medium' as Task['priority'],
    dueDate: format(new Date(), 'yyyy-MM-dd'),
  })

  const taskStats = useMemo(() => {
    const today = new Date()
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = total - completed
    const overdue = tasks.filter(t => !t.completed && differenceInDays(today, t.dueDate) > 0).length
    const dueToday = tasks.filter(t => !t.completed && isSameDay(t.dueDate, today)).length

    return { total, completed, pending, overdue, dueToday }
  }, [tasks])

  const tasksByDay = useMemo(() => {
    const next7Days = [...Array(7)].map((_, i) => addDays(new Date(), i))
    return next7Days.map(day => ({
      date: day,
      tasks: tasks.filter(t => isSameDay(t.dueDate, day)),
    }))
  }, [tasks])

  const handleAddTask = () => {
    if (!newTask.title) return

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      category: newTask.category,
      priority: newTask.priority,
      dueDate: new Date(newTask.dueDate),
      completed: false,
      createdAt: new Date(),
    }

    setTasks([...tasks, task])
    setNewTask({
      title: '',
      category: 'coding',
      priority: 'medium',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
    })
    setIsAddingTask(false)
  }

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-blue-600'
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Preparation Planner</h1>
          <p className="text-muted-foreground mt-2">
            Plan your interview preparation with daily tasks and goals
          </p>
        </div>
        <Button onClick={() => setIsAddingTask(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
            <p className="text-xs text-muted-foreground">All planned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
            <p className="text-xs text-muted-foreground">Finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{taskStats.pending}</div>
            <p className="text-xs text-muted-foreground">To do</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{taskStats.dueToday}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
            <p className="text-xs text-muted-foreground">Late</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Task Form */}
      {isAddingTask && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>Plan your next preparation activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="e.g., Practice 10 coding problems"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value as Task['category'] })}
                >
                  <option value="coding">Coding</option>
                  <option value="resume">Resume</option>
                  <option value="interview">Interview</option>
                  <option value="networking">Networking</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTask}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
              <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Planner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Next 7 Days
          </CardTitle>
          <CardDescription>Your preparation schedule for the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasksByDay.map(({ date, tasks: dayTasks }) => {
              const isToday = isSameDay(date, new Date())
              return (
                <div
                  key={date.toISOString()}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all',
                    isToday && 'border-primary bg-primary/5'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">
                        {format(date, 'EEEE, MMM dd')}
                        {isToday && <span className="ml-2 text-primary text-sm">(Today)</span>}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  {dayTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No tasks scheduled</p>
                  ) : (
                    <div className="space-y-2">
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-background border hover:shadow-sm transition-shadow"
                        >
                          <button
                            onClick={() => handleToggleTask(task.id)}
                            className="flex-shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          <div className="flex-1">
                            <p className={cn(
                              'font-medium',
                              task.completed && 'line-through text-muted-foreground'
                            )}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={cn(
                                'text-xs px-2 py-0.5 rounded capitalize',
                                categoryColors[task.category]
                              )}>
                                {task.category}
                              </span>
                              <span className={cn('text-xs font-medium', getPriorityColor(task.priority))}>
                                {task.priority} priority
                              </span>
                            </div>
                          </div>
                          <Button
                            variant= "ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
