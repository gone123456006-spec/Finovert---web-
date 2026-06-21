/// <reference types="vite/client" />

// Central API configuration
// Set VITE_API_URL in your .env file for production:
//   VITE_API_URL=https://your-backend-api.com
// Hardcoded to localhost to ensure it doesn't hit the production server
const API_BASE = "http://localhost:5000";

export default API_BASE;
