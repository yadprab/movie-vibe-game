import { apiClient } from './client';

export interface Movie {
  Title: string;
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

// Get movie by title
export const getMovieByTitle = async (title: string): Promise<Movie> => {
  const response = await apiClient.get('', {
    searchParams: {
      t: title,
      plot: 'full',
    },
  }).json<Movie>();
  
  return response;
};

// Search movies by title
export const searchMovies = async (searchTerm: string, page = 1): Promise<SearchResponse> => {
  const response = await apiClient.get('', {
    searchParams: {
      s: searchTerm,
      page: page.toString(),
    },
  }).json<SearchResponse>();
  
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
  
  return response;
};

// Get a random movie from a predefined list of popular movies
// This is a workaround since OMDB doesn't have a random movie endpoint
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
  ];
  
  // Get a random movie from the list
  const randomIndex = Math.floor(Math.random() * popularMovies.length);
  const randomTitle = popularMovies[randomIndex];
  
  // Fetch the movie details
  return getMovieByTitle(randomTitle);
};
