import { useQuery } from '@tanstack/react-query';
import { getMovieByTitle, getMovieById, getRandomMovie, searchMovies } from '../api/movies';

// Hook to get a movie by title
export const useMovieByTitle = (title: string) => {
  return useQuery({
    queryKey: ['movie', title],
    queryFn: () => getMovieByTitle(title),
    enabled: !!title,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to search movies
export const useSearchMovies = (searchTerm: string, page = 1) => {
  return useQuery({
    queryKey: ['search', searchTerm, page],
    queryFn: () => searchMovies(searchTerm, page),
    enabled: !!searchTerm,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get a movie by IMDb ID
export const useMovieById = (imdbId: string) => {
  return useQuery({
    queryKey: ['movie', 'id', imdbId],
    queryFn: () => getMovieById(imdbId),
    enabled: !!imdbId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get a random movie
export const useRandomMovie = () => {
  return useQuery({
    queryKey: ['movie', 'random'],
    queryFn: getRandomMovie,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
