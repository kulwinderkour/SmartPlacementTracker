# 🚀 Quick Start - Authentication System

## What Was Created

### Frontend Components

1. **[Login.tsx](src/pages/Login.tsx)** - Modern login page with:
   - Email/password authentication
   - Google OAuth sign-in
   - Form validation and error handling
   - Responsive design with Tailwind CSS

2. **[ProtectedRoute.tsx](src/components/ProtectedRoute.tsx)** - Route guard component
   - Protects authenticated routes
   - Redirects to login if not authenticated

3. **[authAPI.ts](src/services/authAPI.ts)** - API utility service
   - Helper functions for authenticated requests
   - Automatic token handling
   - Error management

### Backend Components

1. **[authRoutes.js](backend/routes/authRoutes.js)** - Authentication endpoints:
   - `POST /api/auth/register` - Register new user
   - `POST /api/auth/login` - Login with email/password
   - `POST /api/auth/google` - Google OAuth authentication
   - `GET /api/auth/me` - Get current user (protected)
   - `POST /api/auth/logout` - Logout

2. **[User.js](backend/models/User.js)** - MongoDB user model
   - Email, password (hashed), name
   - Google OAuth support (googleId, picture)
   - Timestamps and verification status

### Configuration Files

1. **[.env.example](.env.example)** - Frontend environment variables
2. **[backend/.env.example](backend/.env.example)** - Backend environment variables
3. **[AUTH_SETUP.md](AUTH_SETUP.md)** - Detailed setup instructions
4. **[install-auth.bat](install-auth.bat)** - Windows installation script

## ⚡ Fast Setup (5 Minutes)

### Step 1: Install Dependencies

**Windows:**
```bash
.\install-auth.bat
```

**Mac/Linux:**
```bash
chmod +x install-auth.sh
./install-auth.sh
```

**Or manually:**
```bash
cd backend
npm install jsonwebtoken bcryptjs google-auth-library
cd ..
```

### Step 2: Configure Environment Variables

**Backend (.env):**
```bash
cd backend
copy .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/placement_tracker
PORT=5000
JWT_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Frontend (.env):**
```bash
cd ..
copy .env.example .env
```

Edit `.env`:
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000
```

### Step 3: Generate JWT Secret

Run this command and copy the output to `backend/.env`:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 4: Set Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:5173`
6. Copy Client ID to both `.env` files

> Skip this if you only want email/password login

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 6: Test the Login

1. Open browser to `http://localhost:5173/login`
2. See your beautiful login page! 🎉

## 🎨 Features

### Login Page UI
- ✅ Modern, clean design
- ✅ Responsive (mobile-friendly)
- ✅ Email/password form
- ✅ Google sign-in button
- ✅ "Forgot password?" link
- ✅ Form validation
- ✅ Error messages
- ✅ Loading states
- ✅ Smooth animations

### Security
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens (7-day expiry)
- ✅ Protected API routes
- ✅ Google OAuth verification
- ✅ Automatic token refresh

### User Experience
- ✅ Auto-redirect after login
- ✅ Protected route handling
- ✅ Error feedback
- ✅ Loading indicators
- ✅ Token persistence

## 📱 Usage Examples

### Register a New User

```typescript
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securePassword123',
    name: 'John Doe'
  })
});

const { token, user } = await response.json();
localStorage.setItem('authToken', token);
```

### Login with Email/Password

```typescript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securePassword123'
  })
});

const { token, user } = await response.json();
localStorage.setItem('authToken', token);
```

### Make Authenticated Request

```typescript
import { get, post } from '@/services/authAPI';

// GET request
const response = await get('/api/auth/me');
const { user } = await response.json();

// POST request
const response = await post('/api/opportunities', {
  title: 'Software Engineer',
  company: 'Tech Corp'
});
```

### Logout

```typescript
import { logout } from '@/services/authAPI';

logout(); // Removes token and redirects to login
```

## 🎯 Testing the Login

### Test Email/Password Login

1. Visit `http://localhost:5173/login`
2. Enter any email: `test@example.com`
3. Enter any password: `password123`
4. Click "Continue"
5. Should redirect to dashboard

> Note: You need to register first or the backend needs a user in the database

### Test Google Login

1. Click "Continue with Google"
2. Google popup appears
3. Select your Google account
4. Should redirect to dashboard
5. Check MongoDB - user saved with Google info

### Test Protected Routes

1. Open `http://localhost:5173/dashboard` without login
2. Should redirect to `/login`
3. Login first
4. Try again - should work!

## 🔧 Customization

### Change Login Page Colors

Edit [Login.tsx](src/pages/Login.tsx):
```tsx
// Change primary button color
className="bg-blue-600 hover:bg-blue-700"
// to
className="bg-purple-600 hover:bg-purple-700"
```

### Add More OAuth Providers

1. Install provider library (e.g., `facebook-auth-library`)
2. Add route in `authRoutes.js`
3. Add button in `Login.tsx`

### Customize JWT Expiration

Edit [authRoutes.js](backend/routes/authRoutes.js):
```javascript
const token = jwt.sign(
  { userId: user._id, email: user.email }, 
  JWT_SECRET, 
  { expiresIn: '30d' } // Changed from '7d'
);
```

### Add User Avatar

Update User model and add avatar upload functionality.

## 📚 Next Steps

- [ ] **Add password reset** - Implement forgot password flow
- [ ] **Email verification** - Send verification emails
- [ ] **Profile page** - Let users edit their profile
- [ ] **Remember me** - Add checkbox for longer sessions
- [ ] **Social login** - Add Facebook, GitHub, etc.
- [ ] **Two-factor auth** - Add 2FA for extra security

## 🐛 Troubleshooting

### "Cannot find module 'jsonwebtoken'"
```bash
cd backend
npm install jsonwebtoken bcryptjs google-auth-library
```

### "Google Sign-In not working"
1. Check `GOOGLE_CLIENT_ID` in both `.env` files
2. Verify authorized origins in Google Console
3. Make sure the script loads (check browser console)

### "Invalid credentials" error
- Make sure you registered the user first
- Check MongoDB has the user
- Verify password matches

### CORS errors
- Check backend allows `http://localhost:5173`
- Verify CORS configuration in `server.js`

## 📖 Full Documentation

For complete setup instructions, see [AUTH_SETUP.md](AUTH_SETUP.md)

## 🎉 You're Done!

Your modern authentication system is ready to use! Enjoy building your application.

---

**Need help?** Check the detailed [AUTH_SETUP.md](AUTH_SETUP.md) guide.
