/// <reference types="vite/client" />

// Central API configuration
// Set VITE_API_URL in your .env file for production:
//   VITE_API_URL=https://your-backend-api.com
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE;
