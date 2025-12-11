# Deployment script for nicheboard_pro (PowerShell)
# This script helps you deploy to various platforms

Write-Host "🚀 nicheboard_pro Deployment Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check Node.js version
$majorVersion = (node -v).Substring(1).Split('.')[0]
if ([int]$majorVersion -lt 18) {
    Write-Host "❌ Node.js version 18+ is required. Current version: $(node -v)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the project
Write-Host ""
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Build output is in the 'dist' directory" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. For Vercel: Run 'vercel' or push to GitHub and connect to Vercel"
Write-Host "2. For Netlify: Run 'netlify deploy --prod' or push to GitHub and connect to Netlify"
Write-Host "3. For GitHub Pages: Push to main branch (GitHub Actions will auto-deploy)"
Write-Host "4. For traditional hosting: Upload the 'dist' folder contents to your web server"
Write-Host ""
Write-Host "📖 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan

