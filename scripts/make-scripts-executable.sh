#!/bin/bash

# Make all scripts in the scripts directory executable

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Make all .js and .sh files in the scripts directory executable
chmod +x scripts/*.js
chmod +x scripts/*.sh

echo "All scripts are now executable!"
