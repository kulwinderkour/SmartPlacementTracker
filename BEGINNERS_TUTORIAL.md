# 👨‍🎓 COMPLETE BEGINNER'S TUTORIAL

## 🎯 WHAT YOU'LL LEARN

By the end of this tutorial, you'll understand:
- ✅ How to create a backend API with Node.js
- ✅ How to connect to MongoDB database
- ✅ How to create a React form that saves to database
- ✅ How to fetch and display data from backend
- ✅ How all the pieces work together

**Time needed:** 30-45 minutes

---

## 📚 PART 1: UNDERSTANDING THE BASICS

### What is Frontend?
- The part users see and interact with
- Built with React (JavaScript library)
- Runs in the browser
- Like the "face" of your app

### What is Backend?
- The part users don't see
- Built with Node.js + Express
- Runs on a server
- Handles business logic and database
- Like the "brain" of your app

### What is Database?
- Where you store data permanently
- We use MongoDB
- Stores data in JSON-like format
- Like a "filing cabinet" for your app

### How They Work Together:
```
USER TYPES IN FORM
      ↓
FRONTEND sends data to BACKEND
      ↓
BACKEND saves data to DATABASE
      ↓
DATABASE confirms save
      ↓
BACKEND tells FRONTEND "Success!"
      ↓
FRONTEND shows success message to USER
```

---

## 🛠️ PART 2: SETTING UP THE BACKEND

### Step 1: Install MongoDB

#### Windows:
1. Go to: https://www.mongodb.com/try/download/community
2. Download the installer
3. Run installer (use default settings)
4. MongoDB runs automatically as a service
5. Verify: Open new terminal and type `mongod --version`

#### Mac:
```bash
# Install Homebrew first if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongod --version
```

#### Linux (Ubuntu):
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start
sudo systemctl start mongod

# Verify
mongod --version
```

### Step 2: Install Backend Dependencies

Open terminal in the `backend` folder:

```bash
cd backend
npm install
```

**What this does:**
- Downloads all required packages
- Creates `node_modules` folder
- Packages installed:
  - `express` - Web framework
  - `mongoose` - MongoDB helper
  - `dotenv` - Environment variables
  - `cors` - Allow frontend to connect
  - `nodemon` - Auto-restart server

### Step 3: Configure Database Connection

The `.env` file is already created with:
```
MONGODB_URI=mongodb://localhost:27017/placement_tracker
PORT=5000
```

**What this means:**
- `mongodb://localhost:27017` - MongoDB server address
- `placement_tracker` - Database name
- `PORT=5000` - Backend will run on port 5000

### Step 4: Start the Backend Server

```bash
npm run dev
```

**You should see:**
```
✅ MongoDB Connected: localhost
╔════════════════════════════════════════╗
║  🚀 Server is running!                ║
║  📡 Port: 5000                        ║
║  🌐 URL: http://localhost:5000       ║
╚════════════════════════════════════════╝
```

**What just happened:**
1. Node.js started running
2. Express web server started
3. Connected to MongoDB
4. All API routes are ready
5. Server is listening on port 5000

### Step 5: Test the Backend

Open browser and visit: http://localhost:5000/

**You should see:**
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

✅ **Backend is working!**

---

## 🎨 PART 3: UNDERSTANDING THE FRONTEND

### Step 1: The Form Component

**File:** `src/components/AddOpportunityFormBackend.tsx`

**What it does:**
1. Shows a form with fields (company, role, status, etc.)
2. When user fills form and clicks submit
3. Sends data to backend API
4. Shows success or error message

**Key parts explained:**

```tsx
// STATE - Stores form data
const [formData, setFormData] = useState({
  company: '',
  role: '',
  status: 'saved',
  deadline: '',
  link: '',
})

// Runs when user types in any field
const handleChange = (e) => {
  const { name, value } = e.target
  setFormData((prev) => ({
    ...prev,        // Keep existing values
    [name]: value,  // Update the changed field
  }))
}

// Runs when user clicks "Add Opportunity"
const handleSubmit = async (e) => {
  e.preventDefault()  // Don't reload page
  
  // Send to backend
  const response = await createOpportunity(formData)
  
  // Show success message
  setSuccess(true)
}
```

