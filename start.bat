@echo off
REM ================================================
REM WINDOWS SETUP SCRIPT
REM ================================================
REM This script sets up and runs both backend and frontend

echo.
echo ================================================
echo   SMART PLACEMENT TRACKER - WINDOWS SETUP
echo ================================================
echo.

REM Step 1: Setup Backend
echo [1/5] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo DONE: Backend dependencies installed!
echo.

REM Step 2: Check MongoDB
echo [2/5] Checking MongoDB...
where mongod >nul 2>&1
if %errorlevel% equ 0 (
    echo FOUND: MongoDB is installed!
) else (
    echo WARNING: MongoDB not found!
    echo.
    echo Please install MongoDB:
    echo   Option 1: Local - https://www.mongodb.com/try/download/community
    echo   Option 2: Cloud - https://www.mongodb.com/cloud/atlas
    echo.
)
echo.

REM Step 3: Start Backend
echo [3/5] Starting Backend Server...
start "Backend Server" cmd /k "npm run dev"
echo DONE: Backend started on http://localhost:5000
echo.

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Step 4: Setup Frontend
echo [4/5] Setting up Frontend...
cd ..
if not exist "node_modules\" (
    echo Installing Frontend Dependencies...
    call npm install
)
echo DONE: Frontend ready!
echo.

REM Step 5: Start Frontend
echo [5/5] Starting Frontend...
start "Frontend Server" cmd /k "npm run dev"
echo DONE: Frontend started on http://localhost:5173
echo.

echo ================================================
echo   SETUP COMPLETE!
echo ================================================
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo.
echo   Two command windows will open:
echo   - One for Backend (Node.js/Express)
echo   - One for Frontend (Vite/React)
echo.
echo   Close those windows to stop the servers.
echo ================================================
echo.
pause
