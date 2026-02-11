@echo off
echo ==================================================
echo Installing Authentication Dependencies
echo ==================================================

REM Navigate to backend directory
cd backend

echo.
echo Installing backend packages...
call npm install jsonwebtoken bcryptjs google-auth-library

echo.
echo ==================================================
echo Installation Complete!
echo ==================================================
echo.
echo Next steps:
echo 1. Copy backend\.env.example to backend\.env
echo 2. Copy .env.example to .env (root directory)
echo 3. Set up Google OAuth in Google Cloud Console
echo 4. Add your GOOGLE_CLIENT_ID to both .env files
echo 5. Generate a strong JWT_SECRET and add to backend\.env
echo.
echo See AUTH_SETUP.md for detailed instructions
echo ==================================================

pause
