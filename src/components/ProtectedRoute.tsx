import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * If user is not authenticated (no token), redirects to login page.
 * 
 * Usage:
 * <Route 
 *   path="/dashboard" 
 *   element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   } 
 * />
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // User is authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