### Step 2: The API Service

**File:** `src/services/opportunityAPI.js`

**What it does:**
- Contains functions to communicate with backend
- Uses `fetch` to make HTTP requests
- Handles responses and errors

**Key parts explained:**

```javascript
// Function to create new opportunity
export const createOpportunity = async (opportunityData) => {
  // Send POST request
  const response = await fetch('http://localhost:5000/api/opportunities', {
    method: 'POST',                          // Type of request
    headers: {
      'Content-Type': 'application/json',    // Sending JSON
    },
    body: JSON.stringify(opportunityData),   // Convert object to JSON
  })

  // Get response data
  const data = await response.json()
  
  // Return the data
  return data
}
```

### Step 3: The Display Component

**File:** `src/components/OpportunitiesListBackend.tsx`

**What it does:**
1. Fetches all opportunities from backend
2. Displays them in cards
3. Shows loading spinner while fetching
4. Handles errors gracefully

**Key parts explained:**

```tsx
// STATE - Stores fetched opportunities
const [opportunities, setOpportunities] = useState([])

// FETCH - Get data from backend
const fetchOpportunities = async () => {
  const response = await getAllOpportunities()
  setOpportunities(response.data)  // Save to state
}

// RUN ONCE - When component first loads
useEffect(() => {
  fetchOpportunities()
}, [])

// RENDER - Show the data
{opportunities.map(opp => (
  <Card key={opp._id}>
    <h3>{opp.company}</h3>
    <p>{opp.role}</p>
  </Card>
))}
```

---

## 🚀 PART 4: RUNNING THE COMPLETE APP

### Option 1: Double-Click Method (Windows)
1. Double-click `start.bat`
2. Wait for two command windows to open
3. Open browser: http://localhost:5173/opportunities-backend

### Option 2: Manual Method

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Browser:**
Visit: http://localhost:5173/opportunities-backend

---

## 🎮 PART 5: TESTING THE APP

### Test 1: Create an Opportunity

1. Click "Add Opportunity" button
2. Fill in the form:
   - Company: `Google`
   - Role: `Software Engineer`
   - Status: `Applied`
   - Deadline: Select a future date
   - Link: `https://careers.google.com`
3. Click "Add Opportunity"
4. **Expected:** Green success message appears
5. **Expected:** Form closes after 1.5 seconds
6. **Expected:** New opportunity appears in the list

### Test 2: View Data in MongoDB

**Using MongoDB Compass (Visual Tool):**
1. Download: https://www.mongodb.com/try/download/compass
2. Install and open
3. Connect to: `mongodb://localhost:27017`
4. Find database: `placement_tracker`
5. Open collection: `opportunities`
6. **Expected:** See your opportunity document with all fields

**Using Command Line:**
```bash
# Open MongoDB shell
mongosh

# Use the database
use placement_tracker

# View all opportunities
db.opportunities.find().pretty()

# Expected output:
{
  _id: ObjectId("..."),
  company: "Google",
  role: "Software Engineer",
  status: "applied",
  deadline: ISODate("2026-03-15T00:00:00.000Z"),
  link: "https://careers.google.com",
  createdAt: ISODate("2026-02-11T..."),
  updatedAt: ISODate("2026-02-11T...")
}
```

### Test 3: Delete an Opportunity

1. Click the trash icon on any opportunity card
2. Confirm deletion
3. **Expected:** Opportunity disappears from list
4. Check MongoDB: Data should be gone

### Test 4: Refresh Page

1. Refresh the browser page (F5)
2. **Expected:** All opportunities still appear
3. **Why?** Data is saved in MongoDB, not just in React state

---

