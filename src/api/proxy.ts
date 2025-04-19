import { Movie, SearchResponse } from './movies';

// Cache to store movie data and avoid repeated API calls
const movieCache = new Map<string, Movie>();
const searchCache = new Map<string, SearchResponse>();

/**
 * Proxy function to get a movie by title without exposing the actual API call
 * @param fetchFn The actual fetch function that makes the API call
 * @param title The movie title to search for
 * @returns The movie data
 */
export const proxyGetMovieByTitle = async (
  fetchFn: (title: string) => Promise<Movie>,
  title: string
): Promise<Movie> => {
  // Check cache first
  const cacheKey = `title:${title.toLowerCase()}`;
  if (movieCache.has(cacheKey)) {
    return movieCache.get(cacheKey)!;
  }
  
  // Make the actual API call
  const movie = await fetchFn(title);
  
  // Cache the result
  movieCache.set(cacheKey, movie);
  
  return movie;
};

/**
 * Proxy function to search movies without exposing the actual API call
 * @param fetchFn The actual fetch function that makes the API call
 * @param searchTerm The search term
 * @param page The page number
 * @returns The search response
 */
export const proxySearchMovies = async (
  fetchFn: (searchTerm: string, page: number) => Promise<SearchResponse>,
  searchTerm: string,
  page = 1
): Promise<SearchResponse> => {
  // Check cache first
  const cacheKey = `search:${searchTerm.toLowerCase()}:${page}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }
  
  // Make the actual API call
  const response = await fetchFn(searchTerm, page);
  
  // Cache the result
  searchCache.set(cacheKey, response);
  
  return response;
};

/**
 * Proxy function to get a movie by ID without exposing the actual API call
 * @param fetchFn The actual fetch function that makes the API call
 * @param imdbId The IMDb ID
 * @returns The movie data
 */
export const proxyGetMovieById = async (
  fetchFn: (imdbId: string) => Promise<Movie>,
  imdbId: string
): Promise<Movie> => {
  // Check cache first
  const cacheKey = `id:${imdbId}`;
  if (movieCache.has(cacheKey)) {
    return movieCache.get(cacheKey)!;
  }
  
  // Make the actual API call
  const movie = await fetchFn(imdbId);
  
  // Cache the result
  movieCache.set(cacheKey, movie);
  
  return movie;
};

/**
 * Proxy function to get a random movie without exposing the actual API call
 * @param fetchFn The actual fetch function that makes the API call
 * @returns The movie data
 */
export const proxyGetRandomMovie = async (
  fetchFn: () => Promise<Movie>
): Promise<Movie> => {
  // Make the actual API call - no caching for random movies
  return fetchFn();
};
