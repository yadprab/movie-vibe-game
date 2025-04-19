import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { animateShake } from '../utils/animationUtils';

interface MovieGuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
  attemptsLeft: number;
}

const MovieGuessInput: React.FC<MovieGuessInputProps> = ({
  onGuess,
  disabled = false,
  attemptsLeft,
}) => {
  const [guess, setGuess] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (guess.trim() && !disabled) {
      onGuess(guess.trim());
      setGuess('');
    } else if (!guess.trim() && inputRef.current) {
      // Shake the input if it's empty
      animateShake(inputRef.current);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-holographic-silver">
          Guess the Movie
        </h3>
        <div className="text-sm text-holographic-silver">
          Attempts left: <span className="font-bold text-electric-lavender">{attemptsLeft}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter movie title..."
          value={guess}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGuess(e.target.value)}
          disabled={disabled}
          className="flex-1"
          autoComplete="off"
        />
        <Button 
          type="submit" 
          disabled={disabled || !guess.trim()}
          variant="default"
        >
          Guess
        </Button>
      </form>
      
      <div className="text-sm text-holographic-silver/70">
        {disabled ? (
          <p>Game over! Start a new game to play again.</p>
        ) : (
          <p>Enter the full movie title to make a guess.</p>
        )}
      </div>
    </div>
  );
};

export default MovieGuessInput;
