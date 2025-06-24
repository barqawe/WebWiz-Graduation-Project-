#!/usr/bin/env node

/**
 * WebWiz Google Auth Setup Checker
 * 
 * This script helps verify that Google Authentication is properly configured.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Google Authentication Setup...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('   Create one by copying .env.example:');
  console.log('   cp .env.example .env.local\n');
  process.exit(1);
}

// Read .env.local file
const envContent = fs.readFileSync(envPath, 'utf8');
const googleClientIdMatch = envContent.match(/NEXT_PUBLIC_GOOGLE_CLIENT_ID=(.+)/);

if (!googleClientIdMatch) {
  console.log('❌ NEXT_PUBLIC_GOOGLE_CLIENT_ID not found in .env.local');
  console.log('   Add this line to your .env.local file:');
  console.log('   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here\n');
  process.exit(1);
}

const clientId = googleClientIdMatch[1].trim();

if (clientId === 'your_google_client_id_here' || clientId === '') {
  console.log('❌ Google Client ID not configured');
  console.log('   Replace "your_google_client_id_here" with your actual Google Client ID');
  console.log('   Get it from: https://console.cloud.google.com/\n');
  process.exit(1);
}

// Basic validation of Client ID format
if (!clientId.endsWith('.apps.googleusercontent.com')) {
  console.log('⚠️  Warning: Google Client ID format seems incorrect');
  console.log('   Google Client IDs usually end with ".apps.googleusercontent.com"');
  console.log('   Current value:', clientId, '\n');
}

console.log('✅ Google Client ID is configured');
console.log('   Client ID:', clientId.substring(0, 20) + '...', '\n');

// Check if required files exist
const requiredFiles = [
  'components/auth/GoogleSignIn.jsx',
  'utils/googleAuth.js'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Required file missing: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Required file exists: ${file}`);
  }
}

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing');
  process.exit(1);
}

console.log('\n🎉 Google Authentication setup looks good!');
console.log('\nNext steps:');
console.log('1. Make sure your backend is configured with the same Google Client ID');
console.log('2. Ensure your backend has the /api/auth/google endpoint');
console.log('3. Add your domain to Google Cloud Console authorized origins');
console.log('4. Run "npm run dev" to test the authentication');
console.log('\nFor detailed setup instructions, check the README.md file.');
