// Chrome Extension Configuration
// This file should be updated when deploying to match your environment

const CONFIG = {
  // For Replit deployments: Update this URL to match your Repl's URL
  // For local development: Keep as null to auto-detect localhost
  DEFAULT_API_URL: null,
  
  // Examples:
  // DEFAULT_API_URL: 'https://your-repl-name.username.replit.app'
  // DEFAULT_API_URL: 'https://ai-google-form-filler.replit.app'
  
  // The extension will try URLs in this order:
  // 1. Stored URL from chrome.storage
  // 2. DEFAULT_API_URL (if set)
  // 3. http://localhost:5000 (for local development)
  // 4. Show setup screen for manual configuration
};
