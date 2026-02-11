// ==================================================
// OPPORTUNITY MODEL (DATABASE SCHEMA)
// ==================================================
// This file defines what an "Opportunity" looks like in the database

import mongoose from 'mongoose';

// Schema = Blueprint for how data should look
const opportunitySchema = new mongoose.Schema(
  {
    // Company name (required field)
    company: {
      type: String,        // Data type is text
      required: true,      // This field MUST be filled
      trim: true,          // Remove extra spaces
    },

    // Job role (required field)
    role: {
      type: String,
      required: true,
      trim: true,
    },

    // Application status (required field)
    status: {
      type: String,
      required: true,
      enum: [              // Only these values are allowed
        'saved',
        'applied',
        'online-assessment',
        'interview-scheduled',
        'interview-completed',
        'offer-received',
        'rejected',
        'accepted',
      ],
      default: 'saved',    // Default value if not provided
    },

    // Application deadline (optional)
    deadline: {
      type: Date,          // Data type is date
      required: false,     // This field is optional
    },

    // Job posting link (optional)
    link: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create the model from the schema
// 'Opportunity' is the model name, it will create 'opportunities' collection in MongoDB
const Opportunity = mongoose.model('Opportunity', opportunitySchema);

// Export so we can use it in routes
export default Opportunity;
