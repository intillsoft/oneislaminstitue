#!/bin/bash

# Deployment script for nicheboard_pro
# This script helps you deploy to various platforms

echo "🚀 nicheboard_pro Deployment Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the project
echo ""
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📁 Build output is in the 'dist' directory"
echo ""
echo "Next steps:"
echo "1. For Vercel: Run 'vercel' or push to GitHub and connect to Vercel"
echo "2. For Netlify: Run 'netlify deploy --prod' or push to GitHub and connect to Netlify"
echo "3. For GitHub Pages: Push to main branch (GitHub Actions will auto-deploy)"
echo "4. For traditional hosting: Upload the 'dist' folder contents to your web server"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"

