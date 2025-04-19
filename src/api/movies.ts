import { apiClient } from './client';
import { encryptText } from '../utils/encryption';

export interface Movie {
  Title: string;
  EncryptedTitle?: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  Plot?: string;
  Director?: string;
  Actors?: string;
  Genre?: string;
  Released?: string;
  Runtime?: string;
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
}

/**
 * Process movie data to encrypt sensitive information
 * @param movie The movie data from the API
 * @returns Processed movie with encrypted title
 */
const processMovieData = (movie: Movie): Movie => {
  if (!movie) return movie;
  
  // Create a copy of the movie object
  const processedMovie = { ...movie };
  
  // Encrypt the title and store it
  processedMovie.EncryptedTitle = encryptText(movie.Title);
  
  // We no longer replace the title in the plot
  // The UI will handle hiding the title with the spoiler component
  
  return processedMovie;
};

// Get movie by title
export const getMovieByTitle = async (title: string): Promise<Movie> => {
  const response = await apiClient.get('', {
    searchParams: {
      t: title,
      plot: 'full',
    },
  }).json<Movie>();
  
  return processMovieData(response);
};

// Search movies by title
export const searchMovies = async (searchTerm: string, page = 1): Promise<SearchResponse> => {
  const response = await apiClient.get('', {
    searchParams: {
      s: searchTerm,
      page: page.toString(),
    },
  }).json<SearchResponse>();
  
  // Process each movie in the search results
  if (response.Search) {
    response.Search = response.Search.map(movie => processMovieData(movie));
  }
  
  return response;
};

// Get movie by IMDb ID
export const getMovieById = async (imdbId: string): Promise<Movie> => {
  const response = await apiClient.get('', {
    searchParams: {
      i: imdbId,
      plot: 'full',
    },
  }).json<Movie>();
  
  return processMovieData(response);
};

// Get a random movie from a predefined list of popular movies
export const getRandomMovie = async (): Promise<Movie> => {
  // List of popular movie titles
  const popularMovies = [
    'The Shawshank Redemption',
    'The Godfather',
    'The Dark Knight',
    'Pulp Fiction',
    'Fight Club',
    'Forrest Gump',
    'Inception',
    'The Matrix',
    'Interstellar',
    'The Lord of the Rings',
    'Star Wars',
    'The Avengers',
    'Jurassic Park',
    'Titanic',
    'Avatar',
    'Gladiator',
    'The Lion King',
    'Finding Nemo',
    'Toy Story',
    'Up',
    'Frozen',
    'Coco',
    'Moana',
    'Inside Out',
    'Zootopia',
    'The Incredibles',
    'Wall-E',
    'Ratatouille',
    'Spirited Away',
    'Your Name',
    'Princess Mononoke',
    'Howl\'s Moving Castle',
    'Akira',
    'Ghost in the Shell',
    'Blade Runner',
    'Alien',
    'The Terminator',
    'Die Hard',
    'The Silence of the Lambs',
    'The Sixth Sense'
  ];
  
  // Get a random movie from the list
  const randomIndex = Math.floor(Math.random() * popularMovies.length);
  const randomTitle = popularMovies[randomIndex];
  
  // Fetch the movie details
  return getMovieByTitle(randomTitle);
};