## 🔍 PART 6: HOW IT ALL WORKS (STEP-BY-STEP)

### Creating an Opportunity:

```
1. USER fills form with:
   company: "Google"
   role: "Software Engineer"

2. USER clicks "Add Opportunity"

3. FRONTEND handleSubmit() runs:
   - Validates data (company and role required)
   - Sets loading state to true

4. FRONTEND calls createOpportunity(formData):
   - Sends HTTP POST to http://localhost:5000/api/opportunities
   - Headers: Content-Type: application/json
   - Body: { company: "Google", role: "Software Engineer", ... }

5. BACKEND server.js receives request:
   - CORS middleware: Checks if request is allowed ✓
   - JSON middleware: Converts body to JavaScript object ✓
   - Routes to /api/opportunities (POST)

6. BACKEND opportunityRoutes.js POST handler runs:
   - Extracts { company, role, status, deadline, link }
   - Validates: company and role are present ✓
   - Creates: new Opportunity({ company, role, ... })

7. MONGOOSE Opportunity.js validates:
   - company is string ✓
   - role is string ✓
   - status is valid enum value ✓
   - deadline is valid date ✓

8. BACKEND saves to MongoDB:
   - newOpportunity.save()
   - MongoDB generates _id
   - MongoDB adds createdAt and updatedAt
   - MongoDB returns saved document

9. BACKEND sends response:
   {
     success: true,
     message: "Opportunity created successfully!",
     data: { _id, company, role, ... }
   }

10. FRONTEND receives response:
    - Sets success state to true
    - Shows green success message
    - Resets form fields
    - Calls onSuccess callback

11. FRONTEND refreshes list:
    - Calls fetchOpportunities()
    - Sends HTTP GET to get all opportunities
    - Updates opportunities state
    - React re-renders with new data

12. USER sees:
    - Success message
    - New opportunity in the list
    - Form closes automatically
```

---

## 🎓 PART 7: KEY CONCEPTS FOR BEGINNERS

### 1. State in React
```tsx
const [formData, setFormData] = useState({ company: '' })
```
- `useState` creates a variable that triggers re-render when changed
- `formData` - current value
- `setFormData` - function to update value
- When you call `setFormData(newValue)`, React re-renders component

### 2. useEffect Hook
```tsx
useEffect(() => {
  fetchOpportunities()
}, [])
```
- Runs code when component loads
- Empty array `[]` means "run only once"
- Use for fetching data, setting up listeners, etc.

### 3. async/await
```tsx
const fetchData = async () => {
  const response = await fetch(url)  // Wait for response
  const data = await response.json() // Wait for parsing
}
```
- `async` - marks function as asynchronous
- `await` - waits for promise to complete
- Makes asynchronous code look synchronous

### 4. Event Handlers
```tsx
<input onChange={handleChange} />
<form onSubmit={handleSubmit} />
<button onClick={handleClick} />
```
- Functions that run when user interacts
- `e.preventDefault()` - prevents default behavior
- `e.target.value` - gets input value

### 5. Destructuring
```tsx
const { company, role } = formData
const { name, value } = e.target
```
- Shorthand for extracting values from objects
- Instead of `formData.company`, use `company`

### 6. Spread Operator
```tsx
setFormData({ ...prev, company: 'Google' })
```
- `...prev` - copies all existing fields
- Then overwrites specific field
- Keeps other fields unchanged

### 7. Map Function
```tsx
{opportunities.map(opp => (
  <Card key={opp._id}>...</Card>
))}
```
- Loops through array
- Creates component for each item
- `key` helps React track items

---

## 🔧 PART 8: COMMON ERRORS & SOLUTIONS

### Error: "Cannot connect to MongoDB"

**Symptoms:**
- Backend shows: "Error: connect ECONNREFUSED"

**Solutions:**
1. Check if MongoDB is running:
   ```bash
   # Windows
   services.msc → Look for "MongoDB"
   
   # Mac/Linux
   brew services list  # or systemctl status mongod
   ```
