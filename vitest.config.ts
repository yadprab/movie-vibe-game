/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to OMDB API
      '/api/movies': {
        target: 'https://www.omdbapi.com',
        changeOrigin: true,
        rewrite: (path) => {
          // Get the API key from environment variables
          const apiKey = process.env.VITE_OMDB_API_KEY || 'e1b491a3';
          
          // Check if the path already has query parameters
          const hasParams = path.includes('?');
          
          // Remove the /api/movies prefix
          const basePath = path.replace(/^\/api\/movies/, '');
          
          // Add the API key as a query parameter
          return `${basePath}${hasParams ? '&' : '?'}apikey=${apiKey}`;
        },
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (_, req) => {
            console.log('Proxying request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received response for:', req.method, req.url, 'status:', proxyRes.statusCode);
          });
        }
      }
    }
  }
 
});
