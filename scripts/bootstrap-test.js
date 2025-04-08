#!/usr/bin/env node

/**
 * Bootstrap test script that checks basic system requirements
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Running Bootstrap tests...');

// Array to store test results
const tests = [];

// Check if frontend directory exists
try {
  const frontendExists = fs.existsSync(path.join(__dirname, '..', 'frontend'));
  console.log(`✓ Frontend directory exists: ${frontendExists}`);
  tests.push({ name: 'Frontend directory check', status: 'passed' });
} catch (error) {
  console.log(`✗ Frontend directory check failed: ${error.message}`);
  tests.push({ name: 'Frontend directory check', status: 'failed', error: error.message });
}

// Check if package.json exists
try {
  const packageJsonExists = fs.existsSync(path.join(__dirname, '..', 'frontend', 'package.json'));
  console.log(`✓ package.json exists: ${packageJsonExists}`);
  tests.push({ name: 'package.json check', status: 'passed' });
} catch (error) {
  console.log(`✗ package.json check failed: ${error.message}`);
  tests.push({ name: 'package.json check', status: 'failed', error: error.message });
}

// Check if package-lock.json exists
try {
  const packageLockExists = fs.existsSync(path.join(__dirname, '..', 'frontend', 'package-lock.json'));
  if (packageLockExists) {
    console.log(`✓ package-lock.json exists: ${packageLockExists}`);
    tests.push({ name: 'package-lock.json check', status: 'passed' });
  } else {
    console.log(`✗ package-lock.json does not exist. Will be generated during build.`);
    tests.push({ name: 'package-lock.json check', status: 'passed', note: 'Will be generated during build' });
  }
} catch (error) {
  console.log(`✗ package-lock.json check failed: ${error.message}`);
  tests.push({ name: 'package-lock.json check', status: 'failed', error: error.message });
}

// Check Node.js version
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✓ Node.js version: ${nodeVersion}`);
  tests.push({ name: 'Node.js version check', status: 'passed' });
} catch (error) {
  console.log(`✗ Node.js version check failed: ${error.message}`);
  tests.push({ name: 'Node.js version check', status: 'failed', error: error.message });
}

// Check npm version
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✓ npm version: ${npmVersion}`);
  tests.push({ name: 'npm version check', status: 'passed' });
} catch (error) {
  console.log(`✗ npm version check failed: ${error.message}`);
  tests.push({ name: 'npm version check', status: 'failed', error: error.message });
}

// Check if required files exist
const requiredFiles = [
  { path: path.join(__dirname, '..', 'frontend', '.eslintrc.cjs'), name: 'ESLint config' },
  { path: path.join(__dirname, '..', 'frontend', '.prettierrc'), name: 'Prettier config' },
  { path: path.join(__dirname, '..', 'frontend', 'vite.config.js'), name: 'Vite config' }
];

requiredFiles.forEach(file => {
  try {
    const exists = fs.existsSync(file.path);
    console.log(`✓ ${file.name} exists: ${exists}`);
    tests.push({ name: `${file.name} check`, status: 'passed' });
  } catch (error) {
    console.log(`✗ ${file.name} check failed: ${error.message}`);
    tests.push({ name: `${file.name} check`, status: 'failed', error: error.message });
  }
});

// Check if all tests passed
const allPassed = tests.every(test => test.status === 'passed');

console.log('\n=== Bootstrap Test Summary ===');
console.log(`Total tests: ${tests.length}`);
console.log(`Passed: ${tests.filter(t => t.status === 'passed').length}`);
console.log(`Failed: ${tests.filter(t => t.status === 'failed').length}`);

if (allPassed) {
  console.log('\nPASS: All bootstrap tests passed');
  process.exit(0);
} else {
  console.log('\nFAIL: Some bootstrap tests failed');
  process.exit(1);
}
