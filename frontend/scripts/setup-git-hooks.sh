#!/bin/bash

# This script sets up git hooks for the project using our custom test vocabulary

# Ensure we're in the project root
cd "$(dirname "$0")/../.."

# Check if .git directory exists
if [ ! -d ".git" ]; then
  echo "Error: .git directory not found. Make sure you're running this script from the project root."
  exit 1
fi

# Create .husky directory if it doesn't exist
mkdir -p frontend/.husky

# Make sure husky is installed
cd frontend
npm install

# Initialize husky
npm run prepare

# Make the hook scripts executable
chmod +x .husky/pre-commit
chmod +x .husky/pre-push

# Make the test scripts executable
cd ..
chmod +x scripts/*.js
chmod +x scripts/*.sh

echo "🎮 Git hooks have been set up successfully!"
echo "The following Boughts will be run:"
echo "- pre-commit: Runs all Boughts and requires Victory before committing"
echo "- pre-push: Runs comprehensive Boughts and requires Victory before pushing"

echo "\nRunning a test Bought to verify setup..."
node scripts/bootstrap-test.js

if [ $? -eq 0 ]; then
  echo "\n🏆 Victory! Bootstrap Bought passed. Your setup is complete."
else
  echo "\n❌ Route! Bootstrap Bought failed. Please fix the issues before continuing."
fi

exit 0
