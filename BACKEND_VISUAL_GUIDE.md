# 📊 BACKEND + FRONTEND INTEGRATION - VISUAL GUIDE

## 🏗️ ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              FRONTEND (React + Vite)                   │ │
│  │              http://localhost:5173                     │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Components:                                     │ │ │
│  │  │  • AddOpportunityFormBackend.tsx                 │ │ │
│  │  │  • OpportunitiesListBackend.tsx                  │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                        ↕                               │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  API Service:                                    │ │ │
│  │  │  • opportunityAPI.js                             │ │ │
│  │  │    - createOpportunity()                         │ │ │
│  │  │    - getAllOpportunities()                       │ │ │
│  │  │    - updateOpportunity()                         │ │ │
│  │  │    - deleteOpportunity()                         │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕
                        HTTP Requests
                    (fetch with JSON data)
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                │
│                   http://localhost:5000                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  server.js (Main Entry Point)                         │ │
│  │  • Express app setup                                  │ │
│  │  • CORS configuration                                 │ │
│  │  • Middleware                                         │ │
│  │  • Route registration                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                              ↕                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  routes/opportunityRoutes.js                          │ │
│  │  • POST   /api/opportunities   (create)               │ │
│  │  • GET    /api/opportunities   (get all)              │ │
│  │  • GET    /api/opportunities/:id (get one)            │ │
│  │  • PUT    /api/opportunities/:id (update)             │ │
│  │  • DELETE /api/opportunities/:id (delete)             │ │
│  └────────────────────────────────────────────────────────┘ │
│                              ↕                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  models/Opportunity.js (Mongoose Model)               │ │
│  │  • Schema definition                                  │ │
│  │  • Field validation                                   │ │
│  │  • Auto timestamps                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                              ↕                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  config/db.js (Database Connection)                   │ │
│  │  • mongoose.connect()                                 │ │
│  │  • Handle connection errors                           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕
                      MongoDB Connection
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                        │
│                  mongodb://localhost:27017                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Database: placement_tracker                          │ │
│  │  └─ Collection: opportunities                         │ │
│  │     └─ Document 1: { company, role, status, ... }     │ │
│  │     └─ Document 2: { company, role, status, ... }     │ │
│  │     └─ Document 3: { company, role, status, ... }     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 REQUEST FLOW (CREATE OPPORTUNITY)

```
1. USER FILLS FORM
   ↓
2. CLICKS "Add Opportunity" BUTTON
   ↓
3. Frontend: handleSubmit() called
   ↓
4. Frontend: createOpportunity(formData) called
   ↓
5. API Service: fetch('http://localhost:5000/api/opportunities', {...})
   ↓
6. HTTP POST Request sent with JSON data:
   {
     "company": "Google",
     "role": "Software Engineer",
     "status": "applied",
     "deadline": "2026-03-15",
     "link": "https://..."
   }
   ↓
7. Backend: server.js receives request
   ↓
8. Backend: CORS middleware allows request
   ↓
9. Backend: JSON parser converts body to object
   ↓
10. Backend: Routes to /api/opportunities (POST)
    ↓
11. Backend: opportunityRoutes.js POST handler executes
    ↓
12. Backend: Validates data (check required fields)
    ↓
13. Backend: Creates new Opportunity instance
    ↓
14. Backend: Mongoose validates against schema
    ↓
15. Backend: Saves to MongoDB (newOpportunity.save())
    ↓
16. MongoDB: Inserts document, returns saved document with _id
    ↓
17. Backend: Sends success response:
    {
      "success": true,
      "message": "Opportunity created successfully!",
      "data": { _id, company, role, ... }
    }
    ↓
18. Frontend: Receives response
    ↓
19. Frontend: Shows success message
    ↓
20. Frontend: Refreshes opportunity list
    ↓
21. USER SEES NEW OPPORTUNITY IN LIST
```

---

## 🔄 REQUEST FLOW (GET ALL OPPORTUNITIES)

```
1. COMPONENT MOUNTS (useEffect runs)
   ↓
2. Frontend: fetchOpportunities() called
   ↓
3. API Service: getAllOpportunities() called
   ↓
4. HTTP GET Request: fetch('http://localhost:5000/api/opportunities')
   ↓
5. Backend: Routes to /api/opportunities (GET)
   ↓
6. Backend: Executes Opportunity.find().sort({ createdAt: -1 })
   ↓
7. MongoDB: Returns all documents from 'opportunities' collection
   ↓
8. Backend: Sends response:
   {
     "success": true,
     "count": 5,
     "data": [ {...}, {...}, ... ]
   }
   ↓
9. Frontend: Updates state with opportunities array
   ↓
10. React: Re-renders component with new data
    ↓
11. USER SEES LIST OF OPPORTUNITIES
```

---

## 📁 FILE STRUCTURE WITH PURPOSE

