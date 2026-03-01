@echo off
echo ========================================
echo  PhycoSense - Starting Backend Server
echo ========================================
echo.
cd server
echo Installing/Checking dependencies...
call npm install
echo.
echo Starting MongoDB backend server on port 5000...
echo.
call npm run dev
    