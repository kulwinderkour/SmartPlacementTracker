import { useState } from 'react'
import {
  BookOpen,
  FileText,
  Download,
  Plus,
  Trash2,
  ExternalLink,
  Code,
  Database,
  Cpu,
  Globe,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils'

type PreparationNote = {
  id: string
  title: string
  category: string
  type: 'pdf' | 'link' | 'note'
  content: string
  fileUrl?: string
  createdAt: Date
}

const categories = [
  { name: 'Data Structures & Algorithms', icon: Code, color: 'text-blue-600' },
  { name: 'System Design', icon: Cpu, color: 'text-purple-600' },
  { name: 'Database', icon: Database, color: 'text-green-600' },
  { name: 'Web Development', icon: Globe, color: 'text-orange-600' },
  { name: 'General', icon: FileText, color: 'text-gray-600' },
]

const sampleResources: PreparationNote[] = [
  {
    id: '1',
    title: 'LeetCode Top 150 Interview Questions',
    category: 'Data Structures & Algorithms',
    type: 'link',
    content: 'https://leetcode.com/studyplan/top-interview-150/',
    createdAt: new Date('2026-02-01'),
  },
  {
    id: '2',
    title: 'System Design Primer',
    category: 'System Design',
    type: 'link',
    content: 'https://github.com/donnemartin/system-design-primer',
    createdAt: new Date('2026-02-02'),
  },
  {
    id: '3',
    title: 'SQL Practice Problems',
    category: 'Database',
    type: 'link',
    content: 'https://www.hackerrank.com/domains/sql',
    createdAt: new Date('2026-02-03'),
  },
  {
    id: '4',
    title: 'React Interview Questions',
    category: 'Web Development',
    type: 'link',
    content: 'https://github.com/sudheerj/reactjs-interview-questions',
    createdAt: new Date('2026-02-04'),
  },
]

export default function PreparationNotes() {
  const [notes, setNotes] = useState<PreparationNote[]>(sampleResources)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNote, setNewNote] = useState<{
    title: string
    category: string
    type: 'pdf' | 'link' | 'note'
    content: string
  }>({
    title: '',
    category: 'General',
    type: 'link',
    content: '',
  })

  const filteredNotes = selectedCategory === 'All'
    ? notes
    : notes.filter(note => note.category === selectedCategory)

  const handleAddNote = () => {
    if (!newNote.title || !newNote.content) return

    const note: PreparationNote = {
      id: crypto.randomUUID(),
      title: newNote.title,
      category: newNote.category,
      type: newNote.type,
      content: newNote.content,
      createdAt: new Date(),
    }

    setNotes([note, ...notes])
    setNewNote({ title: '', category: 'General', type: 'link', content: '' })
    setIsAddingNote(false)
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.name === category)
    return cat || categories[4]
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Preparation Notes</h1>
          <p className="text-muted-foreground mt-2">
            Save important resources, PDFs, and links for your preparation
          </p>
        </div>
        <Button onClick={() => setIsAddingNote(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add Resource
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-5">
        {categories.map((cat) => {
          const Icon = cat.icon
          const count = notes.filter(n => n.category === cat.name).length
          return (
            <Card
              key={cat.name}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                selectedCategory === cat.name && 'ring-2 ring-primary'
              )}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium truncate">{cat.name.split(' ')[0]}</CardTitle>
                <Icon className={cn('h-4 w-4', cat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">resources</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === 'All' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('All')}
        >
          All Resources
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.name}
            variant={selectedCategory === cat.name ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.name)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Add New Resource</CardTitle>
            <CardDescription>Add a link, PDF, or note for your preparation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., LeetCode Practice Problems"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newNote.type}
                  onChange={(e) => setNewNote({ ...newNote, type: e.target.value as 'link' | 'pdf' | 'note' })}
                >
                  <option value="link">Link</option>
                  <option value="pdf">PDF</option>
                  <option value="note">Note</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">
                {newNote.type === 'link' ? 'URL' : newNote.type === 'pdf' ? 'PDF URL' : 'Content'}
              </Label>
              <Input
                id="content"
                placeholder={newNote.type === 'note' ? 'Write your notes here...' : 'https://...'}
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddNote}>
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
              <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Resources Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Start adding preparation resources, PDFs, and important links
            </p>
            <Button onClick={() => setIsAddingNote(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add First Resource
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => {
            const catInfo = getCategoryIcon(note.category)
            const Icon = catInfo.icon
            return (
              <Card key={note.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={cn('h-5 w-5', catInfo.color)} />
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <CardDescription>{note.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {note.type === 'link' && (
                    <a
                      href={note.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Link
                    </a>
                  )}
                  {note.type === 'pdf' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  )}
                  {note.type === 'note' && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {note.content}
                    </p>
                  )}
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    Added {note.createdAt.toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
