/**
 * GitHub Authentication Configuration Utilities
 *
 * This file contains helper functions and configuration for GitHub OAuth integration.
 */

/**
 * Validates if GitHub OAuth is properly configured
 * @returns {boolean} True if GitHub Client ID is configured
 */
export const isGithubConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID &&
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID !== "your_github_client_id_here"
  );
};

/**
 * Gets the GitHub Client ID from environment variables
 * @returns {string|null} GitHub Client ID or null if not configured
 */
export const getGithubClientId = () => {
  if (!isGithubConfigured()) {
    console.warn(
      "GitHub Client ID is not properly configured. Please check your .env.local file."
    );
    return null;
  }
  return process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
};

/**
 * Gets the GitHub redirect URI
 * @returns {string} GitHub redirect URI
 */
export const getGithubRedirectUri = () => {
  return (
    process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI ||
    `${window.location.origin}/auth/github/callback`
  );
};

/**
 * GitHub OAuth configuration
 */
export const GITHUB_CONFIG = {
  // GitHub OAuth URLs
  authorizeUrl: "https://github.com/login/oauth/authorize",

  // OAuth scopes - minimal permissions needed
  scopes: ["user:email"],

  // OAuth parameters
  responseType: "code",

  // Button styling configuration
  buttonConfig: {
    backgroundColor: "#24292e",
    color: "#ffffff",
    border: "1px solid #24292e",
    borderRadius: "8px",
    padding: "0.875rem 1rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
  },
};

/**
 * Generates GitHub OAuth authorization URL
 * @param {string} state - Random state parameter for security
 * @returns {string} Authorization URL
 */
export const generateGithubAuthUrl = (state) => {
  const clientId = getGithubClientId();
  if (!clientId) {
    throw new Error("GitHub Client ID not configured");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getGithubRedirectUri(),
    scope: GITHUB_CONFIG.scopes.join(" "),
    state: state,
    response_type: GITHUB_CONFIG.responseType,
  });

  return `${GITHUB_CONFIG.authorizeUrl}?${params.toString()}`;
};

/**
 * Generates a random state parameter for OAuth security
 * @returns {string} Random state string
 */
export const generateState = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/**
 * Validates the state parameter returned from GitHub
 * @param {string} returnedState - State returned from GitHub
 * @param {string} expectedState - Expected state value
 * @returns {boolean} True if state is valid
 */
export const validateState = (returnedState, expectedState) => {
  return returnedState === expectedState;
};
