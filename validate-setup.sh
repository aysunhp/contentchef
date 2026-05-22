#!/bin/bash

# ContentChef Installation Validator
echo "🔍 ContentChef Installation Validator"
echo "======================================="
echo ""

errors=0

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js $NODE_VERSION installed"
else
    echo "❌ Node.js not found - required!"
    errors=$((errors + 1))
fi

# Check npm
echo ""
echo "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm $NPM_VERSION installed"
else
    echo "❌ npm not found - required!"
    errors=$((errors + 1))
fi

# Check server dependencies
echo ""
echo "Checking server dependencies..."
if [ -d "server/node_modules" ]; then
    echo "✅ Server dependencies installed"
else
    echo "⚠️  Server dependencies not installed"
    echo "   Run: cd server && npm install"
    errors=$((errors + 1))
fi

# Check client dependencies
echo ""
echo "Checking client dependencies..."
if [ -d "client/node_modules" ]; then
    echo "✅ Client dependencies installed"
else
    echo "⚠️  Client dependencies not installed"
    echo "   Run: cd client && npm install"
    errors=$((errors + 1))
fi

# Check server .env
echo ""
echo "Checking server configuration..."
if [ -f "server/.env" ]; then
    echo "✅ Server .env configured"
else
    echo "⚠️  Server .env not found"
    echo "   This will be created with defaults on first run"
fi

# Check client .env
echo ""
echo "Checking client configuration..."
if [ -f "client/.env" ]; then
    echo "✅ Client .env configured"
elif [ -f "client/.env.example" ]; then
    echo "ℹ️  Client .env.example exists (copy to .env if needed)"
else
    echo "⚠️  Client .env template not found"
fi

# Summary
echo ""
echo "======================================="
if [ $errors -eq 0 ]; then
    echo "✨ Setup looks good!"
    echo ""
    echo "Next steps:"
    echo "1. Terminal 1: cd server && npm run dev"
    echo "2. Terminal 2: cd client && npm run dev"
    echo "3. Open http://localhost:5173"
else
    echo "⚠️  Some issues found - see above"
    echo "Run: npm install in both server/ and client/"
fi
echo ""
