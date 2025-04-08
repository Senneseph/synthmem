#!/usr/bin/env node

/**
 * Script to generate package-lock.json file if it doesn't exist
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '..', 'frontend');
const lockfilePath = path.join(frontendDir, 'package-lock.json');

console.log('Checking for package-lock.json...');

if (!fs.existsSync(lockfilePath)) {
  console.log('package-lock.json not found. Generating...');
  
  try {
    // Change to frontend directory
    process.chdir(frontendDir);
    
    // Run npm install to generate package-lock.json
    execSync('npm install --package-lock-only', { stdio: 'inherit' });
    
    console.log('✅ package-lock.json generated successfully!');
  } catch (error) {
    console.error(`❌ Error generating package-lock.json: ${error.message}`);
    process.exit(1);
  }
} else {
  console.log('✅ package-lock.json already exists.');
}

process.exit(0);
