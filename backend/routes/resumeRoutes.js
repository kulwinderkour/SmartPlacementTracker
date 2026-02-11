import express from 'express';
import multer from 'multer';
import { createRequire } from 'module';
import mammoth from 'mammoth';
import Resume from '../models/Resume.js';
import PDFParser from 'pdf2json';

const require = createRequire(import.meta.url);

const router = express.Router();

// Configure multer for file upload (store in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'));
    }
  },
});

// Extract text from PDF
async function extractTextFromPDF(buffer) {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new PDFParser();
      
      pdfParser.on('pdfParser_dataError', (errData) => {
        console.error('PDF parsing error:', errData.parserError);
        reject(new Error(`Failed to parse PDF: ${errData.parserError}`));
      });
      
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        try {
          // Extract text from parsed PDF data
          let text = '';
          if (pdfData.Pages) {
            pdfData.Pages.forEach(page => {
              if (page.Texts) {
                page.Texts.forEach(textItem => {
                  if (textItem.R) {
                    textItem.R.forEach(r => {
                      if (r.T) {
                        try {
                          text += decodeURIComponent(r.T) + ' ';
                        } catch (e) {
                          // If decoding fails, it's likely not encoded, so use raw text
                          text += r.T + ' ';
                        }
                      }
                    });
                  }
                });
              }
            });
          }
          resolve(text.trim());
        } catch (error) {
          console.error('Error extracting text from PDF data:', error);
          reject(new Error(`Failed to extract text: ${error.message}`));
        }
      });
      
      pdfParser.parseBuffer(buffer);
    } catch (error) {
      console.error('PDF extraction error:', error);
      reject(new Error(`Failed to extract text from PDF: ${error.message}`));
    }
  });
}

// Extract text from DOCX
async function extractTextFromDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
}

