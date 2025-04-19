import React, { useState, useEffect } from 'react';
import { useRandomMovie } from '../queries/movieQueries';
import MoviePoster from './MoviePoster';
import MovieGuessInput from './MovieGuessInput';
import { Button } from './ui/button';
import { triggerConfetti, animateSuccess } from '../utils/animationUtils';

const MAX_ATTEMPTS = 3;
const REVEAL_PERCENTAGES = [30, 60, 100]; // Reveal percentages for each attempt

const MovieGuesser: React.FC = () => {
  const [attempts, setAttempts] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [revealPercentage, setRevealPercentage] = useState<number>(REVEAL_PERCENTAGES[0]);
  const [message, setMessage] = useState<string>('');
  
  const { 
    data: movie, 
    isLoading, 
    isError, 
    refetch 
  } = useRandomMovie();

  // Reset the game state when a new movie is loaded
  useEffect(() => {
    if (movie) {
      setAttempts(0);
      setGameStatus('playing');
      setRevealPercentage(REVEAL_PERCENTAGES[0]);
      setMessage('');
    }
  }, [movie]);

  const handleGuess = (guess: string) => {
    if (!movie || gameStatus !== 'playing') return;
    
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedTitle = movie.Title.toLowerCase().trim();
    
    const isCorrect = normalizedGuess === normalizedTitle;
    
    if (isCorrect) {
      setGameStatus('won');
      setRevealPercentage(100);
      setMessage(`Correct! The movie is "${movie.Title}".`);
      
      // Trigger confetti animation
      triggerConfetti();
      
      // Animate success on the poster element
      const posterElement = document.querySelector('.movie-poster');
      if (posterElement) {
        animateSuccess(posterElement as HTMLElement);
      }
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setGameStatus('lost');
        setRevealPercentage(100);
        setMessage(`Game over! The movie was "${movie.Title}".`);
      } else {
        setRevealPercentage(REVEAL_PERCENTAGES[newAttempts]);
        setMessage(`Wrong guess! Try again. ${MAX_ATTEMPTS - newAttempts} attempts left.`);
      }
    }
  };

  const handleNewGame = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-electric-lavender border-t-transparent"></div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-xl font-bold text-holographic-silver">
          Failed to load movie data
        </h2>
        <p className="text-holographic-silver/70">
          There was an error loading the movie. Please try again.
        </p>
        <Button onClick={handleNewGame}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col space-y-8">
      <div className="rounded-lg bg-dark-matter p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-holographic-silver">Movie Plot</h2>
        <p className="text-holographic-silver/90">{movie.Plot}</p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <MoviePoster 
            posterUrl={movie.Poster} 
            revealPercentage={revealPercentage}
            className="movie-poster"
          />
        </div>
        
        <div className="order-1 flex flex-col space-y-6 md:order-2">
          <div className="rounded-lg bg-dark-matter p-6 shadow-lg">
            <MovieGuessInput 
              onGuess={handleGuess} 
              disabled={gameStatus !== 'playing'}
              attemptsLeft={MAX_ATTEMPTS - attempts}
            />
          </div>
          
          {message && (
            <div className={`rounded-lg p-4 text-center ${
              gameStatus === 'won' 
                ? 'bg-neon-violet/20 text-cyberpunk-pink' 
                : gameStatus === 'lost' 
                  ? 'bg-red-500/20 text-red-300' 
                  : 'bg-cosmic-glow/20 text-holographic-silver'
            }`}>
              {message}
            </div>
          )}
          
          {gameStatus !== 'playing' && (
            <Button 
              onClick={handleNewGame}
              className="w-full"
              variant={gameStatus === 'won' ? 'default' : 'secondary'}
            >
              Play Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieGuesser;
