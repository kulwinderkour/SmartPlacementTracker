import express from 'express';
import Reminder from '../models/Reminder.js';

const router = express.Router();

/**
 * Parse WhatsApp message and extract information
 * Uses regex and NLP techniques to identify dates, tasks, and priorities
 */
function parseWhatsAppMessage(text) {
  // Extract dates using various formats
  const datePatterns = [
    // Format: 25/12/2024, 25-12-2024, 25.12.2024
    /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/g,
    // Format: December 25, 2024 or Dec 25, 2024
    /(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),?\s+(\d{4})/gi,
    // Format: 25th December, 25 Dec
    /(\d{1,2})(st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/gi,
    // Format: tomorrow, today, next week
    /(tomorrow|today|tonight|next\s+week|next\s+month)/gi,
  ];

  const extractedDates = [];
  const dateTexts = new Set();

  datePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      dateTexts.add(match[0]);
    }
  });

  // Convert extracted date strings to Date objects
  const now = new Date();
  dateTexts.forEach(dateText => {
    let date = null;
    const lowerText = dateText.toLowerCase();

    if (lowerText === 'today') {
      date = new Date();
    } else if (lowerText === 'tomorrow') {
      date = new Date();
      date.setDate(date.getDate() + 1);
    } else if (lowerText === 'tonight') {
      date = new Date();
      date.setHours(20, 0, 0, 0);
    } else if (lowerText.includes('next week')) {
      date = new Date();
      date.setDate(date.getDate() + 7);
    } else if (lowerText.includes('next month')) {
      date = new Date();
      date.setMonth(date.getMonth() + 1);
    } else {
      // Try parsing standard date formats
      const parsed = new Date(dateText);
      if (!isNaN(parsed.getTime())) {
        date = parsed;
      }
    }

    if (date && !isNaN(date.getTime())) {
      extractedDates.push({
        text: dateText,
        date: date,
      });
    }
  });

  return extractedDates;
}

/**
 * Extract tasks and their priority from text
 */
function extractTasks(text) {
  const tasks = [];
  
  // Keywords for different categories
  const categoryKeywords = {
    assignment: ['assignment', 'homework', 'project', 'submission', 'submit'],
    exam: ['exam', 'test', 'quiz', 'examination', 'midterm', 'final'],
    meeting: ['meeting', 'meet', 'discussion', 'call', 'conference'],
    interview: ['interview', 'interview round', 'hr round', 'technical round'],
    deadline: ['deadline', 'due', 'last date'],
    event: ['event', 'seminar', 'workshop', 'webinar', 'session'],
  };

  // Priority keywords
  const priorityKeywords = {
    urgent: ['urgent', 'asap', 'immediate', 'critical', 'emergency', 'important'],
    high: ['important', 'priority', 'crucial', 'essential', 'mandatory'],
    medium: ['soon', 'upcoming', 'scheduled'],
    low: ['optional', 'if possible', 'when free'],
  };

  // Split text into lines
  const lines = text.split('\n').filter(line => line.trim().length > 0);

  lines.forEach(line => {
    // Detect category
    let category = 'other';
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => line.toLowerCase().includes(keyword))) {
        category = cat;
        break;
      }
    }

    // Detect priority
    let priority = 'medium';
    for (const [pri, keywords] of Object.entries(priorityKeywords)) {
      if (keywords.some(keyword => line.toLowerCase().includes(keyword))) {
        priority = pri;
        break;
      }
    }

    // Check if line contains task indicators
    const taskIndicators = ['submit', 'complete', 'finish', 'prepare', 'attend', 'join', 'remember', 'don\'t forget'];
    const hasTaskIndicator = taskIndicators.some(indicator => line.toLowerCase().includes(indicator));

    if (hasTaskIndicator || category !== 'other') {
      tasks.push({
        title: line.trim(),
        category,
        priority,
      });
    }
  });

  return tasks;
}

/**
 * Generate AI-powered summary
 */
