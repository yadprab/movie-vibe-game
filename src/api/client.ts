import ky from "ky";

// Use the OMDB API directly
const OMDB_API_URL = "https://www.omdbapi.com";

// Get API key from environment variables with a fallback
// In production, this should be set in Vercel environment variables
const API_KEY = import.meta.env.VITE_OMDB_API_KEY || process.env.VITE_OMDB_API_KEY || '';

// Log a warning if the API key is missing
if (!API_KEY) {
  console.warn('OMDB API key is missing. Please set VITE_OMDB_API_KEY in your environment variables.');
}

// Create a ky instance with the base URL and API key
export const apiClient = ky.extend({
  prefixUrl: OMDB_API_URL,
  timeout: 30000,
  retry: 1,
  searchParams: {
    apikey: API_KEY
  }
});

// Function to set API key at runtime (for debugging purposes)
export const setApiKey = () => {
  console.log("API key is set to:", API_KEY ? "Valid key" : "Missing key");
};
