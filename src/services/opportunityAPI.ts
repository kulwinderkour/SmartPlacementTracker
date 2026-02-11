// ==================================================
// API SERVICE - FRONTEND
// ==================================================
// This file contains all functions to communicate with backend

// Type definitions
export interface OpportunityData {
  _id?: string
  company: string
  role: string
  status: string
  deadline?: string
  link?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  count?: number
  error?: string
}

// Base URL of your backend server
const API_URL = 'http://localhost:5000/api/opportunities';

// ==================================================
// CREATE OPPORTUNITY (POST)
// ==================================================
/**
 * Creates a new opportunity
 * @param {Object} opportunityData - The opportunity data to create
 * @returns {Promise} - The created opportunity data
 */
export const createOpportunity = async (opportunityData: Partial<OpportunityData>): Promise<ApiResponse<OpportunityData>> => {
  try {
    // Send POST request to backend
    const response = await fetch(API_URL, {
      method: 'POST',                           // HTTP method
      headers: {
        'Content-Type': 'application/json',     // Tell server we're sending JSON
      },
      body: JSON.stringify(opportunityData),    // Convert JS object to JSON string
    });

    // Convert response to JSON
    const data = await response.json();

    // Check if request was successful
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create opportunity');
    }

    return data; // Return the data
  } catch (error) {
    console.error('Error in createOpportunity:', error);
    throw error; // Re-throw error so component can handle it
  }
};

// ==================================================
// GET ALL OPPORTUNITIES (GET)
// ==================================================
/**
 * Fetches all opportunities from database
 * @returns {Promise} - Array of opportunities
 */
export const getAllOpportunities = async (): Promise<ApiResponse<OpportunityData[]>> => {
  try {
    // Send GET request to backend
    const response = await fetch(API_URL, {
      method: 'GET',
    });

    // Convert response to JSON
    const data = await response.json();

    // Check if request was successful
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch opportunities');
    }

    return data; // Return the data
  } catch (error) {
    console.error('Error in getAllOpportunities:', error);
    throw error;
  }
};

// ==================================================
// GET SINGLE OPPORTUNITY (GET)
// ==================================================
/**
 * Fetches a single opportunity by ID
 * @param {string} id - Opportunity ID
 * @returns {Promise} - Single opportunity data
 */
export const getOpportunityById = async (id: string): Promise<ApiResponse<OpportunityData>> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch opportunity');
    }

    return data;
  } catch (error) {
    console.error('Error in getOpportunityById:', error);
    throw error;
  }
};

// ==================================================
// UPDATE OPPORTUNITY (PUT)
// ==================================================
/**
 * Updates an existing opportunity
 * @param {string} id - Opportunity ID
 * @param {Object} opportunityData - Updated data
 * @returns {Promise} - Updated opportunity data
 */
export const updateOpportunity = async (id: string, opportunityData: Partial<OpportunityData>): Promise<ApiResponse<OpportunityData>> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(opportunityData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update opportunity');
    }

    return data;
  } catch (error) {
    console.error('Error in updateOpportunity:', error);
    throw error;
  }
};

// ==================================================
// DELETE OPPORTUNITY (DELETE)
// ==================================================
/**
 * Deletes an opportunity
 * @param {string} id - Opportunity ID
 * @returns {Promise} - Success message
 */
export const deleteOpportunity = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete opportunity');
    }

    return data;
  } catch (error) {
    console.error('Error in deleteOpportunity:', error);
    throw error;
  }
};
