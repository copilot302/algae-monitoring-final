@echo off
echo PhycoSense Dashboard - Quick Start
echo ==================================
echo.

REM Use node directly instead of npm scripts
echo Checking Node.js installation...
node --version
echo.

echo Starting Webpack development server directly...
echo The dashboard will open at: http://localhost:3000
echo.

REM Start webpack dev server directly
node node_modules\webpack\bin\webpack.js serve --mode development --open

pause