#!/bin/bash

# Run all linters and exit with error if any fail

echo "Running ESLint..."
npm run lint
ESLINT_EXIT_CODE=$?

echo "Running Stylelint..."
npm run lint:css
STYLELINT_EXIT_CODE=$?

echo "Running YAML lint..."
npm run lint:yaml
YAMLLINT_EXIT_CODE=$?

# Check if any linter failed
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $STYLELINT_EXIT_CODE -ne 0 ] || [ $YAMLLINT_EXIT_CODE -ne 0 ]; then
  echo "Linting failed!"
  exit 1
else
  echo "All linters passed!"
  exit 0
fi
