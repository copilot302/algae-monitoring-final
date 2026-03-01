@echo off
echo PhycoSense Dashboard Startup Script
echo ====================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo.
    powershell -ExecutionPolicy Bypass -Command "npm install"
    echo.
    echo Dependencies installed successfully!
    echo.
) else (
    echo Dependencies already installed.
    echo.
)

echo Starting PhycoSense Development Server...
echo The dashboard will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server when done.
echo.

powershell -ExecutionPolicy Bypass -Command "npm start"

pause