import React, { useState, useEffect, useRef } from 'react';
import { useRandomMovie } from '../queries/movieQueries';
import MoviePoster from './MoviePoster';
import MovieGuessInput from './MovieGuessInput';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { triggerConfetti, animateSuccess } from '../utils/animationUtils';
import { LetterInputRef } from './LetterInput';

const MAX_ATTEMPTS = 3;
const REVEAL_PERCENTAGES = [30, 60, 100]; // Reveal percentages for each attempt

const MovieGuesser: React.FC = () => {
  const [attempts, setAttempts] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [revealPercentage, setRevealPercentage] = useState<number>(REVEAL_PERCENTAGES[0]);
  const [message, setMessage] = useState<string>('');
  const letterInputRef = useRef<LetterInputRef>(null);
  
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
    if (letterInputRef.current) {
      letterInputRef.current.clear();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center min-h-[400px]">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent neon-border"></div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4 text-center min-h-[400px] glass-card p-8">
        <h2 className="text-xl font-bold text-foreground neon-text">
          Failed to load movie data
        </h2>
        <p className="text-foreground/70">
          There was an error loading the movie. Please try again.
        </p>
        <Button onClick={handleNewGame} className="mt-4 neon-border">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="movie-guesser-layout">
      <div className="movie-poster-container">
        <MoviePoster 
          posterUrl={movie.Poster} 
          revealPercentage={revealPercentage}
          className="movie-poster glass-card"
        />
      </div>
      
      <div className="movie-content">
        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center">
              <h2 className="text-xl font-bold text-foreground neon-text">Movie Plot</h2>
              {movie.Year && (
                <span className="ml-auto badge px-3 py-1 text-sm">
                  <span className="text-foreground/80">Year: </span>
                  <span className="font-semibold text-accent ml-1">{movie.Year}</span>
                </span>
              )}
            </div>
            <div className="bg-black/40 p-4 rounded-lg glass">
              <p className="text-foreground/90 leading-relaxed">{movie.Plot}</p>
            </div>
          </CardContent>
        </Card>
        
        <MovieGuessInput 
          onGuess={handleGuess} 
          disabled={gameStatus !== 'playing'}
          attemptsLeft={MAX_ATTEMPTS - attempts}
          movieTitle={movie.Title}
        />
        
        {message && (
          <div className={`mt-6 rounded-lg p-5 text-center glass ${
            gameStatus === 'won' 
              ? 'bg-primary/10 text-primary border border-primary/20 neon-border' 
              : gameStatus === 'lost' 
                ? 'bg-destructive/10 text-destructive-foreground border border-destructive/20' 
                : 'bg-secondary/10 text-secondary-foreground border border-secondary/20'
          }`}>
            <p className={`font-medium ${gameStatus === 'won' ? 'neon-text' : ''}`}>{message}</p>
          </div>
        )}
        
        {gameStatus !== 'playing' && (
          <Button 
            onClick={handleNewGame}
            className="mt-6 w-full py-6 text-lg font-semibold neon-border"
            variant={gameStatus === 'won' ? 'default' : 'secondary'}
          >
            Play Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default MovieGuesser;
