import React, { useRef, useState } from "react";
import { useRandomMovie } from "../queries/movieQueries";
import { triggerConfetti } from "../utils/animationUtils";
import { LetterInputRef } from "./LetterInput";
import MovieGuessInput from "./MovieGuessInput";
import MoviePoster from "./MoviePoster";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
  const handleNewGame = () => {
    setAttempts(0);
    setGameStatus('playing');
    setRevealPercentage(REVEAL_PERCENTAGES[0]);
    setMessage('');
    refetch();
    if (letterInputRef.current) {
      letterInputRef.current.clear();
    }
  };

  const handleGuess = (guess: string) => {
    if (!movie || gameStatus !== 'playing') return;
    
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedTitle = movie.Title.toLowerCase().trim();
    
    const isCorrect = normalizedGuess === normalizedTitle;
    
    if (isCorrect) {
      setGameStatus('won');
      setRevealPercentage(100);
      setMessage(`Brilliant deduction, detective! You've cracked the case of "${movie.Title}"!`);
      
      // Trigger confetti animation
      triggerConfetti();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setGameStatus('lost');
        setRevealPercentage(100);
        setMessage(`Mystery unsolved! The film was "${movie.Title}". Better luck on your next case, detective.`);
      } else {
        setRevealPercentage(REVEAL_PERCENTAGES[newAttempts]);
        setMessage(`Not quite! The plot thickens... ${MAX_ATTEMPTS - newAttempts} clues remaining.`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center min-h-[400px]">
        <div className="loading-spinner h-16 w-16"></div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4 text-center min-h-[400px] p-8">
        <h2 className="text-xl font-bold text-primary">
          Case File Corrupted
        </h2>
        <p className="description">
          Our film archives seem to be experiencing technical difficulties. Let's try another case.
        </p>
        <Button onClick={handleNewGame} className="mt-4">Reopen Investigation</Button>
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
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-primary">
                Case File Synopsis
              </CardTitle>
              {movie.Year && (
                <div className="badge primary">
                  <span className="text-sm font-semibold">
                    Year: <span className="font-bold ml-1">{movie.Year}</span>
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="bg-secondary/30 p-4 rounded-lg">
              <p className="description text-left">
                {movie.Plot}
              </p>
            </div>
          </CardContent>
        </Card>

        <div>
          <MovieGuessInput
            onGuess={handleGuess}
            disabled={gameStatus !== "playing"}
            attemptsLeft={MAX_ATTEMPTS - attempts}
            movieTitle={movie.Title}
            ref={letterInputRef}
          />
        </div>

        {message && (
          <div>
            <div
              className={`rounded-lg p-5 text-center ${
                gameStatus === "won"
                  ? "bg-primary/10 border border-primary/20"
                  : gameStatus === "lost"
                  ? "bg-destructive/10 border border-destructive/20"
                  : "bg-secondary/30 border border-secondary/20"
              }`}
            >
              <p
                className={`font-medium ${
                  gameStatus === "won" ? "text-primary" : ""
                }`}
              >
                {message}
              </p>
            </div>
          </div>
        )}

        {gameStatus !== "playing" && (
          <Button
            onClick={handleNewGame}
            className="w-full mt-4"
            variant={gameStatus === "won" ? "default" : "secondary"}
          >
            {gameStatus === "won" ? "Solve Another Mystery" : "Try A New Case"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MovieGuesser;
