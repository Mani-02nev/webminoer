#!/bin/bash

# Times Tech Webinar Platform - Quick Setup Script
# This script helps you set up the MongoDB connection

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Times Tech Webinar Platform - Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if .env file exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

echo ""
echo "Please provide your MongoDB Atlas connection details:"
echo ""

# Get MongoDB URI
read -p "Enter your MongoDB Atlas connection string: " MONGODB_URI

# Validate input
if [ -z "$MONGODB_URI" ]; then
    echo "❌ Error: MongoDB URI cannot be empty!"
    exit 1
fi

# Create .env file
cat > .env << EOF
# MongoDB Atlas Connection String
MONGODB_URI=$MONGODB_URI

# Node Environment
NODE_ENV=development
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Install dependencies:"
echo "   npm install"
echo ""
echo "2. Start development server:"
echo "   npm run dev"
echo ""
echo "3. Build for production:"
echo "   npm run build"
echo ""
echo "4. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 For detailed deployment instructions, see DEPLOYMENT.md"
echo ""
