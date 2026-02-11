import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  analysis: {
    strengths: [{
      type: String,
    }],
    improvements: [{
      type: String,
    }],
    sectionsFound: [{
      type: String,
    }],
    keywordsFound: [{
      type: String,
    }],
    wordCount: {
      type: Number,
    },
  },
  uploadedBy: {
    type: String,
    default: 'User',
  },
}, {
  timestamps: true,
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