2. Start MongoDB if stopped
3. Check connection string in `.env`

### Error: "CORS Policy Error"

**Symptoms:**
- Browser console: "Access to fetch... has been blocked by CORS policy"

**Solutions:**
1. Check backend `server.js`:
   ```js
   app.use(cors({
     origin: 'http://localhost:5173', // Must match frontend URL
   }))
   ```
2. Restart backend server
3. Clear browser cache

### Error: "Port 5000 already in use"

**Symptoms:**
- Backend: "Error: listen EADDRINUSE: address already in use :::5000"

**Solutions:**
1. Change port in `backend/.env`:
   ```
   PORT=5001
   ```
2. Update frontend API URL in `src/services/opportunityAPI.js`:
   ```js
   const API_URL = 'http://localhost:5001/api/opportunities'
   ```
3. Restart both servers

### Error: "Cannot find module"

**Symptoms:**
- "Error: Cannot find module 'express'"

**Solutions:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Error: "Network Error" in Browser

**Symptoms:**
- Form submit fails
- Console: "Failed to fetch"

**Solutions:**
1. Check backend is running (visit http://localhost:5000)
2. Check API URL is correct
3. Check browser Network tab for failed requests
4. Verify backend logs for errors

---

## 🎯 PART 9: NEXT STEPS

### Complete these challenges:

#### Challenge 1: Add More Fields
Add a "Package" field to track salary:
1. Update `backend/models/Opportunity.js`
2. Update `src/components/AddOpportunityFormBackend.tsx`
3. Update display to show package

#### Challenge 2: Add Edit Functionality
Allow users to edit opportunities:
1. Create edit modal component
2. Use `updateOpportunity()` from API service
3. Add "Edit" button to opportunity cards

#### Challenge 3: Add Filtering
Filter opportunities by status:
1. Add dropdown for status filter
2. Filter opportunities array before displaying
3. Show count of filtered items

#### Challenge 4: Add Search
Search by company or role:
1. Add search input
2. Filter opportunities based on search query
3. Show "No results" message

#### Challenge 5: Deploy Your App
Deploy to free hosting:
1. Frontend: Vercel or Netlify
2. Backend: Render or Railway
3. Database: MongoDB Atlas (free tier)

---

## 📚 PART 10: LEARNING RESOURCES

### MongoDB:
- Official Docs: https://www.mongodb.com/docs/
- MongoDB University (Free): https://university.mongodb.com/

### Node.js & Express:
- Node.js Docs: https://nodejs.org/docs/
- Express Guide: https://expressjs.com/en/guide/routing.html
- FreeCodeCamp: https://www.freecodecamp.org/learn/back-end-development-and-apis/

### React:
- Official Tutorial: https://react.dev/learn
- React Hooks: https://react.dev/reference/react/hooks

### General:
- MDN Web Docs: https://developer.mozilla.org/
- W3Schools: https://www.w3schools.com/
- YouTube: Traversy Media, Net Ninja, Fireship

---

## ✅ FINAL CHECKLIST

I understand:
- [ ] What frontend, backend, and database are
- [ ] How components communicate with backend
- [ ] How to use useState and useEffect
- [ ] How fetch works
- [ ] How Express routes work
- [ ] How Mongoose models work
- [ ] How to create CRUD operations
- [ ] How to debug errors
- [ ] How to test the app

I can:
- [ ] Start MongoDB
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Create new opportunities via form
- [ ] View opportunities from database
- [ ] Delete opportunities
- [ ] Check data in MongoDB
- [ ] Read and understand the code
- [ ] Fix common errors
- [ ] Add new features

---

## 🎉 CONGRATULATIONS!

You've built your first full-stack application!

**You now know:**
✅ Backend development with Node.js & Express
✅ Database management with MongoDB & Mongoose
✅ Frontend development with React
✅ RESTful API design
✅ Full-stack integration

**Keep learning and building! 🚀**