function generateSummary(text) {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const wordCount = text.split(/\s+/).length;
  
  // Extract key sentences (simple extractive summarization)
  const importantLines = lines.filter(line => {
    const lowerLine = line.toLowerCase();
    return (
      lowerLine.includes('important') ||
      lowerLine.includes('remember') ||
      lowerLine.includes('deadline') ||
      lowerLine.includes('submit') ||
      lowerLine.includes('exam') ||
      lowerLine.includes('meeting') ||
      lowerLine.includes('interview') ||
      line.includes('?') ||
      line.includes('!')
    );
  });

  // If we have important lines, use them
  if (importantLines.length > 0) {
    return importantLines.slice(0, 3).join(' ');
  }

  // Otherwise, take first few lines
  return lines.slice(0, 2).join(' ');
}

/**
 * @route   POST /api/parser/analyze
 * @desc    Analyze WhatsApp message text
 * @access  Public
 */
router.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    // Parse the message
    const extractedDates = parseWhatsAppMessage(text);
    const tasks = extractTasks(text);
    const summary = generateSummary(text);

    // Combine tasks with dates
    const reminders = [];
    
    if (tasks.length > 0 && extractedDates.length > 0) {
      // Match tasks with dates
      tasks.forEach((task, index) => {
        const dateIndex = index < extractedDates.length ? index : 0;
        reminders.push({
          ...task,
          dueDate: extractedDates[dateIndex].date,
          dateText: extractedDates[dateIndex].text,
        });
      });
    } else if (tasks.length > 0) {
      // Tasks without dates - set to tomorrow
      tasks.forEach(task => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        reminders.push({
          ...task,
          dueDate: tomorrow,
          dateText: 'tomorrow (auto-assigned)',
        });
      });
    } else if (extractedDates.length > 0) {
      // Dates without tasks
      extractedDates.forEach(dateInfo => {
        reminders.push({
          title: `Event on ${dateInfo.text}`,
          category: 'event',
          priority: 'medium',
          dueDate: dateInfo.date,
          dateText: dateInfo.text,
        });
      });
    }

    res.json({
      success: true,
      summary,
      reminders,
      stats: {
        totalLines: text.split('\n').length,
        totalWords: text.split(/\s+/).length,
        datesFound: extractedDates.length,
        tasksFound: tasks.length,
      },
    });
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ message: 'Error analyzing message' });
  }
});

/**
 * @route   POST /api/parser/save-reminders
 * @desc    Save extracted reminders to database
 * @access  Public
 */
router.post('/save-reminders', async (req, res) => {
  try {
    const { reminders, originalMessage } = req.body;

    if (!reminders || !Array.isArray(reminders)) {
      return res.status(400).json({ message: 'Reminders array is required' });
    }

    // Save all reminders to database
    const savedReminders = await Promise.all(
      reminders.map(reminder => {
        const newReminder = new Reminder({
          title: reminder.title,
          description: reminder.description || '',
          dueDate: reminder.dueDate,
          priority: reminder.priority || 'medium',
          category: reminder.category || 'other',
          originalMessage: originalMessage || '',
          source: 'whatsapp-parser',
        });
        return newReminder.save();
      })
    );

    res.status(201).json({
      success: true,
      message: `${savedReminders.length} reminders saved successfully`,
      reminders: savedReminders,
    });
  } catch (error) {
    console.error('Save reminders error:', error);
    res.status(500).json({ message: 'Error saving reminders' });
  }
});

/**
 * @route   GET /api/parser/reminders
 * @desc    Get all reminders
 * @access  Public
 */
router.get('/reminders', async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = status ? { status } : {};
    const reminders = await Reminder.find(query).sort({ dueDate: 1 });

    res.json({
      success: true,
      count: reminders.length,
      reminders,
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ message: 'Error fetching reminders' });
  }
});

/**
 * @route   PUT /api/parser/reminders/:id
 * @desc    Update reminder status
 * @access  Public
 */
router.put('/reminders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reminder = await Reminder.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({
      success: true,
      reminder,
    });
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({ message: 'Error updating reminder' });
  }
});

/**
 * @route   DELETE /api/parser/reminders/:id
 * @desc    Delete a reminder
 * @access  Public
 */
router.delete('/reminders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const reminder = await Reminder.findByIdAndDelete(id);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({
      success: true,
      message: 'Reminder deleted successfully',
    });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ message: 'Error deleting reminder' });
  }
});

export default router;
