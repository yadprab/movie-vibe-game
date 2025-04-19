import ky from "ky";

// Use a local API endpoint instead of directly calling OMDB
// This prevents exposing the API key and movie title in client-side requests
const API_URL = "/api/movies";

// Create a ky instance with the base URL
export const apiClient = ky.extend({
  prefixUrl: API_URL,
  timeout: 30000,
  retry: 1,
  // The API key is added by the Vite proxy, so we don't need to include it here
});

// Function to set API key at runtime (no longer needed but kept for compatibility)
export const setApiKey = () => {
  console.log("API key setting is handled server-side now");
};