// ATS Scoring Algorithm
function analyzeResume(text) {
  const analysis = {
    strengths: [],
    improvements: [],
    sectionsFound: [],
    keywordsFound: [],
    wordCount: 0,
  };

  let score = 0;
  const textLower = text.toLowerCase();
  const words = text.split(/\s+/).filter(word => word.length > 0);
  analysis.wordCount = words.length;

  // 1. Section Detection (25 points)
  const sections = {
    experience: /\b(experience|work history|employment|professional experience)\b/i,
    education: /\b(education|academic|qualification|degree)\b/i,
    skills: /\b(skills|technical skills|core competencies|expertise)\b/i,
    summary: /\b(summary|profile|objective|about me)\b/i,
    projects: /\b(projects|portfolio|work samples)\b/i,
    certifications: /\b(certifications|certificates|licenses)\b/i,
  };

  let sectionsScore = 0;
  Object.entries(sections).forEach(([section, regex]) => {
    if (regex.test(textLower)) {
      analysis.sectionsFound.push(section.charAt(0).toUpperCase() + section.slice(1));
      sectionsScore += 5;
    }
  });
  score += Math.min(sectionsScore, 25);

  if (analysis.sectionsFound.length >= 4) {
    analysis.strengths.push('Well-structured resume with key sections');
  } else {
    analysis.improvements.push('Add missing sections: Skills, Experience, Education, Summary');
  }

  // 2. Keyword Density (25 points)
  const techKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker',
    'kubernetes', 'git', 'agile', 'html', 'css', 'typescript', 'mongodb',
    'express', 'api', 'rest', 'testing', 'ci/cd', 'leadership', 'management',
    'analytics', 'data', 'machine learning', 'ai', 'cloud', 'azure', 'gcp',
  ];

  let keywordCount = 0;
  techKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = textLower.match(regex);
    if (matches) {
      keywordCount++;
      if (!analysis.keywordsFound.includes(keyword)) {
        analysis.keywordsFound.push(keyword);
      }
    }
  });

  const keywordScore = Math.min((keywordCount / 10) * 25, 25);
  score += keywordScore;

  if (keywordCount >= 8) {
    analysis.strengths.push(`Contains ${keywordCount} relevant technical keywords`);
  } else {
    analysis.improvements.push('Add more relevant technical skills and keywords');
  }

  // 3. Contact Information (10 points)
  const contactPatterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    phone: /\b(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,
    linkedin: /linkedin\.com\/in\/[\w-]+/i,
    github: /github\.com\/[\w-]+/i,
  };

  let contactScore = 0;
  Object.entries(contactPatterns).forEach(([, regex]) => {
    if (regex.test(text)) {
      contactScore += 2.5;
    }
  });
  score += contactScore;

  if (contactScore >= 7.5) {
    analysis.strengths.push('Complete contact information provided');
  } else {
    analysis.improvements.push('Add email, phone, LinkedIn, and GitHub links');
  }

  // 4. Length Check (15 points)
  if (words.length >= 300 && words.length <= 800) {
    score += 15;
    analysis.strengths.push('Optimal resume length (300-800 words)');
  } else if (words.length < 300) {
    score += 5;
    analysis.improvements.push('Resume is too short. Add more details about your experience');
  } else {
    score += 10;
    analysis.improvements.push('Resume might be too long. Keep it concise (under 800 words)');
  }

  // 5. Formatting Simplicity (15 points) - ATS friendly checks
  let formatScore = 15;
  
  // Check for special characters that might confuse ATS
  const specialChars = /[|{}[\]<>]/g;
  if (specialChars.test(text)) {
    formatScore -= 5;
    analysis.improvements.push('Avoid special characters like |, {}, [], <> for better ATS compatibility');
  }

  // Check for action verbs
  const actionVerbs = /\b(developed|managed|created|led|built|designed|implemented|achieved|improved|increased|reduced)\b/gi;
  const actionVerbMatches = text.match(actionVerbs);
  if (actionVerbMatches && actionVerbMatches.length >= 5) {
    analysis.strengths.push('Uses strong action verbs');
  } else {
    formatScore -= 5;
    analysis.improvements.push('Use more action verbs (developed, managed, created, led, etc.)');
  }

  score += formatScore;

  // 6. Quantifiable Achievements (10 points)
  const quantifiers = /\b(\d+%|\d+\+|increased by|reduced by|saved \$|generated \$|\d+ years?)\b/gi;
  const quantifierMatches = text.match(quantifiers);
  if (quantifierMatches && quantifierMatches.length >= 3) {
    score += 10;
    analysis.strengths.push('Includes quantifiable achievements');
  } else {
    score += 3;
    analysis.improvements.push('Add measurable results (e.g., "Increased sales by 30%")');
  }

  // Ensure score is within 0-100
  score = Math.min(Math.max(Math.round(score), 0), 100);

  // Additional general recommendations
  if (score < 60) {
    analysis.improvements.push('Focus on relevant experience and technical skills');
    analysis.improvements.push('Ensure all major sections are present and well-detailed');
  }

  return { score, analysis };
}

// POST /api/resume/analyze - Upload and analyze resume
router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    let extractedText = '';

    // Extract text based on file type
    if (file.mimetype === 'application/pdf') {
      extractedText = await extractTextFromPDF(file.buffer);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = await extractTextFromDOCX(file.buffer);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract sufficient text from the file' });
    }

    // Analyze resume
    const { score, analysis } = analyzeResume(extractedText);

    // Save to database
    const resume = new Resume({
      fileName: file.originalname,
      fileType: file.mimetype === 'application/pdf' ? 'pdf' : 'docx',
      extractedText: extractedText.substring(0, 5000), // Store first 5000 chars
      atsScore: score,
      analysis: analysis,
      uploadedBy: req.body.username || 'User',
    });

    await resume.save();

    // Return analysis results
    res.json({
      success: true,
      id: resume._id,
      fileName: file.originalname,
      score: score,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      sectionsFound: analysis.sectionsFound,
      keywordsFound: analysis.keywordsFound,
      wordCount: analysis.wordCount,
      extractedText: extractedText.substring(0, 1000), // Return first 1000 chars for preview
    });

  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze resume',
      details: error.message 
    });
  }
});

// GET /api/resume/history - Get all analyzed resumes
router.get('/history', async (req, res) => {
  try {
    const resumes = await Resume.find()
      .sort({ createdAt: -1 })
      .select('-extractedText') // Exclude large text field
      .limit(20);

    res.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error('Failed to fetch resume history:', error);
    res.status(500).json({ error: 'Failed to fetch resume history' });
  }
});

// GET /api/resume/:id - Get specific resume analysis
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error('Failed to fetch resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// DELETE /api/resume/:id - Delete resume analysis
router.delete('/:id', async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete resume:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

export default router;
