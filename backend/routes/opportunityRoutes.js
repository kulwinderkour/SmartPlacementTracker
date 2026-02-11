// ==================================================
// API ROUTES FOR OPPORTUNITIES
// ==================================================
// This file defines what happens when someone visits our API endpoints

import express from 'express';
import Opportunity from '../models/Opportunity.js'; // Import the model

const router = express.Router(); // Router helps organize routes

// ==================================================
// POST /api/opportunities
// Purpose: Create a new opportunity
// ==================================================
router.post('/', async (req, res) => {
  try {
    // req.body contains the data sent from frontend
    const { company, role, status, deadline, link } = req.body;

    // Validation: Check if required fields are present
    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: 'Company and role are required fields',
      });
    }

    // Create new opportunity object
    const newOpportunity = new Opportunity({
      company,
      role,
      status: status || 'saved', // Use 'saved' if status not provided
      deadline,
      link,
    });

    // Save to database
    const savedOpportunity = await newOpportunity.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully!',
      data: savedOpportunity,
    });
  } catch (error) {
    // If error occurs, send error response
    console.error('Error creating opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create opportunity',
      error: error.message,
    });
  }
});

// ==================================================
// GET /api/opportunities
// Purpose: Get all opportunities
// ==================================================
router.get('/', async (req, res) => {
  try {
    // Find all opportunities, sort by newest first
    const opportunities = await Opportunity.find().sort({ createdAt: -1 });

    // Send success response with data
    res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
    // If error occurs, send error response
    console.error('Error fetching opportunities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch opportunities',
      error: error.message,
    });
  }
});

// ==================================================
// GET /api/opportunities/:id
// Purpose: Get a single opportunity by ID
// ==================================================
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch opportunity',
      error: error.message,
    });
  }
});

// ==================================================
// PUT /api/opportunities/:id
// Purpose: Update an opportunity
// ==================================================
router.put('/:id', async (req, res) => {
  try {
    const { company, role, status, deadline, link } = req.body;

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      { company, role, status, deadline, link },
      { new: true, runValidators: true } // Return updated doc, run validations
    );

    if (!updatedOpportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Opportunity updated successfully!',
      data: updatedOpportunity,
    });
  } catch (error) {
    console.error('Error updating opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update opportunity',
      error: error.message,
    });
  }
});

// ==================================================
// DELETE /api/opportunities/:id
// Purpose: Delete an opportunity
// ==================================================
router.delete('/:id', async (req, res) => {
  try {
    const deletedOpportunity = await Opportunity.findByIdAndDelete(req.params.id);

    if (!deletedOpportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Opportunity deleted successfully!',
    });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete opportunity',
      error: error.message,
    });
  }
});

// Export the router
export default router;
