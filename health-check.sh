#!/bin/bash

echo "🔍 ContentChef Health Check"
echo "========================================="

# Check Backend
echo ""
echo "Checking Backend (localhost:3001)..."
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health 2>/dev/null)

if [ "$BACKEND_RESPONSE" = "200" ]; then
    echo "✅ Backend: RUNNING"
else
    echo "❌ Backend: NOT RUNNING"
    echo "   Start with: cd server && npm run dev"
fi

# Check Frontend
echo ""
echo "Checking Frontend (localhost:5173)..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null)

if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo "✅ Frontend: RUNNING"
else
    echo "❌ Frontend: NOT RUNNING"
    echo "   Start with: cd client && npm run dev"
fi

echo ""
echo "========================================="
echo ""
if [ "$BACKEND_RESPONSE" = "200" ] && [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo "✨ Everything is running! Open http://localhost:5173"
else
    echo "⚠️  Start both services to use ContentChef"
fi
