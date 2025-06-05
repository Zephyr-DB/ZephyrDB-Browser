const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building ZephyrDB...');

// Clean dist directory
if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
}
fs.mkdirSync('dist');

// Build with Rollup
execSync('rollup -c --environment NODE_ENV:production', { stdio: 'inherit' });

console.log('Build completed successfully!');
console.log('Files generated:');
console.log('- dist/zephyr-db.js (UMD)');
console.log('- dist/zephyr-db.min.js (UMD minified)');
console.log('- dist/zephyr-db.esm.js (ES module)');
