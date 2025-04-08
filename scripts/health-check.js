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
  
  let allPassed = true;
  let totalBoughts = 0;
  let totalConquests = 0;
  let totalRoutes = 0;
  
  // Process each Bought (test suite)
  Object.keys(results).forEach(boughtName => {
    const bought = results[boughtName];
    totalBoughts++;
    
    if (bought.status === 'passed') {
      console.log(`✅ Bought "${boughtName}" ended in a Conquest`);
      totalConquests++;
      
      // List all Boasts (passed tests)
      bought.tests.forEach(test => {
        if (test.status === 'passed') {
          console.log(`  - Boast: ${test.name}`);
        }
      });
    } else {
      console.log(`❌ Bought "${boughtName}" ended in a Route`);
      totalRoutes++;
      allPassed = false;
      
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
  console.log(`Conquests: ${totalConquests}`);
  console.log(`Routes: ${totalRoutes}`);
  
  if (allPassed) {
    console.log('\n🏆 Victory! All Boughts passed.');
    process.exit(0);
  } else {
    console.log('\n❌ Defeat! Some Boughts failed.');
    process.exit(1);
  }
} catch (error) {
  console.error(`❌ Error reading test results: ${error.message}`);
  process.exit(1);
}
