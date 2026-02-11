# Authentication Setup Guide

This guide will help you set up the authentication system with email/password login and Google OAuth.

## Features

- ✅ Email/Password Authentication
- ✅ Google OAuth Sign-In
- ✅ JWT Token-based Authentication
- ✅ Secure Password Hashing (bcrypt)
- ✅ MongoDB User Storage
- ✅ Protected Routes & Middleware
- ✅ Modern UI with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas account)
- Google Cloud Console account (for Google OAuth)

## Installation Steps

### 1. Install Backend Dependencies

Navigate to the backend directory and install required packages:

```bash
cd backend
npm install jsonwebtoken bcryptjs google-auth-library
```

### 2. Install Frontend Dependencies

The frontend dependencies should already be installed. If not:

```bash
cd ..
npm install
```

### 3. Set Up Google OAuth

#### a. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** or **Google Identity Services**

#### b. Create OAuth 2.0 Credentials

1. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
2. Select **Web application**
3. Add **Authorized JavaScript origins**:
   - `http://localhost:5173` (your React app)
   - `http://localhost:5000` (your backend - optional)
4. Add **Authorized redirect URIs** (if needed):
   - `http://localhost:5173/auth/callback`
5. Click **Create** and copy your **Client ID**

#### c. Configure Environment Variables

**Backend (.env)**
Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/placement_tracker
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JOOBLE_API_KEY=your-jooble-api-key
```

**Frontend (.env)**
Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000
```

> **Important**: Use the same Google Client ID in both frontend and backend!

### 4. Generate Secure JWT Secret

For production, generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET` in the backend `.env` file.

### 5. Add Login Page to Routes

Update your `App.tsx` to include the Login page:

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add other routes */}
      </Routes>
    </Router>
  );
}

export default App;
```

## Usage

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:5000`

### 2. Start the Frontend

```bash
npm run dev
```

The React app will start on `http://localhost:5173`

### 3. Access the Login Page

Navigate to `http://localhost:5173/login`

## API Endpoints

### Authentication Routes

All routes are prefixed with `/api/auth`

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

#### Login with Email/Password
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Google OAuth Login
```http
POST /api/auth/google
Content-Type: application/json

{
  "credential": "google-jwt-token-here"
}
```

#### Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

#### Logout
```http
POST /api/auth/logout
```

## Frontend Usage

### Using the Login Component

The Login component is ready to use at `/login`. It handles:

1. **Email/Password Login**: Users can enter credentials and sign in
2. **Google Sign-In**: Click "Continue with Google" to authenticate
3. **Form Validation**: Ensures valid email and password
4. **Error Handling**: Displays errors for failed authentication
5. **Token Storage**: Automatically stores JWT in localStorage
6. **Redirect**: Redirects to dashboard on success

### Protecting Routes

Create an authentication middleware to protect routes:

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
```

Use it in your routes:

```tsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Making Authenticated API Calls

Create an API utility to include the auth token:

```tsx
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
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
  
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  
  return response;
};
```

## Security Best Practices

1. **Never commit `.env` files** - Add them to `.gitignore`
2. **Use strong JWT secrets** - Generate random strings with crypto
3. **HTTPS in production** - Always use HTTPS for authentication
4. **Token expiration** - Tokens expire in 7 days (configurable)
5. **Password hashing** - Passwords are hashed with bcrypt (10 rounds)
6. **Input validation** - Always validate user input
7. **CORS configuration** - Limit origins in production

## Troubleshooting

### Google Sign-In Not Working

1. Check that `GOOGLE_CLIENT_ID` is set in both `.env` files
2. Verify authorized origins in Google Cloud Console
3. Open browser console for error messages
4. Ensure Google Sign-In script loads (check Network tab)

### JWT Token Errors

1. Verify `JWT_SECRET` is set in backend `.env`
2. Check token format: `Bearer <token>`
3. Clear localStorage and login again
4. Check token expiration

### Database Connection Issues

1. Ensure MongoDB is running: `mongod --version`
2. Check `MONGODB_URI` in backend `.env`
3. Verify database connection in server logs

### CORS Errors

1. Check backend CORS configuration in `server.js`
2. Ensure frontend origin matches: `http://localhost:5173`
3. Clear browser cache

## Database Schema

### User Model

```javascript
{
  email: String,          // Unique, required, lowercase
  password: String,       // Hashed, required for local auth
  name: String,           // User's display name
  googleId: String,       // Google OAuth ID
  picture: String,        // Profile picture URL (Google)
  authProvider: String,   // 'local' or 'google'
  isVerified: Boolean,    // Email verification status
  lastLogin: Date,        // Last login timestamp
  createdAt: Date,        // Account creation date
  updatedAt: Date         // Last update date
}
```

## Next Steps

- [ ] Add password reset functionality
- [ ] Implement email verification
- [ ] Add refresh tokens
- [ ] Implement rate limiting
- [ ] Add OAuth for other providers (Facebook, GitHub, etc.)
- [ ] Add two-factor authentication (2FA)
- [ ] Create user profile page
- [ ] Add password strength requirements

## Support

For issues or questions:
1. Check this README
2. Review error logs in browser console and server terminal
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed

## License

This authentication system is part of the Placement Tracker application.
