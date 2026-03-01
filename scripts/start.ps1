# PhycoSense Dashboard Startup Script
Write-Host "PhycoSense Dashboard Startup" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Please run this script from the project directory." -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    & npm install
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "Dependencies already installed." -ForegroundColor Green
    Write-Host ""
}

Write-Host "Starting PhycoSense Development Server..." -ForegroundColor Cyan
Write-Host "The dashboard will open at: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server when done." -ForegroundColor Gray
Write-Host ""

# Start the development server
& npm start