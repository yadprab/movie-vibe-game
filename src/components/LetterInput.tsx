import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

export type LetterState = 'idle' | 'correct' | 'present' | 'absent';

export interface LetterInputRef {
  setLetterStates: (states: LetterState[]) => void;
  clear: () => void;
  prefillCorrectLetters: (movieTitle: string, correctLetters: string[]) => void;
}

interface LetterInputProps {
  length: number;
  onComplete: (guess: string) => void;
  disabled?: boolean;
}

const LetterInput = forwardRef<LetterInputRef, LetterInputProps>(({
  length,
  onComplete,
  disabled = false,
}, ref) => {
  const [letters, setLetters] = useState<string[]>(Array(length).fill(''));
  const [letterStates, setLetterStates] = useState<LetterState[]>(Array(length).fill('idle'));
  const [prefilled, setPrefilled] = useState<boolean[]>(Array(length).fill(false));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize inputRefs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
    while (inputRefs.current.length < length) {
      inputRefs.current.push(null);
    }
  }, [length]);

  // Focus the first input on mount
  useEffect(() => {
    if (!disabled && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [disabled]);

  // Reset the input when disabled changes
  useEffect(() => {
    if (disabled) {
      setLetters(Array(length).fill(''));
      setLetterStates(Array(length).fill('idle'));
      setPrefilled(Array(length).fill(false));
    }
  }, [disabled, length]);

  const handleChange = (index: number, value: string) => {
    if (disabled || prefilled[index]) return;

    // Only accept letters
    if (!/^[a-zA-Z]*$/.test(value)) return;

    // Update the current letter
    const newLetters = [...letters];
    newLetters[index] = value.toUpperCase();
    setLetters(newLetters);

    // Move to the next input if a letter was entered
    if (value && index < length - 1) {
      // Find the next non-prefilled input
      const nextIndex = findNextEmptyIndex(index + 1);
      if (nextIndex !== -1 && inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      }
    }

    // Check if all letters are filled
    if (newLetters.every(letter => letter) && !newLetters.includes('')) {
      // Submit the guess automatically
      onComplete(newLetters.join(''));
    }
  };

  const findNextEmptyIndex = (startIndex: number): number => {
    for (let i = startIndex; i < length; i++) {
      if (!prefilled[i]) {
        return i;
      }
    }
    return -1;
  };

  const findPrevEmptyIndex = (startIndex: number): number => {
    for (let i = startIndex; i >= 0; i--) {
      if (!prefilled[i]) {
        return i;
      }
    }
    return -1;
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || prefilled[index]) return;

    // Move to the previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !letters[index] && index > 0) {
      const prevIndex = findPrevEmptyIndex(index - 1);
      if (prevIndex !== -1 && inputRefs.current[prevIndex]) {
        inputRefs.current[prevIndex]?.focus();
      }
    }

    // Move to the next input on right arrow key
    if (e.key === 'ArrowRight' && index < length - 1) {
      const nextIndex = findNextEmptyIndex(index + 1);
      if (nextIndex !== -1 && inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      }
    }

    // Move to the previous input on left arrow key
    if (e.key === 'ArrowLeft' && index > 0) {
      const prevIndex = findPrevEmptyIndex(index - 1);
      if (prevIndex !== -1 && inputRefs.current[prevIndex]) {
        inputRefs.current[prevIndex]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/[^a-zA-Z]/g, '').toUpperCase();
    
    if (!pastedText) return;

    const newLetters = [...letters];
    
    // Fill as many letters as possible from the pasted text
    let pasteIndex = 0;
    for (let i = 0; i < length; i++) {
      if (!prefilled[i] && pasteIndex < pastedText.length) {
        newLetters[i] = pastedText[pasteIndex++];
      }
    }
    
    setLetters(newLetters);

    // Focus the next empty input or the last input
    const nextEmptyIndex = findNextEmptyIndex(0);
    if (nextEmptyIndex !== -1 && inputRefs.current[nextEmptyIndex]) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else if (inputRefs.current[length - 1]) {
      inputRefs.current[length - 1]?.focus();
    }

    // Check if all letters are filled
    if (newLetters.every(letter => letter) && !newLetters.includes('')) {
      // Submit the guess automatically
      onComplete(newLetters.join(''));
    }
  };

  // Prefill correct letters in their positions
  const prefillCorrectLetters = (movieTitle: string, correctLetters: string[]) => {
    if (!movieTitle || correctLetters.length === 0) return;
    
    // Normalize the movie title - only keep letters (no spaces or special characters)
    const normalizedTitle = movieTitle.toUpperCase().replace(/[^A-Z]/g, '');
    const titleLetters = normalizedTitle.split('');
    
    const newLetters = [...letters];
    const newPrefilled = [...prefilled];
    
    // First, clear any non-prefilled positions
    for (let i = 0; i < length; i++) {
      if (!newPrefilled[i]) {
        newLetters[i] = '';
      }
    }
    
    // Only prefill letters that are in the correct position
    for (let i = 0; i < Math.min(titleLetters.length, length); i++) {
      const letter = titleLetters[i];
      
      // If the letter is in the correctLetters array AND it's in the correct position
      if (correctLetters.includes(letter.toLowerCase())) {
        // Check if this is an exact match (correct position)
        const letterLower = letter.toLowerCase();
        const normalizedTitleLower = normalizedTitle.toLowerCase();
        
        // Find all occurrences of this letter in the title
        const positions: number[] = [];
        for (let j = 0; j < normalizedTitleLower.length; j++) {
          if (normalizedTitleLower[j] === letterLower) {
            positions.push(j);
          }
        }
        
        // If this position is one of the correct positions for this letter
        if (positions.includes(i)) {
          newLetters[i] = letter;
          newPrefilled[i] = true;
        }
      }
    }
    
    setLetters(newLetters);
    setPrefilled(newPrefilled);
    
    // Focus the first empty input
    const nextEmptyIndex = findNextEmptyIndex(0);
    if (nextEmptyIndex !== -1 && inputRefs.current[nextEmptyIndex]) {
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    setLetterStates: (states: LetterState[]) => {
      setLetterStates(states);
    },
    clear: () => {
      setLetters(Array(length).fill(''));
      setLetterStates(Array(length).fill('idle'));
      setPrefilled(Array(length).fill(false));
      if (inputRefs.current[0]) {
        inputRefs.current[0]?.focus();
      }
    },
    prefillCorrectLetters
  }));

  return (
    <div className="letter-input-grid">
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="letter-input-wrapper">
          <input
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            maxLength={1}
            value={letters[index]}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled || prefilled[index]}
            className={`letter-input ${letterStates[index] !== 'idle' ? letterStates[index] : ''} ${prefilled[index] ? 'prefilled' : ''}`}
            aria-label={`Letter ${index + 1}`}
          />
        </div>
      ))}
    </div>
  );
});

LetterInput.displayName = 'LetterInput';

export default LetterInput;
