# PhycoSense Cloud Deployment Helper Script
# Run this before deploying to cloud

Write-Host "🚀 PhycoSense Cloud Deployment Helper" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed. Please install from: https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Check if node is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install from: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 1: Environment Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Check for .env files
$serverEnvExists = Test-Path "server\.env"
$rootEnvExists = Test-Path ".env"

if (-not $serverEnvExists) {
    Write-Host "⚠ server\.env not found" -ForegroundColor Yellow
    Write-Host "  Creating from template..." -ForegroundColor Yellow
    Copy-Item "server\.env.example" "server\.env"
    Write-Host "  ✓ Created server\.env - PLEASE EDIT THIS FILE WITH YOUR MONGODB URI!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✓ server\.env already exists" -ForegroundColor Green
}

if (-not $rootEnvExists) {
    Write-Host "⚠ .env not found" -ForegroundColor Yellow
    Write-Host "  Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "  ✓ Created .env - You can edit this for local development" -ForegroundColor Green
} else {
    Write-Host "✓ .env already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Install Dependencies" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

$response = Read-Host "Install/update Node.js dependencies? (y/n)"
if ($response -eq 'y') {
    Write-Host "Installing root dependencies..." -ForegroundColor Yellow
    npm install
    
    Write-Host "Installing server dependencies..." -ForegroundColor Yellow
    cd server
    npm install
    cd ..
    
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: Git Repository Setup" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

$isGitRepo = Test-Path ".git"
if (-not $isGitRepo) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit for cloud deployment"
    git branch -M main
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Create a new repository on GitHub" -ForegroundColor White
    Write-Host "2. Run: git remote add origin https://github.com/YOUR_USERNAME/phycosense.git" -ForegroundColor White
    Write-Host "3. Run: git push -u origin main" -ForegroundColor White
} else {
    Write-Host "✓ Git repository already exists" -ForegroundColor Green
    
    # Check for uncommitted changes
    $changes = git status --porcelain
    if ($changes) {
        Write-Host "⚠ You have uncommitted changes:" -ForegroundColor Yellow
        git status --short
        Write-Host ""
        $commitResponse = Read-Host "Commit these changes? (y/n)"
        if ($commitResponse -eq 'y') {
            $commitMsg = Read-Host "Enter commit message"
            git add .
            git commit -m $commitMsg
            Write-Host "✓ Changes committed" -ForegroundColor Green
        }
    } else {
        Write-Host "✓ No uncommitted changes" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Step 4: Pre-Deployment Test" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

$testResponse = Read-Host "Test the build process? (y/n)"
if ($testResponse -eq 'y') {
    Write-Host "Testing webpack build..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Build successful!" -ForegroundColor Green
    } else {
        Write-Host "✗ Build failed. Please fix errors before deploying." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Pre-Deployment Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open CLOUD_DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor White
Write-Host "2. Follow DEPLOYMENT_CHECKLIST.md step-by-step" -ForegroundColor White
Write-Host "3. Start with MongoDB Atlas setup (it's free!)" -ForegroundColor White
Write-Host ""
Write-Host "Important Reminders:" -ForegroundColor Yellow
Write-Host "- Edit server\.env with your MongoDB Atlas connection string" -ForegroundColor White
Write-Host "- Push your code to GitHub before deploying to Render" -ForegroundColor White
Write-Host "- Update ESP32 code with cloud server URL after deployment" -ForegroundColor White
Write-Host ""
Write-Host "Questions? Check CLOUD_DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Good luck! 🚀" -ForegroundColor Green
