/**
 * GitHub Authentication Setup Verification Script
 * 
 * This script checks if GitHub OAuth is properly configured in your Next.js application.
 * Run this script using: npm run check-github-auth
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkEnvironmentVariables() {
  log('\n📋 Checking Environment Variables...', colors.blue);
  
  const envPath = path.join(process.cwd(), '.env.local');
  let envExists = false;
  let githubConfigured = false;
  
  try {
    if (fs.existsSync(envPath)) {
      envExists = true;
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      // Check for GitHub Client ID
      const githubClientIdMatch = envContent.match(/NEXT_PUBLIC_GITHUB_CLIENT_ID=(.+)/);
      const githubRedirectUriMatch = envContent.match(/NEXT_PUBLIC_GITHUB_REDIRECT_URI=(.+)/);
      
      if (githubClientIdMatch && githubClientIdMatch[1] && githubClientIdMatch[1] !== 'your_github_client_id_here') {
        githubConfigured = true;
        log('  ✅ GitHub Client ID configured', colors.green);
      } else {
        log('  ❌ GitHub Client ID not configured or using placeholder', colors.red);
      }
      
      if (githubRedirectUriMatch && githubRedirectUriMatch[1]) {
        log('  ✅ GitHub Redirect URI configured', colors.green);
      } else {
        log('  ❌ GitHub Redirect URI not configured', colors.red);
      }
    } else {
      log('  ❌ .env.local file not found', colors.red);
    }
  } catch (error) {
    log(`  ❌ Error reading .env.local: ${error.message}`, colors.red);
  }
  
  return { envExists, githubConfigured };
}

function checkRequiredFiles() {
  log('\n📁 Checking Required Files...', colors.blue);
  
  const requiredFiles = [
    'utils/githubAuth.js',
    'components/auth/GitHubSignIn.jsx',
    'app/auth/github/callback/page.jsx'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      log(`  ✅ ${file}`, colors.green);
    } else {
      log(`  ❌ ${file} - Missing`, colors.red);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
}

function checkUtilityFunctions() {
  log('\n🔧 Checking Utility Functions...', colors.blue);
  
  try {
    const githubAuthPath = path.join(process.cwd(), 'utils/githubAuth.js');
    if (fs.existsSync(githubAuthPath)) {
      const content = fs.readFileSync(githubAuthPath, 'utf8');
      
      const requiredFunctions = [
        'isGithubConfigured',
        'getGithubClientId',
        'generateGithubAuthUrl',
        'generateState',
        'validateState'
      ];
      
      requiredFunctions.forEach(func => {
        if (content.includes(`export const ${func}`) || content.includes(`function ${func}`)) {
          log(`  ✅ ${func} function found`, colors.green);
        } else {
          log(`  ❌ ${func} function missing`, colors.red);
        }
      });
    } else {
      log('  ❌ githubAuth.js not found', colors.red);
      return false;
    }
  } catch (error) {
    log(`  ❌ Error checking utility functions: ${error.message}`, colors.red);
    return false;
  }
  
  return true;
}

function checkIntegration() {
  log('\n🔗 Checking Integration...', colors.blue);
  
  try {
    const loginFormPath = path.join(process.cwd(), 'components/auth/LoginForm.jsx');
    if (fs.existsSync(loginFormPath)) {
      const content = fs.readFileSync(loginFormPath, 'utf8');
      
      if (content.includes('GitHubSignIn')) {
        log('  ✅ GitHubSignIn component imported in LoginForm', colors.green);
      } else {
        log('  ❌ GitHubSignIn component not imported in LoginForm', colors.red);
      }
      
      if (content.includes('githubLoading')) {
        log('  ✅ GitHub loading state configured', colors.green);
      } else {
        log('  ❌ GitHub loading state not configured', colors.red);
      }
    } else {
      log('  ❌ LoginForm.jsx not found', colors.red);
      return false;
    }
  } catch (error) {
    log(`  ❌ Error checking integration: ${error.message}`, colors.red);
    return false;
  }
  
  return true;
}

function printSetupInstructions() {
  log('\n📝 GitHub OAuth Setup Instructions:', colors.bold);
  log('1. Go to https://github.com/settings/developers', colors.yellow);
  log('2. Click "New OAuth App"', colors.yellow);
  log('3. Fill in the application details:', colors.yellow);
  log('   - Application name: Your App Name', colors.yellow);
  log('   - Homepage URL: http://localhost:3000', colors.yellow);
  log('   - Authorization callback URL: http://localhost:3000/auth/github/callback', colors.yellow);
  log('4. Copy the Client ID and update your .env.local file', colors.yellow);
  log('5. Make sure your backend is configured with the same Client ID and Client Secret', colors.yellow);
}

function printTestingInstructions() {
  log('\n🧪 Testing Instructions:', colors.bold);
  log('1. Start your Next.js development server: npm run dev', colors.yellow);
  log('2. Start your backend server on http://localhost:5046', colors.yellow);
  log('3. Go to http://localhost:3000/Login', colors.yellow);
  log('4. Click "Continue with GitHub" button', colors.yellow);
  log('5. Complete GitHub OAuth flow', colors.yellow);
  log('6. Verify you are redirected back and logged in', colors.yellow);
}

function main() {
  log('🔍 GitHub Authentication Setup Verification', colors.bold);
  log('=' .repeat(50), colors.blue);
  
  const { envExists, githubConfigured } = checkEnvironmentVariables();
  const filesExist = checkRequiredFiles();
  const utilsWork = checkUtilityFunctions();
  const integrationOk = checkIntegration();
  
  log('\n📊 Summary:', colors.bold);
  
  if (envExists && githubConfigured && filesExist && utilsWork && integrationOk) {
    log('🎉 All checks passed! GitHub authentication is properly configured.', colors.green);
    printTestingInstructions();
  } else {
    log('⚠️  Some issues found. Please review the errors above.', colors.red);
    
    if (!githubConfigured) {
      printSetupInstructions();
    }
    
    if (!filesExist || !utilsWork || !integrationOk) {
      log('\n❗ Some required files or functions are missing.', colors.red);
      log('Please ensure all GitHub authentication files are properly created.', colors.yellow);
    }
  }
  
  log('\n🔗 Useful Links:', colors.blue);
  log('• GitHub OAuth Apps: https://github.com/settings/developers', colors.reset);
  log('• GitHub OAuth Documentation: https://docs.github.com/en/developers/apps/building-oauth-apps', colors.reset);
}

// Run the verification
main();
