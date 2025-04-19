import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

export type LetterState = 'idle' | 'correct' | 'present' | 'absent';

export interface LetterInputRef {
  setLetterStates: (states: LetterState[]) => void;
  clear: () => void;
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
    }
  }, [disabled, length]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    // Only accept letters
    if (!/^[a-zA-Z]*$/.test(value)) return;

    // Update the current letter
    const newLetters = [...letters];
    newLetters[index] = value.toUpperCase();
    setLetters(newLetters);

    // Move to the next input if a letter was entered
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all letters are filled
    if (newLetters.every(letter => letter) && !newLetters.includes('')) {
      // Submit the guess automatically
      onComplete(newLetters.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Move to the previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !letters[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }

    // Move to the next input on right arrow key
    if (e.key === 'ArrowRight' && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Move to the previous input on left arrow key
    if (e.key === 'ArrowLeft' && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/[^a-zA-Z]/g, '').toUpperCase();
    
    if (!pastedText) return;

    const newLetters = [...letters];
    
    // Fill as many letters as possible from the pasted text
    for (let i = 0; i < Math.min(pastedText.length, length); i++) {
      newLetters[i] = pastedText[i];
    }
    
    setLetters(newLetters);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newLetters.findIndex(letter => !letter);
    if (nextEmptyIndex !== -1 && nextEmptyIndex < length && inputRefs.current[nextEmptyIndex]) {
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

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    setLetterStates: (states: LetterState[]) => {
      setLetterStates(states);
    },
    clear: () => {
      setLetters(Array(length).fill(''));
      setLetterStates(Array(length).fill('idle'));
      if (inputRefs.current[0]) {
        inputRefs.current[0]?.focus();
      }
    }
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
            disabled={disabled}
            className={`letter-input ${letterStates[index] !== 'idle' ? letterStates[index] : ''}`}
            aria-label={`Letter ${index + 1}`}
          />
        </div>
      ))}
    </div>
  );
});

LetterInput.displayName = 'LetterInput';

export default LetterInput;