```
backend/
├── config/
│   └── db.js                    # MongoDB connection logic
├── models/
│   └── Opportunity.js           # Data schema & validation
├── routes/
│   └── opportunityRoutes.js     # API endpoint handlers
├── .env                         # Secret configuration
├── package.json                 # Dependencies list
└── server.js                    # Application entry point

src/
├── components/
│   ├── AddOpportunityFormBackend.tsx    # Form UI + submission
│   └── OpportunitiesListBackend.tsx     # Display + fetch data
├── services/
│   └── opportunityAPI.js        # API calling functions
└── pages/
    └── OpportunitiesBackend.tsx # Page wrapper
```

---

## 🌐 API ENDPOINTS CHEATSHEET

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| GET | `/api/opportunities` | Get all | None | Array of opportunities |
| POST | `/api/opportunities` | Create new | `{ company, role, status, deadline, link }` | Created opportunity |
| GET | `/api/opportunities/:id` | Get one | None | Single opportunity |
| PUT | `/api/opportunities/:id` | Update | `{ company, role, ... }` | Updated opportunity |
| DELETE | `/api/opportunities/:id` | Delete | None | Success message |

---

## 💾 DATABASE SCHEMA

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),  // Auto-generated
  company: "Google",                           // Required, String
  role: "Software Engineer",                   // Required, String
  status: "applied",                          // Required, Enum
  deadline: ISODate("2026-03-15T00:00:00Z"), // Optional, Date
  link: "https://careers.google.com/jobs/123",// Optional, String
  createdAt: ISODate("2026-02-11T10:30:00Z"), // Auto-generated
  updatedAt: ISODate("2026-02-11T10:30:00Z")  // Auto-generated
}
```

---

## 🔧 KEY CONCEPTS EXPLAINED

### 1. **What is REST API?**
- **RE**presentational **S**tate **T**ransfer
- Standard way for frontend and backend to communicate
- Uses HTTP methods (GET, POST, PUT, DELETE)
- Sends/receives JSON data

### 2. **What is Mongoose?**
- Object Data Modeling (ODM) library for MongoDB
- Creates schemas (blueprints) for data
- Validates data automatically
- Provides helpful methods (save, find, update, delete)

### 3. **What is CORS?**
- **C**ross-**O**rigin **R**esource **S**haring
- Security feature that allows frontend (port 5173) to talk to backend (port 5000)
- Without CORS, browser blocks requests between different ports

### 4. **What is Middleware?**
- Functions that run BEFORE your route handlers
- Examples:
  - `express.json()` - Converts JSON to JavaScript object
  - `cors()` - Allows cross-origin requests
  - Custom validators, authentication, etc.

### 5. **What is async/await?**
- Modern way to handle asynchronous operations
- `async` - Marks function as asynchronous
- `await` - Waits for promise to resolve
- Better than callbacks and easier to read

---

## 🎯 DATA FLOW SUMMARY

```
USER ACTION
    ↓
REACT COMPONENT (UI)
    ↓
EVENT HANDLER (onClick, onSubmit)
    ↓
API SERVICE (fetch function)
    ↓
HTTP REQUEST (JSON data)
    ↓
EXPRESS SERVER (receives request)
    ↓
ROUTE HANDLER (business logic)
    ↓
MONGOOSE MODEL (validation)
    ↓
MONGODB (save/retrieve data)
    ↓
MONGOOSE MODEL (return data)
    ↓
ROUTE HANDLER (format response)
    ↓
EXPRESS SERVER (send response)
    ↓
HTTP RESPONSE (JSON data)
    ↓
API SERVICE (receive data)
    ↓
REACT COMPONENT (update state)
    ↓
RE-RENDER UI (show new data)
    ↓
USER SEES RESULT
```

---

## 🚀 STARTUP SEQUENCE

### Terminal 1 (Backend):
```bash
cd backend          # Navigate to backend folder
npm install         # Install dependencies (first time only)
npm run dev         # Start server with nodemon
```

### Terminal 2 (Frontend):
```bash
npm run dev         # Start Vite dev server
```

### Browser:
```
Visit: http://localhost:5173/opportunities-backend
```

---

## ✅ TESTING CHECKLIST

- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5173)
- [ ] MongoDB running or connected
- [ ] Visit http://localhost:5000 (should show API info)
- [ ] Visit http://localhost:5173 (should show app)
- [ ] Click "Add Opportunity" button
- [ ] Fill form with test data
- [ ] Submit form
- [ ] See success message
- [ ] See new opportunity in list
- [ ] Check MongoDB (data should be saved)
- [ ] Try deleting an opportunity
- [ ] Refresh page (data persists)

---

## 🔍 DEBUGGING TIPS

### Backend Not Starting?
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000     # Windows
lsof -i :5000                    # Mac/Linux

# Check MongoDB connection
mongosh
```

### Frontend Can't Connect?
1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for failed requests
4. Check if API_URL is correct
5. Verify CORS is configured

### Data Not Saving?
1. Check MongoDB is running
2. Verify connection string in `.env`
3. Look at backend terminal for errors
4. Check if validation is passing

---

This is your complete reference guide! 🎉
