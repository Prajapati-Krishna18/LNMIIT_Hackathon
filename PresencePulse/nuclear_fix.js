const { execSync } = require('child_process');
const path = require('path');

process.chdir(__dirname);

try {
  console.log('Kicking off Nuclear Fix...');
  
  console.log('1. Killing port 8081...');
  try { execSync('npx kill-port 8081', { stdio: 'inherit' }); } catch (e) {}

  console.log('2. Cleaning Android build...');
  process.chdir('android');
  execSync('gradlew clean', { stdio: 'inherit' });
  process.chdir('..');

  console.log('3. Starting Bundler in fresh state...');
  // We can't easily start the bundler and run-android in the same script without detaching
  // But we can let run-android start it.
  
  console.log('4. Running Android build (fresh)...');
  execSync('npx react-native run-android', { stdio: 'inherit' });

  console.log('Nuclear Fix Complete!');
} catch (error) {
  console.error('Fix failed:', error.message);
  process.exit(1);
}
