import React, { useEffect, useRef, useState } from "react";
import { useRandomMovie } from "../queries/movieQueries";
import { triggerConfetti } from "../utils/animationUtils";
import { LetterInputRef, LetterState } from "./LetterInput";
import MovieGuessInput from "./MovieGuessInput";
import MoviePoster from "./MoviePoster";
import Spoiler from "./Spoiler";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const MAX_ATTEMPTS = 3;
const REVEAL_PERCENTAGES = [30, 60, 100]; // Reveal percentages for each attempt

const MovieGuesser: React.FC = () => {
  const [attempts, setAttempts] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [revealPercentage, setRevealPercentage] = useState<number>(REVEAL_PERCENTAGES[0]);
  const [message, setMessage] = useState<string>('');
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [guessInProgress, setGuessInProgress] = useState<boolean>(false);
  const letterInputRef = useRef<LetterInputRef>(null);
  
  const { 
    data: movie, 
    isLoading, 
    isError, 
    refetch 
  } = useRandomMovie();

  // When correct letters change, prefill them in the input
  useEffect(() => {
    if (letterInputRef.current && movie && correctLetters.length > 0) {
      letterInputRef.current.prefillCorrectLetters(movie.Title, correctLetters);
    }
  }, [correctLetters, movie]);

  // Reset the game state when a new movie is loaded
  const handleNewGame = () => {
    setAttempts(0);
    setGameStatus('playing');
    setRevealPercentage(REVEAL_PERCENTAGES[0]);
    setMessage('');
    setCorrectLetters([]);
    setGuessInProgress(false);
    refetch();
    if (letterInputRef.current) {
      letterInputRef.current.clear();
    }
  };

  const handleGuess = (guess: string) => {
    if (!movie || gameStatus !== 'playing' || guessInProgress) return;
    
    // Set guessInProgress to prevent multiple guesses being processed simultaneously
    setGuessInProgress(true);
    
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedTitle = movie.Title.toLowerCase().trim();
    
    const isCorrect = normalizedGuess === normalizedTitle;
    
    if (isCorrect) {
      setGameStatus('won');
      setRevealPercentage(100); // Ensure poster is fully revealed on success
      setMessage(`Brilliant deduction, detective! You've cracked the case of "${movie.Title}"!`);
      
      // Trigger confetti animation
      triggerConfetti();
    } else {
      // Check which letters are correct
      const guessLetters = normalizedGuess.split('');
      const titleLetters = normalizedTitle.split('');
      const letterStates: LetterState[] = Array(guessLetters.length).fill('absent');
      
      // Find correct letters
      const newCorrectLetters = [...correctLetters];
      
      // Create a copy of titleLetters to track which letters have been matched
      const remainingTitleLetters = [...titleLetters];
      
      // Check for exact matches first
      guessLetters.forEach((letter, index) => {
        if (index < titleLetters.length && letter === titleLetters[index]) {
          letterStates[index] = 'correct';
          if (!newCorrectLetters.includes(letter)) {
            newCorrectLetters.push(letter);
          }
          // Mark this letter as used
          remainingTitleLetters[index] = '*';
        }
      });
      
      // Check for letters that are present but in wrong position
      guessLetters.forEach((letter, index) => {
        if (letterStates[index] !== 'correct') {
          const titleIndex = remainingTitleLetters.indexOf(letter);
          if (titleIndex !== -1) {
            letterStates[index] = 'present';
            if (!newCorrectLetters.includes(letter)) {
              newCorrectLetters.push(letter);
            }
            // Mark this letter as used
            remainingTitleLetters[titleIndex] = '*';
          }
        }
      });
      
      // Update correct letters
      setCorrectLetters(newCorrectLetters);
      
      // Apply letter states to the input
      if (letterInputRef.current) {
        letterInputRef.current.setLetterStates(letterStates);
      }
      
      // If all letters are wrong, clear the input after a delay
      const allWrong = letterStates.every(state => state === 'absent');
      if (allWrong) {
        setTimeout(() => {
          if (letterInputRef.current) {
            letterInputRef.current.clear();
          }
          // Allow new guesses after clearing
          setGuessInProgress(false);
        }, 1000);
      } else {
        // For partially correct guesses, prefill the correct letters after a short delay
        setTimeout(() => {
          if (letterInputRef.current && movie) {
            letterInputRef.current.prefillCorrectLetters(movie.Title, newCorrectLetters);
          }
          setGuessInProgress(false);
        }, 500);
      }
      
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
          discoveredLetters={correctLetters}
          movieTitle={movie.Title}
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
                {movie.Plot ? (
                  <>
                    {movie.Plot.split(new RegExp(`(${movie.Title})`, 'gi')).map((part, index) => {
                      // Check if this part matches the movie title (case insensitive)
                      if (part.toLowerCase() === movie.Title.toLowerCase()) {
                        return <Spoiler key={index} text={part} />;
                      }
                      return part;
                    })}
                  </>
                ) : (
                  'No plot available.'
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <div>
          <MovieGuessInput
            onGuess={handleGuess}
            disabled={gameStatus !== "playing" || guessInProgress}
            attemptsLeft={MAX_ATTEMPTS - attempts}
            movieTitle={movie.Title}
            correctLetters={correctLetters}
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
