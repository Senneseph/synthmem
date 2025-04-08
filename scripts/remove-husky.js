#!/usr/bin/env node

/**
 * Script to remove all husky-related files and hooks
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Removing husky and related files...');

// Paths to check and remove
const pathsToRemove = [
  path.join(__dirname, '..', 'frontend', '.husky'),
  path.join(__dirname, '..', '.husky'),
  path.join(__dirname, '..', '.git', 'hooks', 'pre-commit'),
  path.join(__dirname, '..', '.git', 'hooks', 'pre-push'),
  path.join(__dirname, '..', 'frontend', '.lintstagedrc')
];

// Check and remove each path
pathsToRemove.forEach(p => {
  try {
    if (fs.existsSync(p)) {
      console.log(`Removing: ${p}`);
      
      if (fs.lstatSync(p).isDirectory()) {
        // Remove directory recursively
        if (process.platform === 'win32') {
          execSync(`rmdir /s /q "${p}"`, { stdio: 'inherit' });
        } else {
          execSync(`rm -rf "${p}"`, { stdio: 'inherit' });
        }
      } else {
        // Remove file
        fs.unlinkSync(p);
      }
      
      console.log(`✅ Removed: ${p}`);
    } else {
      console.log(`Skipping (not found): ${p}`);
    }
  } catch (error) {
    console.error(`❌ Error removing ${p}: ${error.message}`);
  }
});

// Check for any remaining husky hooks in .git/hooks
try {
  const hooksDir = path.join(__dirname, '..', '.git', 'hooks');
  
  if (fs.existsSync(hooksDir)) {
    const files = fs.readdirSync(hooksDir);
    
    files.forEach(file => {
      const filePath = path.join(hooksDir, file);
      
      // Check if the file contains husky
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('husky')) {
          console.log(`Removing husky hook: ${filePath}`);
          fs.unlinkSync(filePath);
          console.log(`✅ Removed: ${filePath}`);
        }
      } catch (error) {
        // Skip if we can't read the file
      }
    });
  }
} catch (error) {
  console.error(`❌ Error checking .git/hooks: ${error.message}`);
}

console.log('🎉 Husky removal completed!');
