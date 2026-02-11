#!/bin/bash

# ================================================
# COMPLETE SETUP SCRIPT
# ================================================
# This script sets up and runs both backend and frontend

echo "🚀 Starting Smart Placement Tracker Setup..."
echo ""

# Step 1: Setup Backend
echo "📦 Step 1: Installing Backend Dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed!"
    exit 1
fi

echo "✅ Backend dependencies installed!"
echo ""

# Step 2: Check MongoDB
echo "🔍 Step 2: Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed!"
else
    echo "⚠️  MongoDB not found. Please install MongoDB:"
    echo "   Visit: https://www.mongodb.com/try/download/community"
    echo ""
    echo "   Or use MongoDB Atlas (cloud):"
    echo "   Visit: https://www.mongodb.com/cloud/atlas"
fi
echo ""

# Step 3: Start Backend
echo "🔥 Step 3: Starting Backend Server..."
npm run dev &
BACKEND_PID=$!

echo "✅ Backend started on http://localhost:5000"
echo ""

# Step 4: Setup Frontend
echo "📦 Step 4: Installing Frontend Dependencies (if needed)..."
cd ..
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "✅ Frontend dependencies ready!"
echo ""

# Step 5: Start Frontend
echo "🎨 Step 5: Starting Frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║  ✅ SETUP COMPLETE!                           ║"
echo "║                                                ║"
echo "║  Backend:  http://localhost:5000              ║"
echo "║  Frontend: http://localhost:5173              ║"
echo "║                                                ║"
echo "║  Press Ctrl+C to stop both servers            ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit 0" INT

# Keep script running
wait
