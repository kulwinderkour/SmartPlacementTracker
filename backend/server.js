// ==================================================
// MAIN SERVER FILE
// ==================================================
// This is the entry point of our backend application

// Import required packages
import process from 'process';           // Access process global object
import express from 'express';           // Web framework
import dotenv from 'dotenv';             // Load environment variables
import cors from 'cors';                 // Allow frontend to connect
import connectDB from "./config/db.js"; // Database connection function
import opportunityRoutes from './routes/opportunityRoutes.js'; // Import routes
import authRoutes from './routes/authRoutes.js'; // Import auth routes
import parserRoutes from './routes/parserRoutes.js'; // Import parser routes
import analyticsRoutes from './routes/analyticsRoutes.js'; // Import analytics routes
import resumeRoutes from './routes/resumeRoutes.js'; // Import resume routes
import { initializeScheduler } from './services/notificationScheduler.js'; // Import scheduler

// Load environment variables from .env file
dotenv.config();

console.log("JOOBLE KEY =", process.env.JOOBLE_API_KEY);
console.log("MONGO:", process.env.MONGODB_URI);

// Connect to MongoDB database
connectDB();

// Initialize notification scheduler
initializeScheduler();

// Create Express app
const app = express();

// ==================================================
// MIDDLEWARE
// ==================================================
// Middleware = Functions that run before our route handlers

// 1. CORS - Allow frontend (React) to make requests to backend
app.use(
  cors({
    origin: 'http://localhost:5173', // Your React app URL (change if different)
    credentials: true,
  })
);

// 2. JSON Parser - Convert incoming JSON data to JavaScript objects
app.use(express.json());

// 3. URL Encoded - Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
// ==================================================
// ROUTES
// ==================================================

// Test route - Check if server is running
app.get("/api/jobs", async (req,res)=>{
  const response = await fetch(
    `https://jooble.org/api/${process.env.JOOBLE_API_KEY}`,
    {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        keywords:"software engineer",
        location:"India"
      })
    }
  );
  const data = await response.json();
  res.json(data);
});

// Use authentication routes
// All routes in authRoutes will be prefixed with /api/auth
app.use('/api/auth', authRoutes);

// Use parser routes
// All routes in parserRoutes will be prefixed with /api/parser
app.use('/api/parser', parserRoutes);

// Use analytics routes
// All routes in analyticsRoutes will be prefixed with /api/analytics
app.use('/api/analytics', analyticsRoutes);

// Use resume routes
// All routes in resumeRoutes will be prefixed with /api/resume
app.use('/api/resume', resumeRoutes);

// Use opportunity routes
// All routes in opportunityRoutes will be prefixed with /api/opportunities
app.use('/api/opportunities', opportunityRoutes);

// ==================================================
// ERROR HANDLING
// ==================================================

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ==================================================
// START SERVER
// ==================================================

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║  🚀 Server is running!                ║
  ║  📡 Port: ${PORT}                        ║
  ║  🌐 URL: http://localhost:${PORT}       ║
  ╚════════════════════════════════════════╝
  `);
});
