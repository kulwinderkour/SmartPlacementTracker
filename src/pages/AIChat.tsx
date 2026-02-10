import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Bot,
  User,
  Lightbulb,
  Code,
  Database,
  Globe,
  Cpu,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

const quickQuestions = [
  "What data structures should I focus on?",
  "Explain binary search algorithm",
  "How to prepare for system design?",
  "Best practices for databases in interviews",
  "Tips for behavioral interviews",
  "How to showcase my projects?",
]

const aiResponses: Record<string, string> = {
  "data structures": "Focus on these key data structures: 1) Arrays & Strings - Master basic operations, 2) Linked Lists - Single, double, circular variants, 3) Trees - Binary trees, BST, AVL, 4) Graphs - DFS, BFS, shortest path algorithms, 5) Hash Tables - Collision handling, 6) Heaps - Min/max heaps, priority queues. Practice at least 5 problems for each!",
  "binary search": "Binary Search is a divide-and-conquer algorithm that finds an element in a sorted array in O(log n) time. Key points: 1) Array must be sorted, 2) Compare middle element, 3) Eliminate half the search space each iteration. Common variations: finding first/last occurrence, searching in rotated array. Practice edge cases like single element or duplicates.",
  "system design": "System Design Interview Tips: 1) Clarify requirements first, 2) Start with high-level design, 3) Discuss scalability, 4) Address database choice (SQL vs NoSQL), 5) Consider caching (Redis), 6) Load balancing, 7) API design. Study: Design Twitter, URL Shortener, Netflix, Uber. Use resources like 'Grokking System Design' and SystemDesignPrimer on GitHub.",
  "database": "Database Interview Essentials: 1) SQL: Joins, Indexes, Aggregations, Subqueries, 2) ACID properties, 3) Normalization (1NF to 3NF), 4) Transactions & Locks, 5) NoSQL: When to use MongoDB vs Cassandra, 6) CAP theorem. Practice writing complex queries on platforms like HackerRank or LeetCode SQL section.",
  "behavioral": "Behavioral Interview Framework (STAR): 1) Situation - Set context, 2) Task - What needed to be done, 3) Action - What YOU did, 4) Result - Outcome with metrics. Prepare stories for: Leadership, Conflict, Failure, Success, Teamwork. Be specific, honest, and show growth. Research company values beforehand.",
  "projects": "Showcase Projects Effectively: 1) Choose 2-3 best projects, 2) Explain problem solved & impact, 3) Highlight technologies used, 4) Discuss challenges & solutions, 5) Quantify results (users, performance), 6) Have live demo ready, 7) Clean GitHub code with README. Make sure you can explain every line of code!",
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI placement assistant. I can help you with technical interview preparation, coding questions, system design, resume tips, and suggest areas to improve. Ask me anything!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const lowerText = text.toLowerCase()
      let response = "I understand you're asking about that topic. Let me help you! For the best interview preparation, focus on understanding core concepts deeply rather than memorizing. Practice regularly on platforms like LeetCode, HackerRank, and InterviewBit. Would you like specific tips on any particular topic?"

      // Match keywords to responses
      for (const [keyword, answer] of Object.entries(aiResponses)) {
        if (lowerText.includes(keyword)) {
          response = answer
          break
        }
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        suggestions: [
          "Tell me more about this",
          "Practice problems for this",
          "Common interview questions",
        ],
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleQuickQuestion = (question: string) => {
    handleSend(question)
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Chat cleared! How can I help you with your placement preparation?",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="p-8 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">AI Interview Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Get help with technical questions, interview prep, and improvement suggestions
          </p>
        </div>
        <Button onClick={clearChat} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Clear Chat
        </Button>
      </div>

      {/* Quick Topics */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Quick Topics</h3>
        <div className="flex gap-2 flex-wrap">
          {[
            { icon: Code, label: 'DSA', color: 'text-blue-600' },
            { icon: Database, label: 'Database', color: 'text-green-600' },
            { icon: Cpu, label: 'System Design', color: 'text-purple-600' },
            { icon: Globe, label: 'Web Dev', color: 'text-orange-600' },
          ].map((topic) => {
            const Icon = topic.icon
            return (
              <Button
                key={topic.label}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(`Tell me about ${topic.label}`)}
              >
                <Icon className={cn('mr-2 h-4 w-4', topic.color)} />
                {topic.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-3',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickQuestion(suggestion)}
                        className="text-xs px-3 py-1 rounded-full bg-background hover:bg-accent transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4 border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-left text-sm p-3 rounded-lg bg-muted hover:bg-accent transition-colors"
                >
                  <Lightbulb className="h-4 w-4 inline mr-2 text-yellow-600" />
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Ask me anything about interviews, coding, or preparation..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
