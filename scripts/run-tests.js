#!/usr/bin/env node

/**
 * Test runner script that runs all tests and reports results
 * using the custom vocabulary:
 * - Bought = set of tests
 * - Boast = passed test
 * - Roast = failed test
 * - Route = failed Bought
 * - Conquest = passed Bought
 * - Victory = all Boughts passed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define the test suites (Boughts)
// Export the boughts array for use in health-check.js
const boughts = [
  {
    name: 'Bootstrap',
    command: 'node scripts/bootstrap-test.js',
    description: 'Basic system checks',
    required: true // This Bought must pass
  },
  {
    name: 'Frontend',
    command: 'cd frontend && npm test',
    description: 'Frontend unit tests',
    required: true // This Bought must pass
  }
];

// Initialize results object
const results = {};

// Check if package-lock.json exists
const packageLockPath = path.join(__dirname, '..', 'frontend', 'package-lock.json');
if (!fs.existsSync(packageLockPath)) {
  console.log('⚠️ package-lock.json not found. Running generate-lockfile.js...');
  try {
    execSync('node scripts/generate-lockfile.js', { encoding: 'utf8' });
  } catch (error) {
    console.error(`❌ Error generating package-lock.json: ${error.message}`);
    process.exit(1);
  }
}

console.log('🧪 Starting test suites (Boughts)...\n');

let allPassed = true;

// Run each test suite
boughts.forEach(bought => {
  console.log(`📋 Running Bought: ${bought.name} - ${bought.description}`);

  results[bought.name] = {
    description: bought.description,
    tests: [],
    status: 'passed'
  };

  try {
    // Run the command
    const output = execSync(bought.command, { encoding: 'utf8' });

    // Parse the output to extract individual test results
    // This is a simplified example - in reality, you'd parse the actual test output
    const testLines = output.split('\n').filter(line =>
      line.includes('PASS') || line.includes('FAIL') ||
      line.includes('✓') || line.includes('✗')
    );

    testLines.forEach(line => {
      const isPass = line.includes('PASS') || line.includes('✓');
      const testName = line.replace(/PASS|FAIL|✓|✗/g, '').trim();

      if (testName) {
        results[bought.name].tests.push({
          name: testName,
          status: isPass ? 'passed' : 'failed',
          error: isPass ? null : 'Test failed'
        });

        if (isPass) {
          console.log(`  ✅ Boast: ${testName}`);
        } else {
          console.log(`  ❌ Roast: ${testName}`);
          results[bought.name].status = 'failed';
        }
      }
    });

    // If no specific tests were found, add a generic one based on command success
    if (results[bought.name].tests.length === 0) {
      results[bought.name].tests.push({
        name: `${bought.name} general check`,
        status: 'passed',
        error: null
      });
      console.log(`  ✅ Boast: ${bought.name} general check`);
    }

    if (results[bought.name].status === 'passed') {
      console.log(`✅ Bought "${bought.name}" ended in a Conquest\n`);
    } else {
      console.log(`❌ Bought "${bought.name}" ended in a Route\n`);
      allPassed = false;
    }
  } catch (error) {
    console.log(`❌ Bought "${bought.name}" ended in a Route`);
    console.log(`  Error: ${error.message}\n`);

    results[bought.name].status = 'failed';
    results[bought.name].tests.push({
      name: `${bought.name} execution`,
      status: 'failed',
      error: error.message
    });

    allPassed = false;
  }
});

// Save results to a file
fs.writeFileSync(
  path.join(__dirname, 'test-results.json'),
  JSON.stringify(results, null, 2)
);

// Print summary
console.log('=== Test Summary ===');
let conquests = 0;
let routes = 0;
let requiredRoutes = 0; // Count of required Boughts that failed

Object.keys(results).forEach(boughtName => {
  const status = results[boughtName].status;
  const bought = boughts.find(b => b.name === boughtName);
  const required = bought ? bought.required : true; // Default to required if not specified

  console.log(`${status === 'passed' ? '✅' : '❌'} ${boughtName}: ${status === 'passed' ? 'Conquest' : 'Route'}${required ? ' (Required)' : ' (Optional)'}`);

  if (status === 'passed') {
    conquests++;
  } else {
    routes++;
    if (required) {
      requiredRoutes++;
    }
  }
});

console.log(`\nTotal Boughts: ${boughts.length}`);
console.log(`Conquests: ${conquests}`);
console.log(`Routes: ${routes}`);
console.log(`Required Routes: ${requiredRoutes}`);

// Only fail if required Boughts failed
if (requiredRoutes === 0) {
  if (routes === 0) {
    console.log('\n🏆 Victory! All Boughts passed.');
  } else {
    console.log('\n🏆 Partial Victory! All required Boughts passed, but some optional Boughts failed.');
  }
  process.exit(0);
} else {
  console.log('\n❌ Defeat! Some required Boughts failed.');
  process.exit(1);
}

// Export the boughts array for use in health-check.js
module.exports = { boughts };
