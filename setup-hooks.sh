#!/bin/bash

echo "🔧 Setting up Git hooks for hackathon-lalabai..."

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the root of the hackathon-lalabai project"
    exit 1
fi

# Create the pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh

echo "🔍 Running lint check in frontend..."

# Change to frontend directory and run lint
cd frontend

# Run lint and capture the output
LINT_OUTPUT=$(npm run lint 2>&1)
LINT_EXIT_CODE=$?

# Check if there are actual ESLint errors (not just pnpm warnings)
if [ $LINT_EXIT_CODE -ne 0 ]; then
    # Check if the error is just about pnpm missing
    if echo "$LINT_OUTPUT" | grep -q "pnpm: command not found"; then
        echo "⚠️  Warning: pnpm not found, but continuing with lint check..."
        # Try to run lint again, ignoring pnpm errors
        npm run lint > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "✅ Lint check passed (ignoring pnpm warnings)!"
            exit 0
        fi
    fi
    
    echo "❌ Lint check failed! Please fix the errors before committing."
    echo "💡 You can run 'cd frontend && npm run lint' to see the errors."
    exit 1
fi

echo "✅ Lint check passed!"
exit 0
EOF

# Make the hook executable
chmod +x .git/hooks/pre-commit

echo "✅ Git hooks installed successfully!"
echo ""
echo "📋 What this does:"
echo "   - Runs 'npm run lint' in frontend before each commit"
echo "   - Blocks commits if there are ESLint errors"
echo "   - Ignores pnpm warnings (non-critical)"
echo ""
echo "🔄 To disable temporarily: git commit --no-verify"
echo "🔍 To check lint manually: cd frontend && npm run lint" 