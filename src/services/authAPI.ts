/**
 * Authenticated API Utility
 * 
 * Provides helper functions for making authenticated API requests
 * with automatic token handling and error management.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Make an authenticated fetch request
 * Automatically includes JWT token in Authorization header
 * Redirects to login on 401 (unauthorized) responses
 */
export const fetchWithAuth = async (
  endpoint: string,
  options: RequestOptions = {}
): Promise<Response> => {
  const token = localStorage.getItem('authToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle unauthorized responses
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    throw new Error('Unauthorized - redirecting to login');
  }

  return response;
};

/**
 * GET request with authentication
 */
export const get = async (endpoint: string): Promise<Response> => {
  return fetchWithAuth(endpoint, {
    method: 'GET',
  });
};

/**
 * POST request with authentication
 */
export const post = async (
  endpoint: string,
  data: unknown
): Promise<Response> => {
  return fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT request with authentication
 */
export const put = async (
  endpoint: string,
  data: unknown
): Promise<Response> => {
  return fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request with authentication
 */
export const del = async (endpoint: string): Promise<Response> => {
  return fetchWithAuth(endpoint, {
    method: 'DELETE',
  });
};

/**
 * Get current user from API
 */
export const getCurrentUser = async () => {
  const response = await get('/api/auth/me');
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};

/**
 * Logout user (remove token and redirect)
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

export default {
  fetchWithAuth,
  get,
  post,
  put,
  del,
  getCurrentUser,
  logout,
  isAuthenticated,
};
