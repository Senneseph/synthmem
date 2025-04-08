#!/bin/bash

# This script sets up git hooks for the project

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

echo "Git hooks have been set up successfully!"
echo "The following hooks are now active:"
echo "- pre-commit: Runs linters on staged files"
echo "- pre-push: Runs tests before pushing to remote"

exit 0
