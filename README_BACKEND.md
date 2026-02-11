# 🚀 BACKEND + FRONTEND INTEGRATION GUIDE

## 📁 COMPLETE FOLDER STRUCTURE

```
website_placement/
│
├── backend/                       # Backend Server
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   └── Opportunity.js        # Database schema
│   ├── routes/
│   │   └── opportunityRoutes.js  # API routes
│   ├── .env                      # Environment variables
│   ├── .env.example              # Example env file
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Main server file
│
├── src/                          # Frontend React App
│   ├── components/
│   │   ├── AddOpportunityFormBackend.tsx   # Form component
│   │   └── OpportunitiesListBackend.tsx    # Display component
│   └── services/
│       └── opportunityAPI.js     # API calling functions
│
└── README_BACKEND.md             # This file
```

---

## 🔧 STEP-BY-STEP SETUP

### **STEP 1: Install MongoDB**

#### Option A: Local MongoDB (Recommended for Beginners)
1. Download MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Install and start MongoDB:
   - Windows: MongoDB runs as a service automatically
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud - Free Tier)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Replace in `backend/.env`: 
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placement_tracker
   ```

---

### **STEP 2: Install Backend Dependencies**

Open terminal in `backend` folder:

```bash
cd backend
npm install
```

This installs:
- `express` - Web framework for creating APIs
- `mongoose` - MongoDB object modeling tool
- `dotenv` - Loads environment variables
- `cors` - Allows frontend to connect to backend
- `nodemon` - Auto-restarts server on file changes

---

### **STEP 3: Configure Environment Variables**

1. The `.env` file is already created with:
   ```
   MONGODB_URI=mongodb://localhost:27017/placement_tracker
   PORT=5000
   ```

2. **If using MongoDB Atlas**, replace `MONGODB_URI` with your connection string

---

### **STEP 4: Start Backend Server**

```bash
# For development (auto-restart on changes)
npm run dev

# For production
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
╔════════════════════════════════════════╗
║  🚀 Server is running!                ║
║  📡 Port: 5000                        ║
║  🌐 URL: http://localhost:5000       ║
╚════════════════════════════════════════╝
```

---

### **STEP 5: Test Backend APIs**

#### Test in Browser:
Visit: http://localhost:5000/

You should see:
```json
{
  "message": "🚀 Placement Tracker API is running!",
  "endpoints": {
    "getAllOpportunities": "GET /api/opportunities",
    "createOpportunity": "POST /api/opportunities",
    ...
  }
}
```

#### Test with Thunder Client / Postman:

**Create Opportunity (POST):**
- URL: `http://localhost:5000/api/opportunities`
- Method: `POST`
- Body (JSON):
```json
{
  "company": "Google",
  "role": "Software Engineer",
  "status": "applied",
  "deadline": "2026-03-15",
  "link": "https://careers.google.com/jobs/123"
}
```

**Get All Opportunities (GET):**
- URL: `http://localhost:5000/api/opportunities`
- Method: `GET`

---

### **STEP 6: Update Frontend to Use Backend API**

The frontend code is already created! You have:

1. **API Service** (`src/services/opportunityAPI.js`)
   - Contains all API calling functions
   - Uses `fetch` (no axios needed)

2. **Form Component** (`src/components/AddOpportunityFormBackend.tsx`)
   - Form with 5 fields
   - Sends POST request to create opportunity
   - Shows loading/success/error states

3. **Display Component** (`src/components/OpportunitiesListBackend.tsx`)
   - Fetches all opportunities with GET request
   - Displays in cards
   - Shows loading/error/empty states
   - Delete functionality

---

### **STEP 7: Use Components in Your App**

Add to your existing pages or create a new page:

```tsx
// In src/pages/OpportunitiesBackend.tsx
import OpportunitiesListBackend from '@/components/OpportunitiesListBackend'

export default function OpportunitiesBackend() {
  return <OpportunitiesListBackend />
}
```

Then add route in `App.tsx`:
```tsx
import OpportunitiesBackend from '@/pages/OpportunitiesBackend'

// In your routes:
<Route path="/opportunities-backend" element={<OpportunitiesBackend />} />
```

---

## 🧪 TESTING THE INTEGRATION

### Test Flow:
1. ✅ Start backend server: `cd backend && npm run dev`
2. ✅ Start frontend: `npm run dev` (in root folder)
3. ✅ Visit: http://localhost:5173/opportunities-backend
4. ✅ Click "Add Opportunity" button
5. ✅ Fill form and submit
6. ✅ Check if opportunity appears in the list
7. ✅ Check MongoDB to verify data is saved

### Verify Data in MongoDB:

**Using MongoDB Compass (GUI):**
1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Find database: `placement_tracker`
4. View collection: `opportunities`

**Using Command Line:**
```bash
# Open MongoDB shell
mongosh

# Switch to database
use placement_tracker

# View all opportunities
db.opportunities.find().pretty()
```

---

## 📚 CODE EXPLANATION (BEGINNER-FRIENDLY)

### **1. How Backend Works:**

```
User clicks "Add" → 
Frontend sends data → 
Backend receives data → 
Validates data → 
Saves to MongoDB → 
Sends response back → 
Frontend shows success
```

### **2. What is an API?**
- API = Application Programming Interface
- It's like a waiter in a restaurant:
  - You (frontend) tell waiter (API) what you want
  - Waiter goes to kitchen (backend)
  - Kitchen prepares food (processes data)
  - Waiter brings food back (sends response)

### **3. HTTP Methods:**
- `GET` = Retrieve data (like reading a book)
- `POST` = Create new data (like writing a new page)
- `PUT` = Update existing data (like editing a page)
- `DELETE` = Remove data (like tearing out a page)

### **4. What is MongoDB?**
- Database that stores data in JSON-like format
- Each "opportunity" is a document
- All opportunities are in a collection
- Collections are in a database

### **5. What is Mongoose?**
- Makes working with MongoDB easier
- Creates "schemas" = rules for what data should look like
- Validates data automatically
- Provides helpful methods (save, find, delete, etc.)

---

## 🐛 TROUBLESHOOTING

### Problem: "Cannot connect to MongoDB"
**Solution:**
- Check if MongoDB is running: `mongod --version`
- Check connection string in `.env`
- For Atlas: Check if IP is whitelisted

### Problem: "CORS error in browser"
**Solution:**
- In `server.js`, update CORS origin:
  ```js
  cors({
    origin: 'http://localhost:5173', // Change to your frontend URL
  })
  ```

### Problem: "Port 5000 already in use"
**Solution:**
- Change PORT in `.env` file:
  ```
  PORT=5001
  ```
- Update API_URL in `src/services/opportunityAPI.js`:
  ```js
  const API_URL = 'http://localhost:5001/api/opportunities'
  ```

### Problem: "Module not found"
**Solution:**
- Run `npm install` in backend folder
- Check if `node_modules` folder exists

### Problem: "Data not showing in frontend"
**Solution:**
- Check browser console for errors (F12)
- Verify backend is running (visit http://localhost:5000)
- Check Network tab to see if API calls are successful
- Check API_URL in `opportunityAPI.js` matches backend port

---

## 🚀 NEXT STEPS

### After Basic Integration Works:

1. **Add More Features:**
   - Edit opportunity (PUT request)
   - Filter by status
   - Search functionality
   - Pagination

2. **Add Authentication:**
   - User login/signup
   - JWT tokens
   - Protected routes

3. **Improve UI:**
   - Better error messages
   - Toast notifications
   - Confirmation dialogs

4. **Deploy:**
   - Frontend: Vercel/Netlify
   - Backend: Render/Railway
   - Database: MongoDB Atlas

---

## 💡 IMPORTANT NOTES

1. **Always start backend before frontend**
   ```bash
   # Terminal 1 (Backend)
   cd backend
   npm run dev
   
   # Terminal 2 (Frontend)
   npm run dev
   ```

2. **Check both are running:**
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

3. **Environment Variables:**
   - Never commit `.env` file to Git
   - Use `.env.example` as template
   - Each team member needs their own `.env`

4. **MongoDB Tips:**
   - Database name: `placement_tracker`
   - Collection name: `opportunities` (auto-created)
   - Each document has unique `_id` field (auto-generated)

---

## 📞 HELP & RESOURCES

- **MongoDB Docs:** https://www.mongodb.com/docs/
- **Mongoose Docs:** https://mongoosejs.com/docs/
- **Express Docs:** https://expressjs.com/
- **Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

## ✅ CHECKLIST

Before starting:
- [ ] Node.js installed (v16 or higher)
- [ ] MongoDB installed OR MongoDB Atlas account
- [ ] Code editor (VS Code)
- [ ] Basic JavaScript knowledge

To run the app:
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] `.env` file configured
- [ ] MongoDB running
- [ ] Backend server started (port 5000)
- [ ] Frontend server started (port 5173)
- [ ] Browser showing frontend
- [ ] Test creating an opportunity
- [ ] Verify data in MongoDB

---

## 🎉 CONGRATULATIONS!

You now have a full-stack application with:
✅ React Frontend
✅ Node.js Backend
✅ MongoDB Database
✅ RESTful API
✅ CRUD Operations

**You're a full-stack developer! 🚀**
