# PhycoSense Railway Deployment Setup Script
# Run this to prepare for Railway deployment

Write-Host "🚂 PhycoSense Railway Deployment Setup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Git check
try {
    $gitVersion = git --version
    Write-Host "✓ Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git not installed. Download from: https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Node check
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not installed. Download from: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Step 1: Environment Configuration" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# MongoDB connection string
Write-Host "Enter your MongoDB Atlas connection string:" -ForegroundColor White
Write-Host "(Format: mongodb+srv://username:password@cluster.mongodb.net/phycosense)" -ForegroundColor Gray
$mongoUri = Read-Host "MongoDB URI"

if ($mongoUri -eq "") {
    Write-Host "⚠ No MongoDB URI provided. You can add it later in Railway dashboard." -ForegroundColor Yellow
    $mongoUri = "mongodb+srv://username:password@cluster.mongodb.net/phycosense"
}

# Create server .env
$serverEnvContent = @"
# MongoDB Connection
MONGODB_URI=$mongoUri

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS (will be updated after Vercel deployment)
ALLOWED_ORIGINS=http://localhost:3000
"@

Set-Content -Path "server\.env" -Value $serverEnvContent
Write-Host "✓ Created server\.env" -ForegroundColor Green

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Step 2: Install Dependencies" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$installDeps = Read-Host "Install Node.js dependencies? (y/n)"
if ($installDeps -eq 'y') {
    Write-Host "Installing root dependencies..." -ForegroundColor Gray
    npm install
    
    Write-Host "Installing server dependencies..." -ForegroundColor Gray
    cd server
    npm install
    cd ..
    
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Step 3: Git Repository" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$isGitRepo = Test-Path ".git"
if (-not $isGitRepo) {
    Write-Host "Initializing Git repository..." -ForegroundColor Gray
    git init
    git add .
    git commit -m "Initial commit for Railway deployment"
    git branch -M main
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: Create a GitHub repository, then run:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/phycosense.git" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
} else {
    Write-Host "✓ Git repository exists" -ForegroundColor Green
    
    # Check for uncommitted changes
    $status = git status --porcelain
    if ($status) {
        Write-Host ""
        Write-Host "Uncommitted changes detected:" -ForegroundColor Yellow
        git status --short
        Write-Host ""
        $commit = Read-Host "Commit changes? (y/n)"
        if ($commit -eq 'y') {
            $message = Read-Host "Commit message"
            git add .
            git commit -m "$message"
            Write-Host "✓ Changes committed" -ForegroundColor Green
            
            $push = Read-Host "Push to GitHub? (y/n)"
            if ($push -eq 'y') {
                git push
                Write-Host "✓ Pushed to GitHub" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "✓ No uncommitted changes" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Step 4: Test Build" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$testBuild = Read-Host "Test production build? (y/n)"
if ($testBuild -eq 'y') {
    Write-Host "Building frontend..." -ForegroundColor Gray
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Build successful!" -ForegroundColor Green
    } else {
        Write-Host "✗ Build failed. Fix errors before deploying." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Create MongoDB Atlas account (if not done):" -ForegroundColor White
Write-Host "   → https://cloud.mongodb.com" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Push code to GitHub (if not done):" -ForegroundColor White
Write-Host "   → Create repo at github.com" -ForegroundColor Gray
Write-Host "   → git remote add origin https://github.com/USERNAME/phycosense.git" -ForegroundColor Gray
Write-Host "   → git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy to Railway:" -ForegroundColor White
Write-Host "   → Sign up at https://railway.app" -ForegroundColor Gray
Write-Host "   → New Project → Deploy from GitHub" -ForegroundColor Gray
Write-Host "   → Follow RAILWAY_DEPLOYMENT_GUIDE.md" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Deploy frontend to Vercel:" -ForegroundColor White
Write-Host "   → npm install -g vercel" -ForegroundColor Gray
Write-Host "   → vercel" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Update ESP32 code:" -ForegroundColor White
Write-Host "   → Change serverUrl to Railway backend URL" -ForegroundColor Gray
Write-Host "   → Upload to ESP32" -ForegroundColor Gray
Write-Host ""

Write-Host "📖 Full Guide: RAILWAY_DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host "✅ Quick Checklist: RAILWAY_QUICK_CHECKLIST.md" -ForegroundColor Cyan
Write-Host ""

Write-Host "💡 Estimated deployment time: 30 minutes" -ForegroundColor Yellow
Write-Host "💰 Monthly cost: $0 (covered by $5 Railway credit)" -ForegroundColor Yellow
Write-Host ""

Write-Host "Good luck! 🚀" -ForegroundColor Green
