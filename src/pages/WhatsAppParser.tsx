import { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Save,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

interface Reminder {
  title: string;
  category: string;
  priority: string;
  dueDate: string;
  dateText: string;
  description?: string;
  _id?: string;
}

interface AnalysisResult {
  summary: string;
  reminders: Reminder[];
  stats: {
    totalLines: number;
    totalWords: number;
    datesFound: number;
    tasksFound: number;
  };
}

const SAMPLE_MESSAGE = `Hey everyone! 👋

Important Updates:

1. Project submission deadline is December 20, 2024
2. Don't forget the team meeting tomorrow at 3 PM
3. Interview scheduled for 25th December
4. Assignment on Data Structures - submit by next week
5. Important: Final exam on January 15, 2025

Please mark your calendars! See you all soon.`;

export default function WhatsAppParser() {
  const [messageText, setMessageText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAnalyze = async () => {
    if (!messageText.trim()) {
      setError('Please paste a WhatsApp message to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/parser/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: messageText }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError('Failed to analyze message. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveReminders = async () => {
    if (!analysisResult || analysisResult.reminders.length === 0) {
      setError('No reminders to save');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/parser/save-reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reminders: analysisResult.reminders,
          originalMessage: messageText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save reminders');
      }

      const data = await response.json();
      setSuccessMessage(`✅ ${data.message}`);
      
      // Clear analysis after saving
      setTimeout(() => {
        setAnalysisResult(null);
        setMessageText('');
      }, 2000);
    } catch (err) {
      setError('Failed to save reminders. Please try again.');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setMessageText('');
    setAnalysisResult(null);
    setError('');
    setSuccessMessage('');
  };

  const handleLoadSample = () => {
    setMessageText(SAMPLE_MESSAGE);
    setError('');
    setSuccessMessage('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300';
      case 'medium':
        return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300';
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700/30 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'assignment':
        return '📝';
      case 'exam':
        return '📚';
      case 'meeting':
        return '👥';
      case 'interview':
        return '🎯';
      case 'deadline':
        return '⏰';
      case 'event':
        return '📅';
      default:
        return '📌';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-green-600" />
            WhatsApp Message Parser
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Paste WhatsApp messages to automatically extract tasks, dates, and create reminders
          </p>
        </div>
        <Button
          onClick={handleLoadSample}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Load Sample
        </Button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Section */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Paste WhatsApp Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Paste your WhatsApp group message here...&#10;&#10;Example:&#10;Hey team!&#10;Project submission: December 20, 2024&#10;Team meeting tomorrow at 3 PM&#10;Don't forget!"
              className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-gray-900 dark:text-white dark:bg-gray-900 placeholder-gray-400 resize-none font-mono text-sm"
            />

            <div className="flex gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !messageText.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Message
                  </>
                )}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Results Section */}
        <div className="space-y-6">
          {/* Summary */}
          {analysisResult && (
            <>
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
                    <Sparkles className="h-5 w-5" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {analysisResult.summary}
                  </p>
                 
                </CardContent>
              </Card>

              {/* Detected Reminders */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Detected Reminders ({analysisResult.reminders.length})
                  </CardTitle>
                  {analysisResult.reminders.length > 0 && (
                    <Button
                      onClick={handleSaveReminders}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save All
                        </>
                      )}
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {analysisResult.reminders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No reminders detected</p>
                      <p className="text-sm mt-1">Try adding dates and tasks to your message</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {analysisResult.reminders.map((reminder, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-900/50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{getCategoryIcon(reminder.category)}</span>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {reminder.title}
                                </h3>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(reminder.priority)}`}>
                                  {reminder.priority.toUpperCase()}
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-900/30 dark:text-purple-300">
                                  {reminder.category}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="h-4 w-4" />
                                {reminder.dateText}
                              </div>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {format(new Date(reminder.dueDate), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Instructions */}
          {!analysisResult && (
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-green-900 dark:text-green-300">
                  How to Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-xl">1️⃣</span>
                  <p>Copy messages from WhatsApp group chat</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">2️⃣</span>
                  <p>Paste them in the text area on the left</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">3️⃣</span>
                  <p>Click "Analyze Message" to extract tasks and dates</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">4️⃣</span>
                  <p>Review detected reminders and click "Save All"</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">5️⃣</span>
                  <p>Get notifications when deadlines approach!</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
