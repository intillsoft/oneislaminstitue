@echo off
echo ========================================
echo Starting Workflow Backend Server
echo ========================================
echo.

cd backend

echo Checking for node_modules...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Checking for .env file...
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please create backend/.env with your API keys
    echo See COMPLETE_SETUP_GUIDE.md for details
    echo.
    pause
)

echo Starting backend server on port 3001...
echo.
npm start

