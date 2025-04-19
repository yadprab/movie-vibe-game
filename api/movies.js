// Serverless function to proxy requests to OMDB API
export default async function handler(req, res) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.VITE_OMDB_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key is not configured' });
    }
    
    // Get query parameters from the request
    const params = new URLSearchParams(req.query);
    
    // Add the API key to the parameters
    params.append('apikey', apiKey);
    
    // Build the URL for the OMDB API
    const url = `https://www.omdbapi.com/?${params.toString()}`;
    
    // Make the request to the OMDB API
    const response = await fetch(url);
    const data = await response.json();
    
    // Return the response from the OMDB API
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying request to OMDB API:', error);
    return res.status(500).json({ error: 'Failed to fetch data from OMDB API' });
  }
}
