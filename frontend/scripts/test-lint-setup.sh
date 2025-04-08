#!/bin/bash

# This script tests the linting setup by creating a file with linting errors,
# running the linter, and verifying that it fails.

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Create a JavaScript file with linting errors
cat > "$TEMP_DIR/bad-code.js" << 'EOF'
function badCode() {
var x = 1;
  if (x == "1") {
console.log("This is bad code with linting errors");
  }
};
EOF

echo "Created file with linting errors: $TEMP_DIR/bad-code.js"

# Copy ESLint configuration to the temporary directory
cp .eslintrc.cjs "$TEMP_DIR/"
cp .prettierrc "$TEMP_DIR/"

# Run ESLint on the file
echo "Running ESLint on the file..."
cd "$TEMP_DIR" && npx eslint bad-code.js

# Check the exit code
if [ $? -ne 0 ]; then
  echo "✅ Test passed: ESLint correctly identified errors"
else
  echo "❌ Test failed: ESLint did not identify errors"
  exit 1
fi

# Clean up
rm -rf "$TEMP_DIR"
echo "Cleaned up temporary directory"

echo "Linting setup test completed successfully!"
exit 0
