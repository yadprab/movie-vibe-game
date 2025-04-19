import ky from "ky";

// Use the OMDB API directly
const OMDB_API_URL = "https://www.omdbapi.com";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

// Create a ky instance with the base URL and API key
export const apiClient = ky.extend({
  prefixUrl: OMDB_API_URL,
  timeout: 30000,
  retry: 1,
  searchParams: {
    apikey: API_KEY
  }
});

// Function to set API key at runtime (no longer needed but kept for compatibility)
export const setApiKey = () => {
  console.log("API key is now added automatically to all requests");
};
