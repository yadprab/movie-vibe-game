import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import LetterInput, { LetterInputRef } from './LetterInput';

interface MovieGuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
  attemptsLeft: number;
  movieTitle?: string;
}

const MovieGuessInput: React.FC<MovieGuessInputProps> = ({
  onGuess,
  disabled = false,
  attemptsLeft,
  movieTitle = '',
}) => {
  const letterInputRef = useRef<LetterInputRef>(null);

  const handleGuessComplete = (guess: string) => {
    if (disabled || !guess.trim()) return;
    
    onGuess(guess.trim());
  };

  // Calculate the average movie title length or use a default
  const guessLength = movieTitle ? movieTitle.replace(/[^a-zA-Z]/g, '').length : 10;

  return (
    <Card className="glass-card">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-xl font-bold text-foreground neon-text">
            Guess the Movie
          </CardTitle>
          <div className="badge ml-4 px-4 py-2 rounded-full bg-primary/20 border-2 border-primary/40 neon-border">
            <span className="text-sm font-semibold text-primary">
              Attempts left: <span className="font-bold text-lg ml-1">{attemptsLeft}</span>
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6 pt-0">
        <div className="mb-6">
          <LetterInput
            ref={letterInputRef}
            length={guessLength}
            onComplete={handleGuessComplete}
            disabled={disabled}
          />
        </div>
        
        <div className="mt-4 text-sm text-foreground/80 p-4 rounded-lg bg-black/60 glass">
          {disabled ? (
            <p>Game over! Start a new game to play again.</p>
          ) : (
            <p>Type the movie title to make a guess. Each letter goes in a separate box.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieGuessInput;
