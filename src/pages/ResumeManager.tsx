import { useState, useEffect, useCallback } from 'react'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Award,
  Clock,
  Trash2,
  Eye,
  Lightbulb,
  Target,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface AnalysisResult {
  id: string
  fileName: string
  score: number
  strengths: string[]
  improvements: string[]
  sectionsFound: string[]
  keywordsFound: string[]
  wordCount: number
  extractedText: string
}

interface ResumeHistory {
  _id: string
  fileName: string
  atsScore: number
  createdAt: string
  analysis: {
    wordCount: number
    sectionsFound: string[]
  }
}

export default function ResumeManager() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [history, setHistory] = useState<ResumeHistory[]>([])
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resume/history')
      if (response.ok) {
        const data = await response.json()
        setHistory(data.resumes || [])
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(selectedFile.type)) {
      alert('Please upload a PDF or DOCX file')
      return
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setFile(selectedFile)
    setResult(null)
  }

  const uploadResume = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    const formData = new FormData()
    formData.append('resume', file)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('http://localhost:5000/api/resume/analyze', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to analyze resume')
      }

      const data = await response.json()
      setResult(data)
      fetchHistory()
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload resume')
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const deleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return

    try {
      const response = await fetch(`http://localhost:5000/api/resume/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchHistory()
        if (result?.id === id) {
          setResult(null)
        }
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete resume')
    }
  }

  const viewResume = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/resume/${id}`)
      if (response.ok) {
        const data = await response.json()
        const resume = data.resume
        setResult({
          id: resume._id,
          fileName: resume.fileName,
          score: resume.atsScore,
          strengths: resume.analysis.strengths,
          improvements: resume.analysis.improvements,
          sectionsFound: resume.analysis.sectionsFound,
          keywordsFound: resume.analysis.keywordsFound,
          wordCount: resume.analysis.wordCount,
          extractedText: resume.extractedText,
        })
        setSelectedHistory(id)
      }
    } catch (error) {
      console.error('View error:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30'
    return 'bg-red-100 dark:bg-red-900/30'
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <FileText className="h-10 w-10 text-purple-600" />
          ATS Resume Analyzer
        </h1>
        <p className="text-muted-foreground mt-2">
          Upload your resume to get an AI-powered ATS compatibility score with actionable feedback
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Resume
              </CardTitle>
              <CardDescription>
                Upload your resume in PDF or DOCX format (Max 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  dragActive
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                    : 'border-gray-300 dark:border-gray-700 hover:border-purple-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop your resume here, or
                </p>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-purple-600 hover:text-purple-700 font-medium">
                    browse files
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleFileInput}
                  />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Supported formats: PDF, DOCX
                </p>
              </div>

              {file && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setFile(null)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              {uploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Analyzing resume...
                    </span>
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <Button
                onClick={uploadResume}
                disabled={!file || uploading}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
              >
                {uploading ? 'Analyzing...' : 'Analyze Resume'}
              </Button>
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Analysis History
              </CardTitle>
              <CardDescription>
                View your previous resume analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No analysis history yet
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.map((item) => (
                    <div
                      key={item._id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedHistory === item._id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => viewResume(item._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.fileName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <span className={`text-lg font-bold ${getScoreColor(item.atsScore)}`}>
                            {item.atsScore}
                          </span>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteResume(item._id)
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Score Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    ATS Compatibility Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <div className={`relative w-40 h-40 rounded-full flex items-center justify-center ${getScoreBgColor(result.score)}`}>
                      <div className="text-center">
                        <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                          {result.score}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          out of 100
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{result.sectionsFound.length}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Sections</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{result.keywordsFound.length}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Keywords</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{result.wordCount}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Words</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.strengths.length > 0 ? (
                    <ul className="space-y-2">
                      {result.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No strengths identified</p>
                  )}
                </CardContent>
              </Card>

              {/* Improvements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <Lightbulb className="h-5 w-5" />
                    Suggestions for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.improvements.length > 0 ? (
                    <ul className="space-y-2">
                      {result.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No improvements needed</p>
                  )}
                </CardContent>
              </Card>

              {/* Sections & Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Sections Found:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.sectionsFound.map((section, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Keywords Found ({result.keywordsFound.length}):</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.keywordsFound.slice(0, 15).map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                      {result.keywordsFound.length > 15 && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs rounded-full">
                          +{result.keywordsFound.length - 15} more
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Text Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Text Preview
                  </CardTitle>
                  <CardDescription>
                    First 1000 characters extracted from your resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-48 overflow-y-auto">
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {result.extractedText}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-16">
                <div className="text-center text-gray-400">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No Analysis Yet</p>
                  <p className="text-sm mt-2">Upload a resume to see ATS compatibility analysis</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
