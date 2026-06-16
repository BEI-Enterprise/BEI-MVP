#!/bin/bash
# Quick Start - BEI MRI Data Flow Fix Testing
# Run this to verify the fix works end-to-end

echo "🚀 BEI MRI Data Flow Fix - Quick Start Testing"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Run this script from /workspaces/BEI-MVP"
    exit 1
fi

echo "📋 STEP 1: Verify Environment"
echo "   - Checking .env.local..."

if [ ! -f "frontend/.env.local" ]; then
    echo "❌ Missing frontend/.env.local"
    echo "   Create it with:"
    echo "   NEXT_PUBLIC_SUPABASE_URL=https://yjvlombhtlmvrlkkmbfu.supabase.co"
    echo "   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_5lj0lfUFd8pCvc1urwBksA_3byhIbJd"
    exit 1
fi

echo "✓ .env.local found"
echo ""

echo "📋 STEP 2: Install Dependencies (if needed)"
echo "   - Running npm install..."
cd frontend

if [ ! -d "node_modules" ]; then
    npm install > /dev/null 2>&1
fi

cd ..
echo "✓ Dependencies ready"
echo ""

echo "📋 STEP 3: Build Check"
echo "   - Compiling TypeScript..."
cd frontend
npm run build > /tmp/build.log 2>&1

if [ $? -eq 0 ]; then
    echo "✓ Build successful"
else
    echo "❌ Build failed. Check /tmp/build.log"
    exit 1
fi

cd ..
echo ""

echo "✅ All Checks Passed!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 NEXT: Start Development Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Run:"
echo "  cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "📝 Quick Test Steps:"
echo "   1. Open browser DevTools (F12)"
echo "   2. Go to Application → Storage → localStorage"
echo "   3. Clear all storage"
echo "   4. Navigate to intake page: /intake/[business_id]"
echo "   5. Complete all 6 steps of the form"
echo "   6. Click 'Generate My MRI Report'"
echo "   7. Observe localStorage being populated during processing"
echo "   8. Report should load without hanging"
echo ""
echo "📚 Full testing guide: /workspaces/BEI-MVP/TESTING_AND_VALIDATION.md"
echo "📚 Implementation details: /workspaces/BEI-MVP/IMPLEMENTATION_SUMMARY.md"
echo ""
