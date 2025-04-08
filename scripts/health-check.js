#!/usr/bin/env node

/**
 * Health check script that reports the status of the application
 * using the custom vocabulary:
 * - Bought = set of tests
 * - Boast = passed test
 * - Roast = failed test
 * - Route = failed Bought
 * - Conquest = passed Bought
 * - Victory = all Boughts passed
 */

const fs = require('fs');
const path = require('path');

// Import the boughts array to know which ones are required
const { boughts } = require('./run-tests');

// Helper function to determine if a Bought is required
function isBoughtRequired(boughtName) {
  const bought = boughts.find(b => b.name === boughtName);
  return bought ? bought.required : true; // Default to required if not specified
}

// Path to the test results file
const resultsPath = path.join(__dirname, 'test-results.json');

// Check if the results file exists
if (!fs.existsSync(resultsPath)) {
  console.error('❌ No test results found. Run tests first.');
  process.exit(1);
}

try {
  // Read the test results
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

  // Print the summary
  console.log('\n=== Health Check Report ===');

  let requiredFailures = 0;
  let totalBoughts = 0;
  let totalConquests = 0;
  let totalRoutes = 0;
  let totalRequiredBoughts = 0;

  // Process each Bought (test suite)
  Object.keys(results).forEach(boughtName => {
    const bought = results[boughtName];
    const isRequired = isBoughtRequired(boughtName);
    totalBoughts++;

    if (isRequired) {
      totalRequiredBoughts++;
    }

    if (bought.status === 'passed') {
      console.log(`✅ Bought "${boughtName}" ended in a Conquest${isRequired ? ' (Required)' : ' (Optional)'}`);
      totalConquests++;

      // List all Boasts (passed tests)
      bought.tests.forEach(test => {
        if (test.status === 'passed') {
          console.log(`  - Boast: ${test.name}`);
        }
      });
    } else {
      console.log(`❌ Bought "${boughtName}" ended in a Route${isRequired ? ' (Required)' : ' (Optional)'}`);
      totalRoutes++;

      if (isRequired) {
        requiredFailures++;
      }

      // List all Roasts (failed tests)
      bought.tests.forEach(test => {
        if (test.status === 'failed') {
          console.log(`  - Roast: ${test.name}`);
          console.log(`    Error: ${test.error}`);
        }
      });
    }
  });

  // Print the overall status
  console.log('\n=== Summary ===');
  console.log(`Total Boughts: ${totalBoughts}`);
  console.log(`Required Boughts: ${totalRequiredBoughts}`);
  console.log(`Conquests: ${totalConquests}`);
  console.log(`Routes: ${totalRoutes}`);
  console.log(`Required Routes: ${requiredFailures}`);

  if (requiredFailures === 0) {
    if (totalRoutes === 0) {
      console.log('\n🏆 Victory! All Boughts passed.');
    } else {
      console.log('\n🏆 Partial Victory! All required Boughts passed, but some optional Boughts failed.');
    }
    process.exit(0);
  } else {
    console.log('\n❌ Defeat! Some required Boughts failed.');
    process.exit(1);
  }
} catch (error) {
  console.error(`❌ Error reading test results: ${error.message}`);
  process.exit(1);
}
