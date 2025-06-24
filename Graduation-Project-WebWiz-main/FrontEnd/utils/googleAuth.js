/**
 * Google Authentication Configuration Utilities
 * 
 * This file contains helper functions and configuration for Google OAuth integration.
 */

/**
 * Validates if Google Client ID is properly configured
 * @returns {boolean} True if Google Client ID is configured
 */
export const isGoogleConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== 'your_google_client_id_here'
  );
};

/**
 * Gets the Google Client ID from environment variables
 * @returns {string|null} Google Client ID or null if not configured
 */
export const getGoogleClientId = () => {
  if (!isGoogleConfigured()) {
    console.warn('Google Client ID is not properly configured. Please check your .env.local file.');
    return null;
  }
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
};

/**
 * Google Identity Services configuration
 */
export const GOOGLE_CONFIG = {
  // Google Identity Services script URL
  scriptUrl: 'https://accounts.google.com/gsi/client',
  
  // Button configuration options
  buttonConfig: {
    theme: 'outline',
    size: 'large',
    width: '100%',
    text: 'signin_with',
    shape: 'rectangular',
    logo_alignment: 'left',
  },
  
  // Identity Services initialization options
  initConfig: {
    auto_select: false,
    cancel_on_tap_outside: true,
  }
};

/**
 * Loads Google Identity Services script dynamically
 * @returns {Promise<boolean>} Promise that resolves when script is loaded
 */
export const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google) {
      resolve(true);
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector(`script[src="${GOOGLE_CONFIG.scriptUrl}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google script')));
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = GOOGLE_CONFIG.scriptUrl;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Google script'));
    
    document.head.appendChild(script);
  });
};
