import ky from "ky";

// OMDB API base URL
const API_URL = "https://www.omdbapi.com/";

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_OMDB_API_KEY || "YOUR_OMDB_API_KEY";

// Create a ky instance with the base URL and default parameters
export const apiClient = ky.extend({
  prefixUrl: API_URL,
  searchParams: {
    apikey: API_KEY,
  },
  timeout: 30000,
  retry: 1,
});

// Function to set API key at runtime
export const setApiKey = (key: string) => {
  apiClient.extend({
    searchParams: {
      apikey: key,
    },
  }) as unknown;
};
